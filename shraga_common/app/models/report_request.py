from pydantic import BaseModel
from typing import Optional
from fastapi import Query

class ReportRequest(BaseModel):
    report_type: str
    start: Optional[str] = Query(None, description="Start date in YYYY-MM-DD HH:MM:SS format")
    end: Optional[str] = Query(None, description="End date in YYYY-MM-DD HH:MM:SS format")
    filters: Optional[dict] = None