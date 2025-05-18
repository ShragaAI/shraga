from typing import Literal, Optional

from pydantic import BaseModel


class FeedbackRequest(BaseModel):
    msg_id: str
    chat_id: str
    flow_id: str
    user_id: str
    position: Optional[int]
    feedback: Literal["thumbs_up", "thumbs_down"]
    feedback_text: Optional[str] = None
