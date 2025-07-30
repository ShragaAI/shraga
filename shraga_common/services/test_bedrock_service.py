import unittest
from unittest.mock import patch, MagicMock, AsyncMock
from shraga_common.services.bedrock_service import BedrockService, InvokeConfig, LLMServiceUnavailableException
import json
from json import JSONDecodeError

class TestBedrockService(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.service = BedrockService()
        self.system_prompt = ["system"]
        self.prompt = "prompt"
        self.tool_config = {}

    async def test_invoke_converse_model_invalid_json_triggers_retry(self):
        # Simulate a response with invalid JSON in the text field
        mock_boto = MagicMock()
        
        mock_boto.converse.side_effect = [
            # First call - invalid JSON
            {
                "metrics": {"latencyMs": 1},
                "usage": {"inputTokens": 1, "outputTokens": 1, "totalTokens": 2},
                "output": {"message": {"content": [{"text": '{"aaaaaaa": )'}]}},
            },
            # Second call (retry) - valid JSON
            {
                "metrics": {"latencyMs": 1},
                "usage": {"inputTokens": 1, "outputTokens": 1, "totalTokens": 2},
                "output": {"message": {"content": [{"text": '{"ok": true}'}]}},
            }
        ]
        self.service.boto = mock_boto
        options = InvokeConfig(model_id="sonnet_3", parse_json=True, is_retry=False)

        # Patch self.service.invoke_converse_model to call the real method, but monitor calls
        with patch.object(BedrockService, "invoke_converse_model", wraps=self.service.invoke_converse_model) as spy_invoke:
            result = await self.service.invoke_converse_model(self.system_prompt, self.prompt, self.tool_config, options)
            # The spy should have been called twice: once for the initial call, once for the retry
            self.assertEqual(spy_invoke.call_count, 2)
            # After retry, is_retry should be True
            self.assertTrue(options.is_retry)
            # The result should be the successful retry result
            self.assertEqual(result.json, {"ok": True})
            
            
    async def test_invoke_converse_model_invalid_json_fails_after_retry(self):
        # Simulate a response with invalid JSON in the text field
        mock_boto = MagicMock()

        mock_boto.converse.side_effect = [
            # First call - invalid JSON
            {
                "metrics": {"latencyMs": 1},
                "usage": {"inputTokens": 1, "outputTokens": 1, "totalTokens": 2},
                "output": {"message": {"content": [{"text": '{"aaaaaaa": )'}]}},
            },
            # Second call (retry) - valid JSON
            {
                "metrics": {"latencyMs": 1},
                "usage": {"inputTokens": 1, "outputTokens": 1, "totalTokens": 2},
                "output": {"message": {"content": [{"text": '{"aaaaaaa": )'}]}},
            }
        ]
        self.service.boto = mock_boto
        options = InvokeConfig(model_id="sonnet_3", parse_json=True, is_retry=False)

        # Patch self.service.invoke_converse_model to call the real method, but monitor calls
        with patch.object(BedrockService, "invoke_converse_model", wraps=self.service.invoke_converse_model) as spy_invoke:
            # Assert that JSONDecodeError is raised 
            with self.assertRaises(JSONDecodeError):
                await self.service.invoke_converse_model(self.system_prompt, self.prompt, self.tool_config, options)

    async def test_invoke_converse_model_valid_json_no_retry(self):
        # Simulate a response with valid JSON in the text field
        mock_boto = MagicMock()
        mock_boto.converse.return_value = {
            "metrics": {"latencyMs": 1},
            "usage": {"inputTokens": 1, "outputTokens": 1, "totalTokens": 2},
            "output": {"message": {"content": [{"text": '{"ok": true}'}]}},
        }
        self.service.boto = mock_boto
        options = InvokeConfig(model_id="sonnet_3", parse_json=True, is_retry=False)
        
        # No need to patch json.loads - the real one should work fine with valid JSON
        with patch.object(BedrockService, "invoke_converse_model", wraps=self.service.invoke_converse_model) as spy_invoke:
            result = await self.service.invoke_converse_model(self.system_prompt, self.prompt, self.tool_config, options)
            
            # Assertions
            self.assertEqual(spy_invoke.call_count, 1)
            self.assertFalse(options.is_retry)
            self.assertEqual(result.json, {"ok": True})

    async def test_invoke_converse_model_parse_json_false_does_not_call_json_loads(self):
        # Simulate a response with any text
        mock_boto = MagicMock()
        mock_boto.converse.return_value = {
            "metrics": {"latencyMs": 1},
            "usage": {"inputTokens": 1, "outputTokens": 1, "totalTokens": 2},
            "output": {"message": {"content": [{"text": '{"ok": true}'}]}},
        }
        self.service.boto = mock_boto
        options = InvokeConfig(model_id="sonnet_3", parse_json=False, is_retry=False)

        with patch("json.loads") as mock_json_loads:
            result = await self.service.invoke_converse_model(self.system_prompt, self.prompt, self.tool_config, options)
            mock_json_loads.assert_not_called()
            self.assertIsNone(result.json)

    async def test_invoke_converse_model_llm_service_unavailable_exception_no_retry(self):
        # Simulate a response that raises LLMServiceUnavailableException
        mock_boto = MagicMock()
        mock_boto.converse.side_effect = LLMServiceUnavailableException("Bedrock error")
        self.service.boto = mock_boto
        options = InvokeConfig(model_id="sonnet_3", parse_json=True, is_retry=False)

        with patch("json.loads") as mock_json_loads:
            with self.assertRaises(LLMServiceUnavailableException):
                await self.service.invoke_converse_model(self.system_prompt, self.prompt, self.tool_config, options)
            # Ensure json.loads was never called
            mock_json_loads.assert_not_called()
            # Ensure retry logic was not triggered
            self.assertFalse(options.is_retry)

if __name__ == "__main__":
    unittest.main()
