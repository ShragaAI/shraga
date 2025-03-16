from typing import Optional

from pydantic import BaseModel


class RetrievalResult(BaseModel):
    id: Optional[str] = None
    document_id: Optional[int] = None
    date: Optional[str] = None
    title: Optional[str] = "Result"
    link: Optional[str] = None
    description: Optional[str] = None
    score: Optional[float] = None
    extra: Optional[dict] = None
