import logging
from typing import List, Optional

from opensearchpy import NotFoundError
from pydash import _

from shraga_common.utils import is_prod_env
from ..config import get_config
from ..models import AnalyticsRequest, ChatMessage
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


async def get_chat_dialogs(
    start: Optional[str] = None, 
    end: Optional[str] = None
) -> List[ChatMessage]:
    try:
        shraga_config = get_config()
        client, index = get_history_client(shraga_config)
        if not client:
            return []
        
        filters = []
        if start:
            filters.append({"range": {"timestamp": {"gte": start, "lte": end or "now"}}})
        elif end:
            filters.append({"range": {"timestamp": {"lte": end}}})

        if is_prod_env():
            filters.append({"term": {"config.prod": True}})

        bool_query = {
            "must": [{"terms": {"msg_type": ["system", "user", "feedback"]}}],
            "filter": filters,
        }

        query = {
            "query": {
                "bool": bool_query
            },
            "size": 0,
            "aggs": {
                "by_msg_id": {
                    "terms": {
                        "field": "msg_id.keyword",
                        "size": 500,
                        "order": {"last_message": "desc"}
                    },
                    "aggs": {
                        "last_message": {"max": {"field": "timestamp"}},
                        "message_count": {"value_count": {"field": "msg_type"}},
                        "messages": {
                            "top_hits": {
                                "size": 10,
                                "sort": [{"position": {"order": "asc"}}],
                                "_source": True
                            }
                        }
                    }
                }
            }
        }

        response = client.search(
            index=index,
            body=query,
        )
        
        buckets = _.get(response, "aggregations.by_msg_id.buckets") or []
        messages = []
        
        for bucket in buckets:
            hits = bucket["messages"]["hits"]["hits"]

            messages_by_type = {}
            feedback_data = None

            for hit in hits:
                source = hit["_source"]
                msg_type = source.get("msg_type")

                if msg_type in ["user", "system"]:
                    messages_by_type[msg_type] = ChatMessage.from_hit(hit)
                elif msg_type == "feedback":
                    feedback_data = source.get("feedback")

            if "user" in messages_by_type:
                messages.append(messages_by_type["user"])
                
            if "system" in messages_by_type:
                if feedback_data:
                    messages_by_type["system"].feedback = feedback_data
                messages.append(messages_by_type["system"])
        
        return messages

    except Exception as e:
        logger.exception("Error retrieving chat dialogs", exc_info=e)
        return []