from typing import List, Optional

from fastapi import APIRouter, Query

from ..models import AnalyticsRequest, Chat
from ..services import analytics_service, history_service

router = APIRouter()


@router.post("/")
async def get_analytics(r: AnalyticsRequest) -> dict:
    return await analytics_service.get_analytics(r)


@router.get("/chat-history", response_model=List[Chat])
async def get_chat_history(
    start: Optional[str] = Query(None), end: Optional[str] = Query(None)
) -> List[Chat]:
    return await history_service.get_chat_list(None, start, end)
