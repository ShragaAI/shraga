import unittest
from unittest.mock import AsyncMock

from shraga_common import ShragaConfig
from shraga_common.services import BedrockService

from .flow_evaluation import EvaluationFlow, EvaluationModel

testcase = [
    {
        "testcase": {
            "question": "What is the capital of France?",
            "answer": "Paris",
        },
        "evaluation": {"run_time": 0.1},
        "generated_answer": "Paris",
    }
]
preferences = EvaluationModel(
    input_files=[],
    flow_id="test",
)


class FlowResponseMock:
    text: str

    def __init__(self, text: str):
        self.text = text


@unittest.skip("This test suite is temporarily disabled")
class EvaluationFlowDocHandler(unittest.IsolatedAsyncioTestCase):
    """
    Test suite for MaxDocHandler class.
    Tests various document types and their processing logic.
    """

    async def asyncSetUp(self):
        """Initialize test configuration and handler"""
        self.shraga_config = ShragaConfig()
        self.flow = EvaluationFlow(self.shraga_config)
        self.flow.llmservice = BedrockService(self.shraga_config)

    async def test_empty_eval_results(self):
        res = await self.flow.evaluate_results([], preferences)
        self.assertIsNone(res)

    async def test_correct_eval_results(self):
        self.flow.llmservice.invoke_model = AsyncMock(
            return_value=FlowResponseMock(text='{"correctness": "correct"}')
        )
        res = await self.flow.evaluate_results(testcase, preferences)
        self.assertTrue(res["stats"]["total_scenarios"] == 1)
        self.assertTrue(res["stats"]["correct_count"] == 1)
        self.assertTrue(res["stats"]["correct_percentage"] == 100)
        self.assertTrue(len(res["results"]) == 1)
        self.assertTrue(res["results"][0]["evaluation"]["correctness"] == "correct")

    async def test_partial_eval_results(self):
        self.flow.llmservice.invoke_model = AsyncMock(
            return_value=FlowResponseMock(text='{"correctness": "partially correct"}')
        )
        res = await self.flow.evaluate_results(testcase, preferences)
        self.assertTrue(res["stats"]["total_scenarios"] == 1)
        self.assertTrue(res["stats"]["partial_correct_count"] == 1)
        self.assertTrue(res["stats"]["correct_percentage"] == 0)
        self.assertTrue(res["stats"]["partial_correct_percentage"] == 100)
        self.assertTrue(len(res["results"]) == 1)

    async def test_incorrect_eval_results(self):
        self.flow.llmservice.invoke_model = AsyncMock(
            return_value=FlowResponseMock(text='{"correctness": "incorrect"}')
        )
        res = await self.flow.evaluate_results(testcase, preferences)
        self.assertTrue(res["stats"]["total_scenarios"] == 1)
        self.assertTrue(res["stats"]["correct_count"] == 0)
        self.assertTrue(res["stats"]["correct_percentage"] == 0)
        self.assertTrue(len(res["results"]) == 1)

    async def test_corrupt_eval_results(self):
        self.flow.llmservice.invoke_model = AsyncMock(
            return_value=FlowResponseMock(text='{"correctness": "}')
        )
        res = await self.flow.evaluate_results(testcase, preferences)
        self.assertTrue(res["stats"]["total_scenarios"] == 1)
        self.assertTrue(res["stats"]["correct_count"] == 0)
        self.assertTrue(res["stats"]["correct_percentage"] == 0)
        self.assertTrue(len(res["results"]) == 1)
        self.assertIsNone(res["results"][0]["evaluation"].get("correctness"))
