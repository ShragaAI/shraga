import datetime
import logging
from typing import List, Optional

from fastapi import Request
from pydash import _

from shraga_common.logger import (get_config_info, get_platform_info,
                                   get_user_agent_info)
from shraga_common.models import FlowResponse, FlowStats
from shraga_common.utils import is_prod_env

from ..auth.user import ShragaUser
from ..config import get_config
from ..models import Chat, ChatMessage, FeedbackRequest, FlowRunApiRequest
from .get_history_client import get_history_client

logger = logging.getLogger(__name__)

# Constants
DEFAULT_CHAT_LIST_LENGTH = 50
DEFAULT_CHAT_MESSAGES_COUNT = 1000


# Helper functions
def _get_history_client_or_none():
    """Get history client and index, return None if not available."""
    try:
        shraga_config = get_config()
        client, index = get_history_client(shraga_config)
        return client, index if client else (None, None)
    except Exception as e:
        logger.exception("Error getting history client", exc_info=e)
        return None, None


def _get_user_from_request(request: Request) -> ShragaUser:
    """Extract user from request, return anonymous user if not available."""
    try:
        return request.user
    except (AttributeError, Exception):
        return ShragaUser(username="<unknown>")


def _build_chat_list_filters(user_id: str, start: Optional[str], end: Optional[str]) -> List[dict]:
    """Build filters for chat list query."""
    filters = []
    
    if user_id:
        filters.append({"term": {"user_id": user_id}})
        
    if start:
        filters.append({"range": {"timestamp": {"gte": start, "lte": end or "now"}}})

    if is_prod_env() and not user_id:
        filters.append({"term": {"config.prod": True}})
    
    return filters


def _build_chat_list_query(filters: List[dict]) -> dict:
    """Build Elasticsearch query for chat list."""
    return {
        "query": {
            "bool": {
                "must": [{"terms": {"msg_type": ["system", "user"]}}],
                "filter": filters,
            }
        },
        "size": 0,
        "aggs": {
            "by_chat": {
                "terms": {
                    "field": "chat_id",
                    "size": DEFAULT_CHAT_LIST_LENGTH,
                    "order": {"last_message": "desc"},
                },
                "aggs": {
                    "last_message": {"max": {"field": "timestamp"}},
                    "first_message": {"min": {"field": "timestamp"}},
                    "first": {
                        "top_hits": {
                            "size": 1,
                            "sort": [{"timestamp": {"order": "asc"}}]
                        }
                    },
                    "latest": {
                        "top_hits": {
                            "size": 1,
                            "sort": [{"timestamp": {"order": "desc"}}]
                        }
                    }
                }
            }
        }
    }


def _build_chat_messages_query(chat_id: str, count: int) -> dict:
    """Build Elasticsearch query for chat messages."""
    return {
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


# Main service functions
async def get_chat_list(
    user_id: str, 
    start: Optional[str] = None, 
    end: Optional[str] = None
) -> List[Chat]:
    """Get list of chats for a user with optional date filtering."""
    try:
        client, index = _get_history_client_or_none()
        if not client:
            return []
        
        filters = _build_chat_list_filters(user_id, start, end)
        query = _build_chat_list_query(filters)

        response = client.search(index=index, body=query)
        hits = _.get(response, "aggregations.by_chat.buckets") or []
        
        return [Chat.from_hit(hit) for hit in hits]

    except Exception as e:
        logger.exception("Error retrieving chat list for user %s", user_id, exc_info=e)
        return []
        

async def get_chat_messages(chat_id: str, count: int = DEFAULT_CHAT_MESSAGES_COUNT) -> List[ChatMessage]:
    """Get messages for a specific chat."""
    try:
        client, index = _get_history_client_or_none()
        if not client:
            return []
            
        query = _build_chat_messages_query(chat_id, count)
        response = client.search(index=index, body=query)
        
        hits = response.get("hits", {}).get("hits", [])
        messages = [ChatMessage.from_hit(hit) for hit in hits]
        messages.reverse()  # Reverse to get ascending order (oldest first)
        
        return messages
    
    except Exception as e:
        logger.exception("Error retrieving chat messages for chat %s", chat_id, exc_info=e)
        return []
        

async def get_chat(chat_id: str) -> Optional[Chat]:
    """Get a specific chat by ID."""
    try:
        client, index = _get_history_client_or_none()
        if not client:
            return None

        response = client.get(index=index, id=chat_id)
        if not response["found"]:
            return None
            
        return Chat(**response["_source"])
        
    except Exception as e:
        logger.exception("Error retrieving chat %s", chat_id, exc_info=e)
        return None


async def delete_chat(chat_id: str) -> bool:
    """Delete a chat by ID."""
    try:
        client, index = _get_history_client_or_none()
        if not client:
            return True  # Return True if history is disabled

        client.delete(index=index, id=chat_id)
        return True
        
    except Exception as e:
        logger.exception("Error deleting chat %s", chat_id, exc_info=e)
        return False


# Logging functions
async def log_interaction(msg_type: str, request: Request, context: dict) -> bool:
    """Log an interaction to the history system."""
    try:
        client, index = _get_history_client_or_none()
        if not client:
            return False

        user = _get_user_from_request(request)
        shraga_config = get_config()

        message = ChatMessage(
            msg_type=msg_type,
            timestamp=datetime.datetime.now(tz=datetime.timezone.utc),
            user_id=user.identity,
            **context
        )

        # Build the document to index
        doc = message.model_dump()
        doc.update({
            "platform": get_platform_info(),
            "config": get_config_info(shraga_config),
            "user_agent": get_user_agent_info(request.headers.get("user-agent")),
            "user_org": user.user_org,
            "user_metadata": user.metadata
        })

        client.index(index=index, body=doc)
        return True

    except Exception as e:
        logger.exception("Error logging interaction %s", msg_type, exc_info=e)
        return False


async def log_feedback(request: Request, request_body: FeedbackRequest) -> bool:
    """Log user feedback."""
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


async def log_user_message(request: Request, request_body: FlowRunApiRequest) -> bool:
    """Log user message."""
    return await log_interaction(
        "user",
        request,
        {
            "msg_id": request_body.msg_id,
            "chat_id": request_body.chat_id,
            "flow_id": request_body.flow_id,
            "text": request_body.question,
            "position": request_body.position,
            "preferences": request_body.preferences,
        },
    )


async def log_system_message(
    request: Request,
    request_body: FlowRunApiRequest,
    response: Optional[FlowResponse] = None,
) -> bool:
    """Log system response message."""
    history_enabled = get_config('history.enabled', False)
    if not history_enabled:
        return False
        
    # Clean up retrieval results before storing
    if response and response.retrieval_results:
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
            "text": response.response_text if response else "",
            "position": (request_body.position or 0) + 1,
            "preferences": request_body.preferences,
            "stats": response.stats if response else None,
            "payload": response.payload if response else None,
            "retrieval_results": response.retrieval_results if response else None,
            "trace": response.trace if response else None,
        },
    )


async def log_flow(request: Request, request_body: FlowRunApiRequest, stat: FlowStats) -> bool:
    """Log flow statistics."""
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
    request: Request, 
    request_body: FlowRunApiRequest, 
    error: Exception, 
    traceback: str
) -> bool:
    """Log error message."""
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
