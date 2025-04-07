import logging
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

from shraga_common.models import FlowResponse

from ..config import get_config
from ..models import FlowRunApiRequest
from ..services import list_flows_service
from .run_flow import run_flow

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post("/run")
async def run_flow_api(
    request: Request,
    req_body: FlowRunApiRequest,
    bg_tasks: BackgroundTasks,
    keep: bool = True
) -> FlowResponse:
    return await run_flow(request, req_body, bg_tasks, keep)

@router.get("/")
async def get_flows_list(full: Optional[bool] = True) -> List[dict]:
    shraga_config = get_config()
    routes = []
    list_flows = get_config("ui.list_flows")
    default_flow = get_config("ui.default_flow")
    
    flows = list_flows_service.get_flows(shraga_config)

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

    f = list_flows_service.get_flow(flow_id)
    if not f:
        raise HTTPException(status_code=400, detail="Unknown flow id: " + flow_id)

    return f.get("preferences") or {}

