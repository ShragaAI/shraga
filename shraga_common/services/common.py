import re
from typing import Optional

from pydantic import BaseModel

from shraga_common.models import FlowStats


class LLMModelResponse(BaseModel):
    text: str
    stats: Optional[FlowStats] = None

    def __init__(self, text: str, stats: Optional[FlowStats] = None):
        super().__init__(text=text, stats=stats)
        self.text = self.clean_text(text)

    def clean_text(self, text: str) -> str:
        text = text.replace("```json", "").replace("```", "").strip()
        # clean up any text outside the curly brackets.
        # This means that responses have to be json OBJECTS
        text = re.sub(r"^[^{]*\{", "{", text)
        return text
