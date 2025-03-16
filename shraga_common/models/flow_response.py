from typing import Generic, List, Optional, TypeVar
from uuid import uuid4

from pydantic import BaseModel, Field
from pydash import _

from .flow_stats import FlowStats
from .retrieval_result import RetrievalResult

T = TypeVar("T")


class FlowResponse(BaseModel, Generic[T]):
    chat_id: str = Field(default_factory=lambda: uuid4().hex)
    response_text: Optional[str] = None
    allow_reply: bool = False
    retrieval_results: Optional[List[RetrievalResult]] = None
    payload: T = Field(default_factory=dict)
    trace: Optional[dict] = None
    stats: Optional[List[FlowStats]] = None

    def get(self, path: str, default=None):
        if self.payload:
            return _.get(self.payload, path, default)
        return None
