from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel
from pydash import _

from shraga_common.models import FlowStats, RetrievalResult


class ChatMessage(BaseModel):
    timestamp: datetime
    chat_id: str
    flow_id: str
    msg_id: Optional[str] = None
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

    @staticmethod
    def from_hit(hit: dict):
        source = hit.get("_source", {})
        return ChatMessage(**source)


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
        first_message = _.get(hit, "first.hits.hits[0]._source", {})
        last_message = _.get(hit, "latest.hits.hits[0]._source", {})

        return Chat(
            chat_id=hit.get("key"),
            timestamp=last_message.get("timestamp"),  # Use last message timestamp
            first_message=_.get(hit, "first_message.value"),
            last_message=_.get(hit, "last_message.value"),
            messages=[ChatMessage(**first_message)] if first_message else [],
            user_id=first_message.get("user_id"),
            flow_id=first_message.get("flow_id"),
        )
