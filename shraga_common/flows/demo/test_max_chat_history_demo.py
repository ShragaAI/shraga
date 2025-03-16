import unittest
from unittest.mock import AsyncMock, patch

from flows.demo.flow_chat_demo import ChatDemoFlow

from shraga_common.models import FlowRunRequest, FlowStats, HistoryMessage
from shraga_common.services import LLMModelResponse


class TestChatDemoFlow(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):

        mock_config = {
            "region": "us-east-1",
            "model_id": "sonnet_3_5",
            "max_retries": 1,
        }

        self.flow = ChatDemoFlow(config=mock_config)

    @patch("shraga_common.services.BedrockService.invoke_model", new_callable=AsyncMock)
    async def test_execute_with_history(self, mock_invoke_model):

        mock_invoke_model.return_value = LLMModelResponse(
            text="Your name is Daniel", stats=FlowStats(flow_id=None)
        )

        history = [
            HistoryMessage(text="Hi, how are you? My name is Daniel", msg_type="user"),
            HistoryMessage(text="I'm ok, how are you?", msg_type="system"),
        ]

        request = FlowRunRequest(question="What is my name?", chat_history=history)

        result = await self.flow.execute(request)
        mock_invoke_model.assert_called_once()
        self.assertIn(
            "Daniel",
            result.payload["body"].text,
            "The answer does not contain 'Daniel'.",
        )
