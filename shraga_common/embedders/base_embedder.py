import asyncio
from abc import abstractmethod
from typing import Any, Optional

from pydantic import BaseModel


class BaseEmbedderGenerateOptions(BaseModel):
    embed_model_name: Optional[str]
    task: Optional[str]


class BaseEmbedder:
    @abstractmethod
    async def generate_vector(
        self, text: str, extra_options: Optional[BaseEmbedderGenerateOptions] = None
    ) -> Any:
        pass

    async def generate_vectors(
        self,
        texts: list[str],
        extra_options: Optional[BaseEmbedderGenerateOptions] = None,
    ) -> Any:
        tasks = [
            self.generate_vector(
                q,
                extra_options,
            )
            for q in texts
        ]
        return await asyncio.gather(*tasks)
