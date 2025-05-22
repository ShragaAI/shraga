import asyncio
import json
from abc import abstractmethod
from datetime import datetime
from typing import List, Optional

from shraga_common import RequestCancelledException, LLMServiceUnavailableException
from shraga_common.models import (FlowBase, FlowResponse, FlowRunRequest,
                                  HistoryMessage)
from shraga_common.services import (BedrockService, LLMService,
                                    LLMServiceOptions, OpenAIService)
from shraga_common.services.llm_service import LlmModelProvider


class LLMFlowBase(FlowBase):
    llmservice: LLMService = None
    listed = False
    llm_model_provider: LlmModelProvider = None
    llm_model_name: str = None
    parse_json: bool = True

    @abstractmethod
    def get_prompt(self):
        pass

    @staticmethod
    def format_chat_history(history: List[HistoryMessage], history_window: int):
        if not history or history_window == 0:
            return ""

        history_txt = []
        for msg in history:
            text = msg.text.strip()
            if msg.msg_type == "system":
                history_txt.append(f"Assistant: {text}\n\n")
            elif msg.msg_type == "user":
                history_txt.append(f"User: {text}\n\n")

        return "".join(history_txt[-history_window:])

    def init_model(self):
        provider = self.llm_model_provider
        if not self.llmservice:
            if provider == "cohere":
                self.llmservice = BedrockService(self.config)
            elif provider == "openai":
                self.llmservice = OpenAIService(self.config)

    def format_prompt(self, question: str, format_info: Optional[dict] = None):
        prompt = self.get_prompt()
        format_info = format_info or {}
        question = (
            format_info.get("question", question)
            .replace('"', '\\"')
            .replace("'", "\\'")
        )

        today = format_info.get("last_lookup_date", datetime.now())
        current_year = today.year
        current_date = today.strftime("%Y-%m-%d")

        format_info.update(
            {
                "question": question,
                "current_date": current_date,
                "current_year": current_year,
            }
        )
        return prompt.format(
            **format_info,
        )

    async def run_prompt(self, prompt: str):
        self.init_model()
        content = None
        response_text = ""
        payload = {}
        try:
            start_time = datetime.now()
            llm_context: LLMServiceOptions = {}
            if self.llm_model_name:
                llm_context["model_id"] = self.llm_model_name

            try:
                content = await self.llmservice.invoke_model(prompt, llm_context)
                run_time = datetime.now() - start_time
                self.trace(f"execute runtime: {run_time}")
                if self.parse_json:
                    payload = json.loads(content.text, strict=False)
                else:
                    response_text = content.text

            except asyncio.CancelledError:
                raise RequestCancelledException("LLM flow cancelled")
            except LLMServiceUnavailableException:
                raise

        except (RequestCancelledException, LLMServiceUnavailableException):
            raise
        except Exception as e:
            payload = {"error": str(e), "body": content if content else ""}

        return response_text, payload, content

    async def execute(self, request: FlowRunRequest) -> FlowResponse:
        self.trace(f"using {self.llm_model_provider}\\{self.llm_model_name}")
        prompt = self.format_prompt(
            request.question,
            {
                **(
                    request.context
                    if isinstance(request.context, dict)
                    else request.context.dict()
                ),
                "chat_history": request.chat_history,
                "history_window": request.preferences.get("history_window", 0),
            },
        )
        response_text, payload, content = await self.run_prompt(prompt)

        return FlowResponse(
            response_text=response_text,
            payload=payload,
            trace=self.trace_log,
            stats=[self.get_stats(content)],
        )

    @staticmethod
    def id():
        return "llm-routing-v1"

    @staticmethod
    def description():
        return "default llm powered routing flow."
