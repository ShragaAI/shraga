from .base_search_retriever import BaseSearchRetriever
from .collapse import get_inner_hits, merge_inner_hits_results
from .common import RetrieverConfig
from .elasticsearch import ElasticsearchRetriever
from .get_client import get_client

# commented out due to slow loading!
# from .google_maps import GoogleMapsRetriever
from .local import LocalRetriever
from .opensearch import OpenSearchRetriever

__all__ = [
    "ElasticsearchRetriever",
    "OpenSearchRetriever",
    "LocalRetriever",
    "BaseSearchRetriever",
    "RetrieverConfig",
    "merge_inner_hits_results",
    "get_inner_hits",
    "get_client",
]
