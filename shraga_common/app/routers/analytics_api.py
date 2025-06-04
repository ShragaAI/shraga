from typing import List, Optional

from fastapi import APIRouter, Query

from ..models import AnalyticsRequest, ChatMessage
from ..services import analytics_service, history_service

router = APIRouter()


@router.post("/")
async def get_analytics(r: AnalyticsRequest) -> dict:
    return await analytics_service.get_analytics(r)


@router.get("/chat-dialogs", response_model=List[ChatMessage])
async def get_chat_dialogs(
    start: Optional[str] = Query(None), end: Optional[str] = Query(None)
) -> List[ChatMessage]:
    return await history_service.get_chat_dialogs(start, end)
