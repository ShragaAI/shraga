import logging
import traceback
from nanoid import generate as nanoid

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from fastapi.responses import JSONResponse

from shraga_common.models import FlowBase, FlowResponse

from ..config import get_config
from shraga_common import RequestCancelledException, LLMServiceUnavailableException
from ..models import FlowRunApiRequest
from .request_utils import execute_cancellable_flow
from ..services import history_service, list_flows_service
from ..utils import clean_input

logger = logging.getLogger(__name__)
router = APIRouter()

def add_log_error_task(bg_tasks: BackgroundTasks, keep: bool, request: Request, req_body: FlowRunApiRequest, text: str):
    if keep:
        bg_tasks.add_task(
            history_service.log_interaction,
            "error",
            request,
            {
                "chat_id": req_body.chat_id,
                "flow_id": req_body.flow_id,
                "text": text,
                "traceback": traceback.format_exc()
            }
        )

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
    req_body.msg_id = nanoid(size=12)
    
    available_flows = list_flows_service.get_available_flows()

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

        if keep:
            if rsp.stats:
                # log flow execution
                for stat in rsp.stats:
                    bg_tasks.add_task(history_service.log_flow, request, req_body, stat)
            # we need to run this synchronously to avoid a race condition with the FE fetching the history
            await history_service.log_system_message(request, req_body, response=rsp)

        return rsp

    except RequestCancelledException:
        add_log_error_task(bg_tasks, keep, request, req_body, "Request cancelled by client")
        return JSONResponse(status_code=500, content={"detail": "Request cancelled by client"})
    
    except LLMServiceUnavailableException as e:
        add_log_error_task(bg_tasks, keep, request, req_body, str(e))
        return JSONResponse(status_code=503, content={"detail": str(e)})

    except Exception as e:
        add_log_error_task(bg_tasks, keep, request, req_body, str(e))
        logger.exception("Error running flow:", exc_info=e)
        # Important: do not raise an exception here, otherwise background tasks will not be executed
        return JSONResponse(status_code=500, content={"detail": str(e)})
