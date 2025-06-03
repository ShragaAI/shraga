import datetime
import logging
from typing import List, Optional

from fastapi import Request
from pydash import _

from shraga_common.logger import (get_config_info, get_platform_info,
                                   get_user_agent_info)
from shraga_common.models import FlowResponse, FlowStats

from shraga_common.utils import is_prod_env, extract_user_org
from ..config import get_config
from ..models import Chat, ChatMessage, FeedbackRequest, FlowRunApiRequest
from .get_history_client import get_history_client

logger = logging.getLogger(__name__)


async def get_chat_list(
    user_id: str, 
    start: Optional[str] = None, 
    end: Optional[str] = None
) -> List[Chat]:
    try:
        shraga_config = get_config()
        client, index = get_history_client(shraga_config)
        if not client:
            return []
        
        filters = []
        chat_list_length = 50

        if user_id:
            filters.append({"term": {"user_id": user_id}})
            
        if start:
            filters.append({"range": {"timestamp": {"gte": start, "lte": end or "now"}}})

        if is_prod_env() and not user_id:
            filters.append({"term": {"config.prod": True}})

        bool_query = {
            "must": [{"terms": {"msg_type": ["system", "user"]}}],
            "filter": filters,
        }

        query = {
            "query": {
                "bool": bool_query
            },
            "size": 0,
            "aggs": {
                "by_chat": {
                    "terms": {
                        "field": "chat_id",
                        "size": chat_list_length,
                        "order": {"last_message": "desc"},  # Sort by last message timestamp
                    },
                    "aggs": {
                        "last_message": {"max": {"field": "timestamp"}},  # Get last message timestamp
                        "first_message": {"min": {"field": "timestamp"}},  # Keep first message timestamp
                        "first": {
                            "top_hits": {
                                "size": 1,
                                "sort": [{"timestamp": {"order": "asc"}}]  # Get first message
                            }
                        },
                        "latest": {
                            "top_hits": {
                                "size": 1,
                                "sort": [{"timestamp": {"order": "desc"}}]  # Get last message
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
        
        hits = _.get(response, "aggregations.by_chat.buckets") or []
        return [Chat.from_hit(hit) for hit in hits]

    except Exception as e:
        logger.exception("Error retrieving chat list", exc_info=e)
        return []
        

async def get_chat_messages(chat_id: str, count: int = 1000) -> List[ChatMessage]:
    try:
        shraga_config = get_config()
        client, index = get_history_client(shraga_config)
        if not client:
            return []
            
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"term": {"chat_id": chat_id}},
                        {"terms": {"msg_type": ["user", "system"]}}
                    ]
                }
            },
            "sort": [{"timestamp": {"order": "desc"}}],
            "size": count
        }
        
        response = client.search(
            index=index,
            body=query,
        )
        
        hits = response.get("hits", {}).get("hits", [])
        # Convert hits to messages and reverse to get ascending order (oldest first)
        messages = [ChatMessage.from_hit(hit) for hit in hits]
        messages.reverse()  # Reverse to get ascending order
        return messages
    
    except Exception as e:
        logger.exception("Error retrieving chat messages for chat %s", chat_id, exc_info=e)
        return []
        

async def get_chat(chat_id: str) -> Optional[Chat]:
    shraga_config = get_config()
    client, index = get_history_client(shraga_config)
    if not client:
        return None

    try:
        response = client.get(index=index, id=chat_id)
        if not response["found"]:
            return None
        return Chat(**response["_source"])
    except Exception:
        logger.exception("Error retrieving chat")
        return None


async def delete_chat(chat_id: str) -> bool:
    shraga_config = get_config()
    client, index = get_history_client(shraga_config)
    if not client:
        return True

    try:
        client.delete(index=index, id=chat_id)
        return True
    except Exception:
        logger.exception("Error deleting chat")
    return False


async def log_interaction(msg_type: str, request: Request, context: dict):
    try:
        shraga_config = get_config()
        client, index = get_history_client(shraga_config)
        if not client:
            return

        user_id = request.user.display_name if hasattr(request, "user") else "<unknown>"
        message = ChatMessage(
            msg_type=msg_type,
            timestamp=datetime.datetime.now(tz=datetime.timezone.utc),
            user_id=user_id,
            **context
        )

        o = message.model_dump()
        o["platform"] = get_platform_info()
        o["config"] = get_config_info(shraga_config)
        o["user_agent"] = get_user_agent_info(request.headers.get("user-agent"))
        o["user_org"] = extract_user_org(user_id)

        client.index(index=index, body=o)
        return True

    except Exception as e:
        logger.exception("Error logging interation %s", msg_type, exc_info=e)
        return False


async def log_feedback(request: Request, request_body: FeedbackRequest) -> bool:
    return await log_interaction(
        "feedback",
        request,
        {
            "msg_id": request_body.msg_id,
            "chat_id": request_body.chat_id,
            "flow_id": request_body.flow_id,
            "text": request_body.feedback_text,
            "position": request_body.position,
            "feedback": request_body.feedback,
        },
    )


async def log_user_message(request: Request, request_body: FlowRunApiRequest):
    return await log_interaction(
        "user",
        request,
        {
            "msg_id": request_body.msg_id,
            "chat_id": request_body.chat_id,
            "flow_id": request_body.flow_id,
            "text": request_body.question,
            "position": request_body.position,
        },
    )


async def log_system_message(
    request: Request,
    request_body: FlowRunApiRequest,
    response: Optional[FlowResponse] = None,
):
    # delete extra before storing history
    if response.retrieval_results:
        for result in response.retrieval_results:
            if result.extra:
                result.extra = {}
    return await log_interaction(
        "system",
        request,
        {
            "msg_id": request_body.msg_id,
            "chat_id": request_body.chat_id,
            "flow_id": request_body.flow_id,
            "text": response.response_text,
            "position": request_body.position + 1,
            "stats": response.stats,
            "payload": response.payload,
            "retrieval_results": response.retrieval_results,
            "trace": response.trace,
        },
    )


async def log_flow(request: Request, request_body: FlowRunApiRequest, stat: FlowStats):
    return await log_interaction(
        "flow_stats",
        request,
        {
            "msg_id": request_body.msg_id,
            "chat_id": request_body.chat_id,
            "text": request_body.question,
            "flow_id": stat.flow_id,
            "stats": stat,
        },
    )


async def log_error_message(
    request: Request, request_body: FlowRunApiRequest, error: Exception, traceback: str
):
    return await log_interaction(
        "error",
        request,
        {
            "msg_id": request_body.msg_id,
            "chat_id": request_body.chat_id,
            "flow_id": request_body.flow_id,
            "text": str(error),
            "traceback": traceback,
        },
    )
