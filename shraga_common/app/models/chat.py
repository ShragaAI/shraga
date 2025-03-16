from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel
from pydash import _

from shraga_common.models import FlowStats, RetrievalResult


class ChatMessage(BaseModel):
    timestamp: datetime
    chat_id: str
    flow_id: str
    text: Optional[str] = None
    user_id: Optional[str] = None
    msg_type: Literal["user", "system", "feedback", "flow_stats", "error"]
    position: Optional[int] = None
    context: Optional[dict] = None
    feedback: Optional[str] = None
    stats: Optional[List[FlowStats] | FlowStats] = None
    retrieval_results: Optional[List[RetrievalResult]] = None
    payload: Optional[dict] = None
    trace: Optional[dict] = None
    traceback: Optional[str] = None


class Chat(BaseModel):
    chat_id: str
    timestamp: datetime
    messages: List[ChatMessage] = []
    user_id: Optional[str] = None
    flow_id: Optional[str] = None
    step_stats: Optional[List[FlowStats]] = None
    total_stats: Optional[FlowStats] = None

    @staticmethod
    def from_hit(hit: dict):
        messages = sorted(
            _.get(hit, "latest.hits.hits", []), key=lambda x: x["_source"]["timestamp"]
        )

        latest_message = messages[0]["_source"] if messages else {}
        chat = Chat(
            chat_id=hit.get("key"),
            timestamp=latest_message.get("timestamp"),
            messages=[ChatMessage(**x["_source"]) for x in messages],
            user_id=latest_message.get("user_id"),
            flow_id=latest_message.get("flow_id"),
        )
        return chat
