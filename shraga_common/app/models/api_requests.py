from typing import Optional

from shraga_common.models import FlowRunRequest


class FlowRunApiRequest(FlowRunRequest):
    flow_id: str
    chat_id: Optional[str] = None
    position: Optional[int] = None
    msg_id: Optional[str] = None