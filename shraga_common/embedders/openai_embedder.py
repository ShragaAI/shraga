import json
import logging
import os
import uuid
from typing import Any, List, Optional

from openai import OpenAI, OpenAIError

from shraga_common import ShragaConfig

from .base_embedder import BaseEmbedder, BaseEmbedderGenerateOptions

# Configure logging
logger = logging.getLogger(__name__)

OPENAI_EMBEDDING_MODEL_IDS = ["text-embedding-3-small", "text-embedding-3-large"]


class OpenAIEmbedder(BaseEmbedder):
    def __init__(
        self,
        shraga_config: Optional[ShragaConfig] = None,
        openai_api_key: Optional[str] = None,
    ):
        openai_api_key = openai_api_key or shraga_config.get("services.openai.api_key")
        self.client = OpenAI(api_key=openai_api_key)

    async def generate_vector(
        self, text: str, extra_options: Optional[BaseEmbedderGenerateOptions] = None
    ) -> Any:
        if not extra_options:
            extra_options = {}

        model_name = extra_options.get("embed_model_name", "text-embedding-3-small")

        if model_name not in OPENAI_EMBEDDING_MODEL_IDS:
            raise ValueError(
                f"Invalid model ID. Available model IDs are: {', '.join(OPENAI_EMBEDDING_MODEL_IDS)}"
            )

        try:
            return (
                self.client.embeddings.create(input=[text], model=model_name)
                .data[0]
                .embedding
            )
        except OpenAIError as e:
            raise RuntimeError(f"OpenAI API returned an error: {e}")
        except Exception as e:
            raise RuntimeError(f"An unexpected error occurred: {e}")

    def generate_vectors_batch(self, requests: List[dict]) -> Any:
        try:
            filename = f"batch_{uuid.uuid4().hex}.jsonl"
            with open(filename, "w") as f:
                for request in requests:
                    f.write(json.dumps(request) + "\n")

            input_file = self.client.files.create(
                file=open(filename, "rb"), purpose="batch"
            )

            os.remove(filename)

            batch_response = self.client.batches.create(
                input_file_id=input_file.id,
                endpoint="/v1/embeddings",
                completion_window="24h",
            )

            return batch_response

        except OpenAIError as e:
            logger.error(f"OpenAI API returned an error: {e}")
            raise RuntimeError(f"OpenAI API error: {e}")

    def poll_batch_job(self, job_id: str) -> Any:
        try:
            job_status = self.client.batches.retrieve(job_id)
            return job_status
        except OpenAIError as e:
            logger.error(f"Error retrieving batch job {job_id}: {e}")
            raise RuntimeError(f"Error retrieving batch job {job_id}: {e}")

    def cancel_batch_job(self, batch_id: str) -> None:
        try:
            self.client.batches.cancel(batch_id)
            logger.info(f"Batch {batch_id} canceled successfully.")
        except OpenAIError as e:
            logger.error(f"Error canceling batch {batch_id}: {e}")
            raise RuntimeError(f"Error canceling batch {batch_id}: {e}")

    def delete_file(self, file_id: str) -> None:
        try:
            deleted = self.client.files.delete(file_id)
            deleted_msg = "deleted successfully" if deleted.deleted else "not deleted"
            logger.info(f"File {file_id} {deleted_msg}.")
        except OpenAIError as e:
            logger.error(f"Error deleting file {file_id}: {e}")
            raise RuntimeError(f"Error deleting file {file_id}: {e}")

    def get_output_file_content(self, output_file_id: str) -> List[str]:
        try:
            return [
                json.loads(line)
                for line in self.client.files.content(output_file_id).text.splitlines()
            ]
        except OpenAIError as e:
            logger.error(f"Error retrieving output file {output_file_id}: {e}")
            raise RuntimeError(f"Error retrieving output file {output_file_id}: {e}")

    def list_batches(self) -> List[dict]:
        try:
            return self.client.batches.list()
        except OpenAIError as e:
            logger.error(f"Error listing batches: {e}")
            raise RuntimeError(f"Error listing batches: {e}")
