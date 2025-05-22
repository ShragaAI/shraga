import logging

from opensearchpy import NotFoundError
from pydash import _

from shraga_common.utils import is_prod_env
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

        if is_prod_env():
            filters.append({"term": {"config.prod": True}})

        daily_stats_query = {
            "size": 0,
            "query": {
                "bool": {
                    "filter": filters + [{"term": {"msg_type": "flow_stats"}}]
                }
            },
            "aggs": {
                "daily": {
                    "date_histogram": {
                        "field": "timestamp",
                        "calendar_interval": "day",
                        "format": "yyyy-MM-dd",
                    },
                    "aggs": {
                        "latency_percentiles": {
                            "percentiles": {
                                "field": "stats.latency",
                                "percents": [50, 90, 99],
                            }
                        },
                        "input_tokens_percentiles": {
                            "percentiles": {
                                "field": "stats.input_tokens",
                                "percents": [50, 90, 99],
                            }
                        },
                        "output_tokens_percentiles": {
                            "percentiles": {
                                "field": "stats.output_tokens",
                                "percents": [50, 90, 99],
                            }
                        },
                        "time_took_percentiles": {
                            "percentiles": {
                                "field": "stats.time_took",
                                "percents": [50, 90, 99],
                            }
                        }
                    }
                }
            }
        }

        usage_stats_query = {
            "size": 0,
            "query": {
                "bool": {
                    "filter": filters
                }
            },
            "aggs": {
                "total_chats": {
                    "cardinality": {
                        "field": "chat_id"
                    }
                },
                "total_users": {
                    "cardinality": {
                        "field": "user_id"
                    }
                },
                "user_messages": {
                    "filter": {
                        "term": {
                            "msg_type": "user"
                        }
                    },
                    "aggs": {
                        "count": {
                            "value_count": {
                                "field": "_id"
                            }
                        }
                    }
                },
                "assistant_messages": {
                    "filter": {
                        "term": {
                            "msg_type": "system"
                        }
                    },
                    "aggs": {
                        "count": {
                            "value_count": {
                                "field": "_id"
                            }
                        }
                    }
                } 
            }
        }

        daily_stats_response = client.search(index=index, body=daily_stats_query)
        usage_stats_response = client.search(index=index, body=usage_stats_query)

        daily_stats = []
        for bucket in _.get(daily_stats_response, "aggregations.daily.buckets", []):
            daily_stats.append({
                "date": bucket["key_as_string"],
                "latency": _.get(bucket, "latency_percentiles.values", {}),
                "input_tokens": _.get(bucket, "input_tokens_percentiles.values", {}),
                "output_tokens": _.get(bucket, "output_tokens_percentiles.values", {}), 
                "time_took": _.get(bucket, "time_took_percentiles.values", {}),
            })
        
        user_messages = _.get(usage_stats_response, "aggregations.user_messages.count.value", 0)
        assistant_messages = _.get(usage_stats_response, "aggregations.assistant_messages.count.value", 0)

        user_stats = {
            "total_chats": _.get(usage_stats_response, "aggregations.total_chats.value", 0),
            "total_users": _.get(usage_stats_response, "aggregations.total_users.value", 0),
            "total_messages": {
                "user": user_messages,
                "assistant": assistant_messages
            }
        }
        
        return {
            "daily": daily_stats,
            "overall": user_stats
        }
    
    except NotFoundError:
        logger.error("Error retrieving analytics (index not found)")
        return dict()
    except Exception as e:
        logger.exception("Error retrieving analytics", exc_info=e)
        return dict()
