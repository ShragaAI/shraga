import logging

from opensearchpy import NotFoundError
from pydash import _

from ..config import get_config
from ..models import AnalyticsRequest
from .get_history_client import get_history_client

logger = logging.getLogger(__name__)


def is_analytics_authorized(email: str):
    if not get_config("history.analytics") or not email or "@" not in email:
        return False
    if email in get_config("history.analytics.users", []):
        return True
    _, domain = email.split("@")
    if domain in get_config("history.analytics.domains", []):
        return True
    return False


async def get_analytics(request: AnalyticsRequest) -> dict:
    try:
        shraga_config = get_config()
        client, index = get_history_client(shraga_config)
        if not client:
            return dict()

        filters = []
        if request.start and request.end:
            filters.append(
                {
                    "range": {
                        "timestamp": {
                            "gte": request.start,
                            "lte": request.end,
                        }
                    }
                }
            )
        elif request.start:
            filters.append(
                {
                    "range": {
                        "timestamp": {
                            "gte": request.start,
                        }
                    }
                }
            )
        elif request.end:
            filters.append(
                {
                    "range": {
                        "timestamp": {
                            "lte": request.end,
                        }
                    }
                }
            )

        flow_stats_query = {
            "size": 0,
            "query": {
                "bool": {
                    "filter": filters + [{"term": {"msg_type": "flow_stats"}}]
                }
            },
            "aggs": {
                "latency_percentiles": {
                    "percentiles": {
                        "field": "stats.latency",
                        "percents": [50, 75, 95, 99, 99.9],
                    }
                },
                "input_tokens_percentiles": {
                    "percentiles": {
                        "field": "stats.input_tokens",
                        "percents": [50, 75, 95, 99, 99.9],
                    }
                },
                "output_tokens_percentiles": {
                    "percentiles": {
                        "field": "stats.output_tokens",
                        "percents": [50, 75, 95, 99, 99.9],
                    }
                },
                "time_took_percentiles": {
                    "percentiles": {
                        "field": "stats.time_took",
                        "percents": [50, 75, 95, 99, 99.9],
                    }
                }
            }
        }
        
        flow_stats_response = client.search(index=index, body=flow_stats_query)
        
        return {
            "latency": _.get(flow_stats_response, "aggregations.latency_percentiles.values", {}),
            "input_tokens": _.get(flow_stats_response, "aggregations.input_tokens_percentiles.values", {}),
            "output_tokens": _.get(flow_stats_response, "aggregations.output_tokens_percentiles.values", {}),
            "time_took": _.get(flow_stats_response, "aggregations.time_took_percentiles.values", {}),
        }
    
    except NotFoundError:
        logger.error("Error retrieving analytics (index not found)")
        return dict()
    except Exception as e:
        logger.exception("Error retrieving analytics", exc_info=e)
        return dict()
