from datetime import date
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel

from shraga_common.services import LlmModelProvider


class EvaluationModel(BaseModel):
    input_files: List[str]
    evaluating_model: Literal[LlmModelProvider] = "cohere"
    flow_id: str
    output_cluster: Optional[str] = None
    test_count: Optional[int] = 1
    max_concurrent_tests: Optional[int] = 4
    last_lookup_date: Optional[date] = None
    tag: Optional[str] = None
    run_only: bool = False
    evaluated_flow_preferences: Optional[Dict] = None


class EvaluationScenario(BaseModel):
    question: str
    answer: Optional[str] = None
    metadata: Optional[Dict] = None
