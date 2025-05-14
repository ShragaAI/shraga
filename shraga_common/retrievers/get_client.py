from shraga_common import ShragaConfig

from .common import RetrieverConfig
from .elasticsearch import ElasticsearchRetriever
from .opensearch import OpenSearchRetriever


def get_client(shraga_config: ShragaConfig):
    opensearch_config = shraga_config.get("retrievers.opensearch")
    elasticsearch_config = shraga_config.get("retrievers.elasticsearch")
    config_obj = opensearch_config or elasticsearch_config
    config = RetrieverConfig(**config_obj)

    if not config:
        return None
    
    RetrieverClass = (
        OpenSearchRetriever if opensearch_config else ElasticsearchRetriever
    )

    return RetrieverClass.get_client(shraga_config, config)
