import asyncio
from abc import ABC, abstractmethod
from typing import Dict, List, Optional

from .common import RetrieverConfig


class BaseSearchRetriever(ABC):
    def __init__(self, *args, **kwargs):
        self.client = None

    @staticmethod
    @abstractmethod
    def get_client(shraga_config, extra_configs: RetrieverConfig):
        pass

    @abstractmethod
    async def get_indices_list(self):
        pass

    @abstractmethod
    async def execute_vector_search(
        self,
        field_name: str,
        query_vector: List[float],
        k: int = 10,
        index_name: Optional[str] = None,
    ) -> List[Dict]:
        pass

    @abstractmethod
    async def execute_text_search(
        self, text: str, k: int = 10, index_name: Optional[str] = None
    ) -> List[Dict]:
        pass

    async def execute_empty_query(self, index_name: Optional[str] = None):
        pass

    def count(self, body: dict, index_name: str):
        return self.client.count(body, index_name)

    @abstractmethod
    def execute_with_timeout(self, body: dict, index_name: str, timeout):
        pass

    @abstractmethod
    async def execute_raw_search(
        self, raw_query: dict, index_name: Optional[str] = None
    ) -> List[Dict]:
        pass

    async def execute_raw_searches(
        self, queries: List[dict], index_name: Optional[str] = None
    ) -> List[Dict]:
        tasks = [self.execute_raw_search(query, index_name) for query in queries]
        return await asyncio.gather(*tasks)
