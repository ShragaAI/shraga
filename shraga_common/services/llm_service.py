from abc import abstractmethod
from typing import Literal, Optional, TypedDict

LlmModelProvider = Literal["cohere", "openai"]


class LLMServiceOptions(TypedDict):
    model_id: str
    system_prompt: Optional[str]


class LLMService:
    @abstractmethod
    async def invoke_model(
        self, prompt: str, options: Optional[LLMServiceOptions] = None
    ) -> str:
        pass
