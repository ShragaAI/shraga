import time
from typing import Literal, Optional, TypedDict

from openai import OpenAI, OpenAIError

from shraga_common import ShragaConfig

from shraga_common.models import FlowStats
from .common import LLMModelResponse
from .llm_service import LLMService, LLMServiceOptions


class OpenAiModelId(TypedDict):
    gpt_4o: str
    gpt_4o_mini: str
    gpt_4_turbo: str
    turbo_3_5: str


OpenAiModelNames = Literal[tuple(OpenAiModelId.__annotations__.keys())]

OPENAI_CHAT_MODEL_IDS: OpenAiModelId = {
    "gpt_4o": "gpt-4o",  # gpt-4o-2024-05-13
    "gpt_4o_mini": "gpt-4o-mini",  # gpt-4o-mini-2024-07-18
    "gpt_4_turbo": "gpt-4-turbo",  # gpt-4-turbo-2024-04-09
    "turbo_3_5": "gpt-3.5-turbo",  # gpt-3.5-turbo-0125
}


class OpenAIService(LLMService):
    def __init__(
        self,
        shraga_config: Optional[ShragaConfig] = None,
        api_key: Optional[str] = None,
    ):
        if shraga_config:
            api_key = api_key or shraga_config.get("services.openai.api_key")

        self.client = OpenAI(api_key=api_key)

    async def invoke_model(self, prompt: str, options: LLMServiceOptions = None) -> str:
        if not options:
            options = {
                "model_id": "gpt_4o_mini",
            }

        model_name: OpenAiModelId = options.get("model_id")
        model_id = OPENAI_CHAT_MODEL_IDS[model_name]
        system_prompt = options.get("system_prompt", None)

        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            start_time = time.time()
            response = self.client.chat.completions.create(
                model=model_id, messages=messages
            )
            time_took = time.time() - start_time
            text = response.choices[0].message.content

            return LLMModelResponse(
                text=text,
                stats=FlowStats(
                    llm_model_id=model_id,
                    time_took=time_took,
                    input_tokens=len(prompt),
                    output_tokens=len(text),
                ),
            )

        except OpenAIError as e:
            # Handle OpenAI API errors
            raise RuntimeError(f"OpenAI API returned an error: {e}")

        except Exception as e:
            # Handle other unforeseen errors
            raise RuntimeError(f"An unexpected error occurred: {e}")


# Usage:
# service = OpenAIService(api_key="your_api_key_here")
# response = service.invoke_model(prompt="Your prompt here")
# print(response)
