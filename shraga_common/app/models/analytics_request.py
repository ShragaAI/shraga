from typing import Optional

from pydantic import BaseModel


class AnalyticsRequest(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None
