from typing import List

from fastapi import APIRouter, HTTPException, Request

from ..models import Chat, FeedbackRequest
from ..services import history_service
from ..utils import non_ok_response, ok_response

router = APIRouter()


@router.get("/", response_model=List[Chat])
async def get_history(request: Request) -> List[Chat]:
    if not request.user.display_name:
        return []
    return await history_service.get_history(request.user.display_name)


@router.get("/{chat_id}", response_model=Chat)
async def get_chat(chat_id: str) -> Chat:
    chat = await history_service.get_chat(chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.delete("/{chat_id}")
async def delete_chat(chat_id: str):
    success = await history_service.delete_chat(chat_id)
    if success:
        return ok_response()

    return non_ok_response("Failed to delete chat")


@router.post("/feedback")
async def post_feedback(request: Request, feedback: FeedbackRequest):
    # TODO check auth
    success = await history_service.log_feedback(request, feedback)
    if success:
        return ok_response()

    return non_ok_response("Failed to update feedback")
