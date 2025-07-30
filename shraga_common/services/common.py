import re
from typing import Optional

from pydantic import BaseModel

from shraga_common.models import FlowStats


class LLMModelResponse(BaseModel):
    text: str
    json: Optional[dict] = None
    stats: Optional[FlowStats] = None

    def __init__(self, text: str, json: Optional[dict] = None, stats: Optional[FlowStats] = None):
        super().__init__(text=text, json=json, stats=stats)
        self.text = LLMModelResponse.clean_text(text)

    @staticmethod
    def clean_text(text: str) -> str:
        text = text.replace("```json", "").replace("```", "").strip()
        # clean up any text outside the curly brackets.
        # This means that responses have to be json OBJECTS
        text = re.sub(r"^[^{]*\{", "{", text)
        return text
