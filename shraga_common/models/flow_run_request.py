from typing import Generic, List, Literal, Optional, TypeVar

from pydantic import BaseModel, Field

# model or default of dict
T = TypeVar("T")


class HistoryMessage(BaseModel):
    text: str
    msg_type: Literal["system", "user"]
    timestamp: Optional[str] = None


class FlowRunRequest(BaseModel, Generic[T]):
    question: Optional[str] = None
    context: T = Field(default_factory=dict)
    chat_history: Optional[List[HistoryMessage]] = []
    preferences: Optional[dict] = {}
