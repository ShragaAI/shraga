import datetime
import logging
from typing import List, Optional

from fastapi import Request
from opensearchpy import NotFoundError
from pydash import _

from shraga_common.logging import (get_config_info, get_platform_info,
                                   get_user_agent_info)
from shraga_common.models import FlowResponse, FlowStats

from ..utils import is_prod_env
from ..config import get_config
from ..models import Chat, ChatMessage, FeedbackRequest, FlowRunApiRequest
from .get_history_client import get_history_client

logger = logging.getLogger(__name__)


async def get_history(
    user_id: Optional[str], 
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
            chat_list_length = 10
        if start:
            filters.append(
                {"range": {"timestamp": {"gte": start, "lte": end or "now"}}}
            )

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
                        "order": {"first_message": "desc"},
                    },
                    "aggs": {
                        "latest": {
                            "top_hits": {
                                "size": 100,
                                "sort": [{"timestamp": {"order": "desc"}}],
                            }
                        },
                        "first_message": {"min": {"field": "timestamp"}},
                    },
                }
            },
        }

        response = client.search(
            index=index,
            body=query,
        )
        hits = _.get(response, "aggregations.by_chat.buckets") or []
        return [Chat.from_hit(hit) for hit in hits]
    except NotFoundError:
        logger.error("Error retrieving history (index not found)")
        return []
    except Exception as e:
        logger.exception("Error retrieving history", exc_info=e)
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
            "chat_id": request_body.chat_id,
            "flow_id": request_body.flow_id,
            "text": str(error),
            "traceback": traceback,
        },
    )
