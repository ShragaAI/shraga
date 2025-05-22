import json
import logging
from typing import Any, Dict, Optional, Tuple, Union

import boto3
from boto3.exceptions import Boto3Error

from shraga_common import ShragaConfig, LLMServiceUnavailableException
from .base_embedder import BaseEmbedder, BaseEmbedderGenerateOptions

# Configure logging
logger = logging.getLogger(__name__)


class BedrockEmbedder(BaseEmbedder):
    # According to cohere documentation, the maximum recomended input size is 512 tokens
    # https://docs.cohere.com/v2/reference/embed
    # The cohere embed method supports input of up to 2048 *characters*
    # See experiments/nevo/max_chunk_size.ipynb for more details
    MAX_INPUT_SIZE = 2048

    def __init__(
        self,
        shraga_config: Optional[ShragaConfig] = None,
        aws_access_key_id: Optional[str] = None,
        aws_secret_access_key: Optional[str] = None,
        profile_name: Optional[str] = None,
        region_name: str = "us-east-1",
    ):

        if shraga_config:
            aws_access_key_id = aws_access_key_id or shraga_config.get(
                "aws.access_key_id"
            )
            aws_secret_access_key = aws_secret_access_key or shraga_config.get(
                "aws.secret_access_key"
            )
            profile_name = profile_name or shraga_config.get("aws.profile")
        if aws_access_key_id == "":
            aws_access_key_id = None
        if aws_secret_access_key == "":
            aws_secret_access_key = None
        self.bedrock_client = boto3.client(
            service_name="bedrock-runtime",
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,
        )

    def get_endpoint_name_and_body(
        self, model_name: str, text: str, task="search_document"
    ) -> Tuple[str, Dict[str, Union[str, Any]]]:
        model_configs = {
            "cohere-multilingual": (
                "cohere.embed-multilingual-v3",
                {"texts": [text], "input_type": task, "truncate": "END"},
            ),
            "cohere": (
                "cohere.embed-english-v3",
                {"texts": [text], "input_type": task, "truncate": "END"},
            ),
            "titan": (
                "amazon.titan-embed-text-v2:0",
                {
                    "inputText": text,
                },
            ),
        }

        model_name_lower = model_name.lower()
        if model_name_lower in model_configs:
            return model_configs[model_name_lower]
        else:
            raise ValueError(f"Unsupported model type: {model_name}")

    async def generate_vector(
        self, text: str, extra_options: Optional[BaseEmbedderGenerateOptions] = None
    ) -> Any:
        try:
            if not extra_options:
                extra_options = {}

            if len(text) > self.MAX_INPUT_SIZE:
                logger.warning(
                    "Text is too long (%d) characters). Truncating to %d characters.",
                    len(text),
                    self.MAX_INPUT_SIZE,
                )
                text = text[: self.MAX_INPUT_SIZE]

            task = extra_options.get("task", "search_document")
            model_name = extra_options.get("embed_model_name", "cohere")
            model_id, body = self.get_endpoint_name_and_body(model_name, text, task)
            response = self.bedrock_client.invoke_model(
                modelId=model_id,
                body=json.dumps(body),
                accept="application/json",
                contentType="application/json",
            )

            response_body = response["body"].read().decode("utf-8")
            embeddings = json.loads(response_body).get("embeddings")
            if isinstance(embeddings, list):
                v = embeddings[0] if embeddings else None
                if not v:
                    raise LLMServiceUnavailableException("Empty embedding")
                return v
            else:
                raise LLMServiceUnavailableException("Unexpected embedding format")
        except Boto3Error as e:
            raise LLMServiceUnavailableException("Bedrock error", e)
        except json.JSONDecodeError as e:
            raise LLMServiceUnavailableException("Failed to decode embedding", e)
        except Exception as e:
            raise LLMServiceUnavailableException("Unexpected error", e)
