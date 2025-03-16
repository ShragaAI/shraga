import logging
from typing import Any, Optional

import vertexai
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel

from shraga_common import ShragaConfig

from .base_embedder import BaseEmbedder, BaseEmbedderGenerateOptions

# Configure logging
logger = logging.getLogger(__name__)

GOOGLE_AI_EMBEDDING_MODEL_IDS = [
    "text-multilingual-embedding-002",
    "text-embedding-004",
]

TASK_TYPE = {"document": "RETRIEVAL_DOCUMENT", "query": "RETRIEVAL_QUERY"}


class GoogleEmbedder(BaseEmbedder):
    def __init__(
        self, shraga_config: ShragaConfig, google_ai_api_key: Optional[str] = None
    ):

        google_ai_api_key = google_ai_api_key or shraga_config.get("google.api_key")
        project_id = shraga_config.get("services.google.project_id")
        region = shraga_config.get("services.google.region")

        vertexai.init(project=project_id, location=region)

    async def generate_vector(
        self, text: str, extra_options: Optional[BaseEmbedderGenerateOptions] = None
    ) -> Any:
        if not extra_options:
            extra_options = {}
        model_name = extra_options.get("embed_model_name", "text-embedding-004")
        task = extra_options.get("task", "document")
        dimensionality = extra_options.get("dimensionality", 768)

        if model_name not in GOOGLE_AI_EMBEDDING_MODEL_IDS:
            raise ValueError(
                f"Invalid model ID. Available model IDs are: {', '.join(GOOGLE_AI_EMBEDDING_MODEL_IDS)}"
            )
        if task not in TASK_TYPE.keys():
            raise ValueError(
                f"Invalid task type. Available model IDs are: {', '.join(TASK_TYPE.keys())}"
            )

        try:
            model = TextEmbeddingModel.from_pretrained(model_name)
            inputs = [TextEmbeddingInput(text, TASK_TYPE[task])]
            kwargs = (
                dict(output_dimensionality=dimensionality) if dimensionality else {}
            )
            embeddings = model.get_embeddings(inputs, **kwargs)
            return [embedding.values for embedding in embeddings]

        except Exception as e:
            # Handle other unforeseen errors
            raise RuntimeError(f"An unexpected error occurred: {e}")
