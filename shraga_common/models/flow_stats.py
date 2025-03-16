from typing import Optional

from pydantic import BaseModel


class FlowStats(BaseModel):
    flow_id: Optional[str] = None
    llm_model_id: Optional[str] = None
    step: Optional[str] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    latency: Optional[int] = None
    time_took: Optional[float] = None
