from logging import getLogger
from typing import Dict, List, Optional

from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError
from pydash import _

from shraga_common import ShragaConfig

from .base_search_retriever import BaseSearchRetriever
from .common import RetrieverConfig

logger = getLogger(__name__)


class ElasticsearchRetriever(BaseSearchRetriever):
    """
    ElasticsearchRetriever class
    """

    def __init__(self, shraga_config: ShragaConfig):
        super().__init__()
        config = RetrieverConfig(**shraga_config.get("retrievers.elasticsearch"))
        self.client = ElasticsearchRetriever.get_client(shraga_config, config)
        self.index_name = config.index

    @staticmethod
    def get_client(shraga_config, extra_configs: RetrieverConfig):
        use_cloud_id = extra_configs.use_cloud_id
        cloud_id = extra_configs.cloud_id
        host = extra_configs.host
        port = extra_configs.port
        verify_certs = extra_configs.verify_certs

        # Authentication method
        auth_type = extra_configs.auth_type
        if auth_type == "apikey":
            api_key = extra_configs.api_key
            auth = {"api_key": api_key} if api_key else None
        else:  # default to basic auth
            http_auth_user = extra_configs.user
            http_auth_password = extra_configs.password
            auth = (
                {"basic_auth": (http_auth_user, http_auth_password)}
                if http_auth_user and http_auth_password
                else None
            )

        if use_cloud_id:
            if not cloud_id:
                raise ValueError("cloud_id must be provided if use_cloud_id is true")
            return Elasticsearch(
                cloud_id=cloud_id, verify_certs=verify_certs, **auth
            )
        else:
            use_ssl = extra_configs.use_ssl
            if not host:
                raise ValueError("host must be provided if use_cloud_id is false")
            return Elasticsearch(
                hosts=[f"{'https' if use_ssl else 'http'}://{host}:{port}"],
                verify_certs=verify_certs,
                **auth,
            )

    async def get_indices_list(self):
        pass

    def get_doc_by_id(self, document_id: str, index_name: Optional[str] = None) -> Dict:
        try:
            # Retrieve the document
            response = self.client.get(index=index_name, id=document_id)
            return response["_source"]  # Return the document's source data
        except NotFoundError:
            print(f"Document with ID {document_id} not found in index {index_name}.")
            return None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    async def execute_empty_query(self, index_name: Optional[str] = None):
        return await self.execute_raw_search(
            {"query": {"match_all": {}}, "size": 0}, index_name
        )

    async def execute_vector_search(
        self,
        field_name: str,
        query_vector: List[float],
        k: int = 10,
        index_name: Optional[str] = None,
    ) -> List[Dict]:
        query = {
            "size": k,  # max number of results to return
            "query": {
                "knn": {
                    field_name: {
                        "vector": query_vector,
                        "k": k,  # number of nearest neighbors to return
                    }
                }
            },
        }
        return await self.execute_raw_search(query, index_name)

    async def execute_text_search(
        self,
        text: str,
        k: int = 10,
        index_name: Optional[str] = None,
    ) -> List[Dict]:
        query = {"size": k, "query": {"match": {"content": text}}}
        return await self.execute_raw_search(query)

    async def execute_raw_search(
        self, raw_query: dict, index_name: Optional[str] = None
    ) -> List[Dict]:
        try:
            response = self.client.search(
                index=index_name or self.index_name, body=raw_query
            )
            # TODO validate search response
            hits = _.get(response, "hits.hits") or []
            return hits
        except Exception as e:
            logger.error(f"Error executing search query {e}")
            raise e

    def execute_with_timeout(self, body: dict, index_name: str, timeout):
        pass
