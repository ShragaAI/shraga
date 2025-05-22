import json
from abc import abstractmethod
from datetime import datetime
from typing import Optional

from shraga_common import ShragaConfig
from shraga_common import RequestCancelledException, LLMServiceUnavailableException
from shraga_common.models import FlowResponse, FlowRunRequest
from shraga_common.services import LLMServiceOptions

from .llm_flow_base import LLMFlowBase


class AgenticPlanFlowBase(LLMFlowBase):
    llm_model_provider = "cohere"
    llm_model_name = "sonnet_3_5_v2"
    available_tools = []

    def __init__(self, config: ShragaConfig, flows: Optional[dict] = None):
        super().__init__(config, flows)
        self.tool_spec = self.tools_to_spec()

    def tools_to_spec(self):
        parsed_tool_list = []

        for tool in self.available_tools:
            tool_details = tool.get_tool_desc()
            tool_name = tool_details["flow_name"]
            tool_desc = tool_details["description"]
            tool_schema = tool_details["schema"]

            tool_json = {
                "toolSpec": {
                    "name": tool_name,
                    "description": tool_desc,
                    "inputSchema": {"json": tool_schema},
                }
            }

            parsed_tool_list.append(tool_json)

        tool_config = {"tools": parsed_tool_list}
        return tool_config

    @abstractmethod
    def get_prompt(self):
        pass

    @abstractmethod
    def format_prompt(self, question: str, format_info: Optional[dict] = None) -> str:
        pass

    @abstractmethod
    def get_system_prompts(self, request: FlowRunRequest):
        pass

    def get_chat_history(self, request: FlowRunRequest):
        chat_history = request.chat_history
        history_window = request.preferences.get("history_window", 0)
        return LLMFlowBase.format_chat_history(chat_history, history_window)

    async def execute(self, request: FlowRunRequest) -> FlowResponse:
        content = None
        response_text = ""
        payload = {}
        llm_context: LLMServiceOptions = {}
        if self.llm_model_name:
            llm_context["model_id"] = self.llm_model_name

        self.init_model()

        prompt = self.format_prompt(
            request.question,
            {
                **(
                    request.context
                    if isinstance(request.context, dict)
                    else request.context.dict()
                ),
                "chat_history": self.get_chat_history(request),
            },
        )

        system_prompts = self.get_system_prompts(request)
        start_time = datetime.now()

        try:
            content = await self.llmservice.invoke_converse_model(
                system_prompts, prompt, self.tool_spec, llm_context
            )
            run_time = datetime.now() - start_time
            self.trace(f"execute runtime: {run_time}")
            if self.parse_json:
                payload = json.loads(content.text, strict=False)
                payload = payload.get("plan", [])
            else:
                response_text = content.text

        except (RequestCancelledException, LLMServiceUnavailableException):
            raise
        except Exception as e:
            payload = {"error": str(e), "body": content if content else ""}

        return FlowResponse(
            response_text=response_text,
            payload=payload,
            trace=self.trace_log,
            stats=[self.get_stats(content)],
        )

