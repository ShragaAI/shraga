import asyncio
from typing import Dict, List, Optional

import boto3
from opensearchpy import AWSV4SignerAuth, OpenSearch, RequestsHttpConnection
from pydash import _

from shraga_common import ShragaConfig

from .base_search_retriever import BaseSearchRetriever
from .common import RetrieverConfig


class OpenSearchRetriever(BaseSearchRetriever):
    """
    OpenSearchRetriever class
    """

    def __init__(self, shraga_config: ShragaConfig):
        super().__init__()
        self.config = shraga_config
        # Retrieve configurations from environment variables
        config = RetrieverConfig(**self.config.get("retrievers.opensearch"))
        self.client = OpenSearchRetriever.get_client(shraga_config, config)
        self.index_name = config.index

    @staticmethod
    def get_client(shraga_config, extra_configs: RetrieverConfig):
        host = extra_configs.host
        port = extra_configs.port
        use_ssl = True

        verify_certs = True
        if extra_configs.use_ssl is False:
            use_ssl = extra_configs.use_ssl
        else:
            verify_certs = extra_configs.verify_certs
            

        auth_method = extra_configs.auth_method
        if auth_method == "aws":
            credentials = boto3.Session().get_credentials()
            region = shraga_config.get("aws.region") or "us-east-1"
            auth = AWSV4SignerAuth(credentials, region, "es")
        else:
            http_auth_user = extra_configs.user
            http_auth_password = extra_configs.password
            auth = (http_auth_user, http_auth_password)

        return OpenSearch(
            hosts=[{"host": host, "port": port}] if port else [host],
            http_auth=auth,
            use_ssl=use_ssl,
            verify_certs=verify_certs,
            connection_class=RequestsHttpConnection,
        )

    async def get_indices_list(self):
        return self.client.cat.indices()

    async def execute_vector_search(
        self,
        field_name: str,
        query_vector: List[float],
        k: int = 10,
        index_name: Optional[str] = None,
    ) -> List[Dict]:
        query = {
            "size": k,
            "_source": {"excludes": ["vector_*", field_name]},
        }

        query_knn = {"knn": {field_name: {"vector": query_vector, "k": k}}}

        query["query"] = query_knn

        return await self.execute_raw_search(query, index_name)

    async def execute_text_search(
        self,
        text: str,
        k: int = 10,
        index_name: Optional[str] = None,
    ) -> List[Dict]:
        query = {"size": k, "query": {"match": {"content": text}}}
        return await self.execute_raw_search(query, index_name)

    def execute_with_timeout(self, body: dict, index_name: str, timeout):
        return self.client.search(body, index_name or self.index_name)

    async def execute_empty_query(self, index_name: Optional[str] = None):
        return await self.execute_raw_search(
            {"query": {"match_all": {}}, "size": 0}, index_name
        )

    async def execute_raw_search(
        self, raw_query: dict, index_name: Optional[str] = None
    ) -> List[Dict]:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            self.execute_with_timeout,
            raw_query,
            index_name or self.index_name,
            300,
        )
        # TODO validate search response
        hits = _.get(response, "hits.hits") or []
        return hits
