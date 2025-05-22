import asyncio
import logging
from typing import Optional

from fastapi import Request

from shraga_common.models import FlowBase, FlowResponse

from shraga_common import RequestCancelledException, LLMServiceUnavailableException
from ..models import FlowRunApiRequest

logger = logging.getLogger(__name__)


class RequestCancellationManager:
    def __init__(self, request: Request):
        self.request = request
        self.cancel_event = asyncio.Event()
        self._monitor_task: Optional[asyncio.Task] = None

    async def setup(self) -> asyncio.Event:
        async def _monitor():
            try:
                message = await self.request.receive()
                if message["type"] == "http.disconnect":
                    self.cancel_event.set()
            except Exception as e:
                self.cancel_event.set()

        self._monitor_task = asyncio.create_task(_monitor())
        return self.cancel_event

    async def cleanup(self):
        if self._monitor_task and not self._monitor_task.done():
            self._monitor_task.cancel()


async def execute_cancellable_flow(
    request: Request, flow: FlowBase, req_body: FlowRunApiRequest
) -> FlowResponse:
    cancel_manager = RequestCancellationManager(request)

    try:
        cancel_event = await cancel_manager.setup()
        flow_task = asyncio.create_task(flow.execute(req_body))
        cancel_task = asyncio.create_task(cancel_event.wait())

        try:
            done, pending = await asyncio.wait(
                [flow_task, cancel_task],
                return_when=asyncio.FIRST_COMPLETED,
            )

            if flow_task not in done:
                flow_task.cancel()
                raise RequestCancelledException("Request cancelled by client")

            try:
                return await flow_task
            except LLMServiceUnavailableException:
                raise

        finally:
            for task in [flow_task, cancel_task]:
                if not task.done():
                    task.cancel()
                    try:
                        await task
                    except (
                        asyncio.CancelledError, 
                        RequestCancelledException, 
                        LLMServiceUnavailableException
                    ):
                        pass

    finally:
        await cancel_manager.cleanup()
