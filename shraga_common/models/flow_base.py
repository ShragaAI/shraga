import logging
from abc import abstractmethod
from typing import List, Literal, Optional, get_args

from shraga_common.logger import init_logging
from shraga_common.shraga_config import ShragaConfig
from .flow_response import FlowResponse
from .flow_run_request import FlowRunRequest
from .retrieval_result import RetrievalResult

logger = init_logging(__name__)


class FlowBase:
    listed = True

    def __init__(self, config: ShragaConfig, flows: Optional[dict] = None):
        self.config = config
        self.flows = flows
        self.trace_log = dict()
        self.trace_log["log"] = []

        if self.config.get("debug.print"):
            logger.setLevel(logging.DEBUG)

    @abstractmethod
    async def execute(self, request: FlowRunRequest) -> FlowResponse:
        raise NotImplementedError()

    @staticmethod
    def id() -> str:
        raise NotImplementedError()

    @staticmethod
    def description() -> str:
        return ""

    @staticmethod
    def format_pydantic_config(model):
        config = {}

        for field_name, field in model.model_fields.items():
            field_info = {
                "default_value": field.default,
            }

            if field.description:
                field_info["description"] = field.description

            field_type = field.annotation
            if hasattr(field_type, "__origin__") and field_type.__origin__ is Literal:
                allowed_values = get_args(field_type)
                field_info["available_values"] = list(allowed_values)
                field_info["type"] = (
                    "string"  # assuming Literal fields are string-based
                )
            else:
                if field_type is int:
                    field_info["type"] = "integer"
                elif field_type is str:
                    field_info["type"] = "string"
                elif field_type is float:
                    field_info["type"] = "float"
                elif field_type is bool:
                    field_info["type"] = "boolean"

            config[field_name] = field_info

        return config

    @staticmethod
    def available_preferences(config) -> dict:
        return dict()

    @staticmethod
    def get_tool_desc():
        return None

    @staticmethod
    def get_flow_instance(flows: list, flow_id: str, config: ShragaConfig):
        f = flows.get(flow_id)
        if not f:
            raise RuntimeError(f"No flow found with id {flow_id}")
        return f(config, flows)

    async def execute_another_flow_by_id(
        self, flow_id: str, request: FlowRunRequest
    ) -> FlowResponse:
        f = self.flows.get(flow_id)
        if not f:
            raise RuntimeError(f"No flow found with id {flow_id}")

        flow_instance = f(self.config, self.flows)
        response = await flow_instance.execute(request)
        if response.trace and "log" in response.trace:
            self.trace_log["log"].extend(response.trace["log"])
        return response

    async def execute_another_flow(
        self, flow_clazz, request: FlowRunRequest
    ) -> FlowResponse:
        f = self.flows.get(flow_clazz().id())
        if not f:
            raise RuntimeError("No flow found")
        return await f(self.config, self.flows).execute(request)

    def trace(self, text: str = ""):
        flow_id = type(self).id()
        text = f"{flow_id}: {text}"
        log = self.trace_log.get("log") or []
        log.append(text)
        self.trace_log["log"] = log
        if self.config.get("debug.print"):
            logger.debug(text)

    def get_stats(self, content):
        if not content:
            return {}
        
        if isinstance(content, dict):
            stats = content
        else: 
            stats = content.stats.dict()
        stats["flow_id"] = type(self).id()
        return stats

    def response(
        self, text: str, results: List[RetrievalResult], payload: Optional[dict] = None
    ) -> FlowResponse:
        return FlowResponse(
            response_text=text,
            retrieval_results=results,
            payload=payload or dict(),
            trace=self.trace_log,
        )
