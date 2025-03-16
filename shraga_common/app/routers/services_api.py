from fastapi import APIRouter

from shraga_common.embedders import BedrockEmbedder
from shraga_common.retrievers import (ElasticsearchRetriever,
                                      OpenSearchRetriever)

from ..config import get_config


router = APIRouter()


@router.get("/")
async def list_services() -> dict:
    shraga_config = get_config()
    d = dict()
    try:
        embedder = BedrockEmbedder(shraga_config)
        d["embedder"] = "bedrock"
    except Exception:
        pass

    for retriever_name, r in shraga_config.retrievers().items():
        try:
            if r.get("type") == "opensearch":
                retriever = OpenSearchRetriever(shraga_config)
            elif r.get("type") == "elasticsearch":
                retriever = ElasticsearchRetriever(shraga_config)
            else:
                continue

            d["retriever:" + retriever_name] = {
                "type": r.get("type"),
                "test": await retriever.execute_empty_query(),
            }
        except Exception as e:
            d["retriever:" + retriever_name] = {
                "type": r.get("type"),
                "failure": str(e),
            }

    return d
