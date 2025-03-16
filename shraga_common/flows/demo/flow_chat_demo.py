from typing import Optional

from shraga_common import ShragaConfig
from shraga_common.flows.builtin.llm_flow_base import LLMFlowBase
from shraga_common.flows.demo.prompts import CHAT_HISTORY_PROMPT
from shraga_common.services import BedrockService


class ChatDemoFlow(LLMFlowBase):

    llm_model_provider = "cohere"
    llm_model_name = "sonnet_3_5"

    def __init__(self, config: ShragaConfig, flows: Optional[dict] = None):
        super().__init__(config, flows)
        self.config = config
        self.bedrock_service = BedrockService(config)

    def get_prompt(self):
        return CHAT_HISTORY_PROMPT

    def format_prompt(self, question: str, format_info: Optional[dict] = None):
        prompt = self.get_prompt()
        return prompt.format(
            question=question,
            formatted_history=LLMFlowBase.format_chat_history(
                format_info["chat_history"], format_info["history_window"]
            ),
        )

    @staticmethod
    def id():
        return "chat-history-flow-v1"

    @staticmethod
    def description():
        return "Chat history flow"
