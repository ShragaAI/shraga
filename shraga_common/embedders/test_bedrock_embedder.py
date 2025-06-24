import json
import unittest
from unittest.mock import MagicMock


from .bedrock_embedder import BedrockEmbedder


class TestBedrockEmbedder(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        self.embedder = BedrockEmbedder(
            aws_access_key_id="test",
            aws_secret_access_key="test",
        )
        # mock the invoke_model method
        text = json.dumps({"embeddings": [[0.1, 0.2, 0.3]]}).encode("utf-8")
        stream_mock = MagicMock()
        stream_mock.read.return_value = text

        self.embedder.bedrock_client.invoke_model = MagicMock(
            return_value={"body": stream_mock}
        )

    def _get_invoke_texts(self):
        # Extract the actual call arguments
        _, kwargs = self.embedder.bedrock_client.invoke_model.call_args

        # Verify body is present
        self.assertIn("body", kwargs)

        # The body is likely JSON string; parse it and validate
        actual_body_json = json.loads(kwargs["body"])
        return actual_body_json.get("texts")

    async def test_embed(self):
        await self.embedder.generate_vector("text")
        self.embedder.bedrock_client.invoke_model.assert_called_once()
        self.assertIn("text", self._get_invoke_texts())

    async def test_embed_long(self):
        await self.embedder.generate_vector("text " * 1000)
        self.embedder.bedrock_client.invoke_model.assert_called_once()
        invoke_text = self._get_invoke_texts()[0]
        self.assertEqual(len(invoke_text), 2048)
