import datetime
import logging
from typing import List, Optional, Dict, Any, Tuple
from pydash import _

from shraga_common.utils import is_prod_env
from ..config import get_config
from .get_history_client import get_history_client

logger = logging.getLogger(__name__)

async def generate_history_report(
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_id: Optional[str] = None,
    user_org: Optional[str] = None,
    limit: int = 10000
) -> List[Dict[str, Any]]:
    try:
        shraga_config = get_config()
        client, index = get_history_client(shraga_config)
        if not client:
            return []

        filters = []
        
        if user_id:
            filters.append({"term": {"user_id": user_id}})
            
        if user_org:
            filters.append({"term": {"user_org": user_org}})
            
        time_filter = {
            "range": {
                "timestamp": {
                    "gte": start,
                    "lte": end
                }
            }
        }
        filters.append(time_filter)

        if is_prod_env():
            filters.append({"term": {"config.prod": True}})

        bool_query = {
            "must": [{"terms": {"msg_type": ["system", "user", "flow_stats"]}}],
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
                        "size": limit,
                        "order": {"last_message": "desc"}
                    },
                    "aggs": {
                        "last_message": {"max": {"field": "timestamp"}},
                        "message_count": {"value_count": {"field": "msg_type"}},
                        "messages": {
                            "top_hits": {
                                "size": 5,
                                "sort": [{"position": {"order": "asc"}}],
                                "_source": True
                            }
                        },
                        "total_input_tokens": {
                            "sum": {
                                "field": "stats.input_tokens"
                            }
                        },
                        "total_output_tokens": {
                            "sum": {
                                "field": "stats.output_tokens"
                            }
                        }
                    }
                }
            }
        }

        response = client.search(index=index, body=query)
        
        buckets = _.get(response, "aggregations.by_msg_id.buckets") or []
        dialogs = []

        for bucket in buckets:
            hits = bucket["messages"]["hits"]["hits"]
            
            user_message = None
            system_message = None
            
            for hit in hits:
                source = hit["_source"]
                msg_type = source.get("msg_type")
                
                if msg_type == "user":
                    user_message = source
                elif msg_type == "system":
                    system_message = source
            
            if user_message:
                input_tokens = int(bucket.get("total_input_tokens", {}).get("value", 0))
                output_tokens = int(bucket.get("total_output_tokens", {}).get("value", 0))
                
                dialog = {
                    "user_org": user_message.get("user_org"),
                    "user_id": user_message.get("user_id"),
                    "timestamp": user_message.get("timestamp"),
                    "msg_id": user_message.get("msg_id"),
                    "question": user_message.get("text", ""),
                    "answer": system_message.get("text", "") if system_message else "",
                    "input_tokens": input_tokens,
                    "output_tokens": output_tokens
                }
                dialogs.append(dialog)
        
        return dialogs

    except Exception as e:
        logger.exception("Error generating history report", exc_info=e)
        return []
    

def validate_time_range(start: Optional[str], end: Optional[str]) -> Tuple[bool, str, str]:
    try:
        if not start and not end:
            end_date = datetime.datetime.now()
            start_date = end_date - datetime.timedelta(days=90)
        elif not start:
            end_date = datetime.datetime.strptime(end, '%Y-%m-%d %H:%M:%S')
            start_date = end_date - datetime.timedelta(days=90)
        elif not end:
            start_date = datetime.datetime.strptime(start, '%Y-%m-%d %H:%M:%S')
            end_date = datetime.datetime.now()
        else:
            start_date = datetime.datetime.strptime(start, '%Y-%m-%d %H:%M:%S')
            end_date = datetime.datetime.strptime(end, '%Y-%m-%d %H:%M:%S')
        
        if (end_date - start_date) > datetime.timedelta(days=90):
            return False, "", ""
        
        start_iso = start_date.isoformat() + '+00:00'
        end_iso = end_date.isoformat() + '+00:00'
        
        return True, start_iso, end_iso
        
    except (ValueError, TypeError):
        return False, "", ""

async def generate_report(
    report_type: str,
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_id: Optional[str] = None,
    user_org: Optional[str] = None
) -> List[Dict[str, Any]]:
    is_valid, start_iso, end_iso = validate_time_range(start, end)
    if not is_valid:
        raise ValueError("Time range cannot exceed 3 months or has invalid format")
        
    if report_type == "history":
        return await generate_history_report(start_iso, end_iso, user_id, user_org)
    else:
        raise ValueError(f"Unsupported report type: {report_type}")