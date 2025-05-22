import json
import logging
from typing import Any, Optional

from shraga_common import ShragaConfig

from shraga_common.exceptions import LLMServiceUnavailableException
from .base_embedder import BaseEmbedder, BaseEmbedderGenerateOptions

import cohere

# Configure logging
logger = logging.getLogger(__name__)


class CohereEmbedder(BaseEmbedder):
    MAX_INPUT_SIZE = 128000

    def __init__(
        self,
        shraga_config: Optional[ShragaConfig] = None,
        cohere_access_key: Optional[str] = None,
    ):

        if shraga_config:
            cohere_access_key = cohere_access_key or shraga_config.get(
                "cohere.access_secret_key"
            )
        if cohere_access_key == "":
            cohere_access_key = None

        self.cohere_client = cohere.Client(cohere_access_key)

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
            response = self.cohere_client.embed(
                texts=[text],
                model="embed-v4.0",
                input_type=task,
                embedding_types=["float"],
            )

            embeddings = response.embeddings.float_
            if isinstance(embeddings, list):
                v = embeddings[0] if embeddings else None
                if not v:
                    raise LLMServiceUnavailableException("Empty embedding")
                return v
            else:
                raise LLMServiceUnavailableException("Unexpected embedding format")
        except json.JSONDecodeError as e:
            raise LLMServiceUnavailableException("Failed to decode embedding", e)
        except Exception as e:
            raise LLMServiceUnavailableException("Unexpected error", e)
