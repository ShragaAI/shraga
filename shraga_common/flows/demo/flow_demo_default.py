import asyncio

from shraga_common import RequestCancelledException
from shraga_common.models import (FlowBase, FlowResponse, FlowRunRequest,
                                  RetrievalResult)

"""
A demo flow class that simulates response delay and returns mock retrieval results.
Mainly used for testing and demonstration purposes.
"""


class DemoDefaultFlow(FlowBase):

    async def execute(self, request: FlowRunRequest) -> FlowResponse:

        try:
            answer = f'You asked "{request.question}"'

            total_delay = 3
            check_interval = 0.5

            for i in range(int(total_delay / check_interval)):
                await asyncio.sleep(check_interval)

            formatted_results = [
                RetrievalResult(
                    id="1",
                    title=f"Result for question: {request.question}",
                    description=f"Description for question: {request.question}",
                    score=0.9,
                )
            ]

            return self.response(
                text=answer, results=formatted_results, payload={"answer": answer}
            )

        except asyncio.CancelledError:
            raise RequestCancelledException("Flow cancelled")
        except Exception:
            raise

    @staticmethod
    def id():
        return "demo"

    @staticmethod
    def description():
        return "Demo flow"
