import logging
import traceback
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from fastapi.responses import JSONResponse

from shraga_common.models import FlowBase, FlowResponse

from ..config import get_config
from ..exceptions import RequestCancelledException
from ..models import FlowRunApiRequest
from ..routers.request_utils import execute_cancellable_flow
from ..services import history_service, list_flows_service
from ..utils import clean_input

router = APIRouter()

logger = logging.getLogger(__name__)
flows = {}
available_flows = {}

def load_flows():
    global flows, available_flows
    shraga_config = get_config()
    flows = list_flows_service.get_flows(shraga_config)
    available_flows = list_flows_service.get_available_flows(shraga_config)

@router.get("/")
async def get_flows_list(full: Optional[bool] = True) -> List[dict]:
    shraga_config = get_config()
    routes = []
    list_flows = get_config("ui.list_flows")
    default_flow = get_config("ui.default_flow")

    if list_flows:
        for k, v in flows.items():
            if v["obj"].listed:
                routes.append(
                    {
                        "id": k,
                        "description": v.get("description"),
                        "preferences": v.get("preferences") if full else None,
                    }
                )
        routes.sort(key=lambda x: x["id"])
    else:
        if not default_flow:
            return routes

        default_flows = (
            [default_flow] if isinstance(default_flow, str) else default_flow
        )

        for flow_id in default_flows:
            if flow_id in flows:
                routes.append(
                    {
                        "id": flow_id,
                        "description": flows[flow_id].get("description"),
                        "preferences": (
                            flows[flow_id].get("preferences") if full else None
                        ),
                    }
                )
        routes.sort(key=lambda x: x["id"])

    return routes


@router.get("/{flow_id}/preferences")
async def get_flow_preferences(flow_id: str) -> dict:
    if get_config("ui.list_flows") is not True:
        raise HTTPException(status_code=404)

    f = flows.get(flow_id)
    if not f:
        raise HTTPException(status_code=400, detail="Unknown flow id: " + flow_id)

    return f.get("preferences") or {}


@router.post("/run")
async def run_flow(
    request: Request,
    req_body: FlowRunApiRequest,
    bg_tasks: BackgroundTasks,
    keep: bool = True,
) -> FlowResponse:
    max_length = get_config("flows.input_max_length", 1000)
    if len(req_body.question) > max_length:
        return JSONResponse(
            status_code=400,
            content={
                "detail": f"Message exceeds maximum length of {max_length} characters"
            },
        )

    req_body.question = clean_input(req_body.question)

    f = available_flows.get(req_body.flow_id)
    if not f:
        raise HTTPException(
            status_code=400, detail="Unknown flow id: " + req_body.flow_id
        )
        
    shraga_config = get_config()
    flow: FlowBase = f(shraga_config, flows=available_flows)

    if keep:
        await history_service.log_user_message(request, req_body)

    try:
        rsp = await execute_cancellable_flow(request, flow, req_body)

        if hasattr(req_body, "chat_id"):
            rsp.chat_id = req_body.chat_id

        if keep and rsp.stats:
            # log flow execution
            for stat in rsp.stats:
                bg_tasks.add_task(history_service.log_flow, request, req_body, stat)
            # we need to run this synchronously to avoid a race condition with the FE fetching the history
            await history_service.log_system_message(request, req_body, response=rsp)

        return rsp

    except RequestCancelledException:
        if keep:
            bg_tasks.add_task(
                history_service.log_interaction,
                "error",
                request,
                {
                    "chat_id": req_body.chat_id,
                    "flow_id": req_body.flow_id,
                    "text": "Request cancelled by client",
                },
            )
        return JSONResponse(
            status_code=500, content={"detail": "Request cancelled by client"}
        )

    except Exception as e:
        if keep:
            bg_tasks.add_task(
                history_service.log_interaction,
                "error",
                request,
                {
                    "chat_id": req_body.chat_id,
                    "flow_id": req_body.flow_id,
                    "text": str(e),
                    "traceback": traceback.format_exc(),
                },
            )
        logger.exception("Error running flow:", exc_info=e)
        # Important: do not raise an exception here, otherwise background tasks will not be executed
        return JSONResponse(status_code=500, content={"detail": str(e)})
