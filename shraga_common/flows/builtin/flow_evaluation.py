import argparse
import asyncio
import base64
import hashlib
import json
import os
import traceback
from abc import abstractmethod
from datetime import datetime, timezone
from typing import Dict, List, Optional

import yaml
from pydantic import ValidationError

from shraga_common import ShragaConfig
from shraga_common.flows.builtin.evaluation_model import (EvaluationModel,
                                                          EvaluationScenario)
from shraga_common.logger import get_config_info, get_platform_info
from shraga_common.models import FlowBase, FlowResponse, FlowRunRequest
from shraga_common.prompts import PART_EVALUATION_PROMPT
from shraga_common.retrievers import get_client
from shraga_common.services import BedrockService, LLMService


class EvaluationFlow(FlowBase):
    llmservice: LLMService = None
    listed = False
    files = []
    output_file_raw_results = None

    def __init__(self, config: ShragaConfig, flows: Optional[dict] = None):
        super().__init__(config, flows)
        self.es_client = get_client(config)
        self.index_name = "max-evaluation"
        # set the evaluation id to the current date YY-MM-dd + a UUID
        platform_info = get_platform_info()
        ts = datetime.now()
        ts_str = ts.strftime("%Y-%m-%d-%H-%M-%S-%f")[:-3]
        machine = platform_info.get("machine_name", "unknown")[:3]
        self.evaluation_ts = ts
        self.evaluation_id = f"{ts_str}-{machine}"
        print(f"Evaluation ID: {self.evaluation_id}")
        self.runtime = datetime.now(timezone.utc).isoformat()

    @staticmethod
    def parse_args():
        parser = argparse.ArgumentParser(description="Run the Nevo Evaluation Flow")
        parser.add_argument(
            "--test_count", type=int, default=3, help="Number of scenarios to run"
        )
        parser.add_argument(
            "--input_file", type=str, default=None, help="Input file name to run"
        )
        parser.add_argument(
            "--input_files",
            type=str,
            default=None,
            help="List of input file name to run",
        )
        parser.add_argument(
            "--tag", type=str, default=None, help="Filter data by specific tag"
        )

        parser.add_argument(
            "--run_only",
            action=argparse.BooleanOptionalAction,
            default=False,
            help="Don't evaluate results",
        )
        args = parser.parse_args()
        return vars(args)

    def use_args(self, request: FlowRunRequest, base_path: str):
        if request.preferences.get("input_file"):
            file_names = [request.preferences.get("input_file")]
        elif request.preferences.get("input_files"):
            file_names = request.preferences.get("input_files")
        else:
            file_names = self.files

        request.preferences["input_files"] = [
            os.path.join(base_path, "evaluation", filename) for filename in file_names
        ]

    def get_md5_hash(self, text: str):
        hasher = hashlib.sha1(text.encode(encoding="UTF-8", errors="strict"))
        return base64.urlsafe_b64encode(hasher.digest()).decode("utf-8-sig")

    def get_routing_info(self, scenario_answer: dict):
        return scenario_answer.get("routing.payload")

    @abstractmethod
    def is_key_doc_id_in_retrieval_results(
        self, scenario_answer: dict, scenario: EvaluationScenario
    ):
        pass

    def format_docs(self, item):
        return {
            "id": item.id,
            "document_id": item.document_id,
            "date": item.date,
            "title": item.title,
            "incident_type": item.extra["incident_type"],
            "link": item.link,
            "score": item.score,
        }

    async def run_scenario(
        self, scenario: EvaluationScenario, preferences: EvaluationModel
    ):
        self.trace(f"Running scenario {scenario.question}")
        start_time = datetime.now()
        evaluated_flow_preferences = preferences.evaluated_flow_preferences or {}
        self.trace(f"Overriding flow preferences: {evaluated_flow_preferences}")
        flow_run_request = FlowRunRequest(
            flows=self.flows,
            question=scenario.question,
            preferences={
                **evaluated_flow_preferences,
                "last_lookup_date": preferences.last_lookup_date,
            },
        )
        scenario_answer = await self.execute_another_flow_by_id(
            preferences.flow_id, flow_run_request
        )

        if not scenario_answer or not scenario_answer.payload:
            self.trace(f"Failed to run scenario {scenario.question}")
            return None

        run_time = datetime.now() - start_time
        answer = scenario_answer.payload.get("answer", "")

        testcase = scenario.dict()
        # hash the question to track changes over time
        testcase["id"] = self.get_md5_hash(scenario.question)

        # check if the document id or report url is in the retrieval results
        contains_key_doc_id = self.is_key_doc_id_in_retrieval_results(
            scenario_answer, scenario
        )
        missing_doc_id = contains_key_doc_id is None
        no_answer = answer.startswith("I'm sorry")

        self.trace(f"---\nAnswer: {answer}\n---")
        return {
            "testcase": testcase,
            "generated_answer": answer,
            "evaluation": {
                "missing_doc_id": missing_doc_id,
                "contains_key_doc_id": contains_key_doc_id,
                "no_answer": no_answer,
                "run_time": run_time.seconds,
            },
            "metadata": {
                "routing": self.get_routing_info(scenario_answer),
                "retrieved_documents": [
                    self.format_docs(item) for item in scenario_answer.retrieval_results
                ],
                "trace": scenario_answer.trace,
                "exec_stats": [s.dict() for s in scenario_answer.stats],
            },
        }

    def get_eval_prompt(
        self, testcase: dict = None, response_answer: str = None, _=None
    ):
        expected_answer = testcase.get("answer", None)
        return PART_EVALUATION_PROMPT.format(
            question=testcase.get("question", ""),
            expected_answer=expected_answer,
            answer=response_answer,
        )

    async def evaluate_results(self, results: List, preferences: EvaluationModel):
        self.llmservice = self.llmservice or BedrockService(self.config)

        if not results:
            print("No results to evaluate")
            return

        self.trace(f"Evaluating {len(results)} scenarios")
        correct_count = 0
        no_answer_count = 0
        partial_correct_count = 0
        average_run_time = 0
        found_key_doc_id = 0
        no_key_doc_id = 0
        err_count = 0

        # Lock to safely update counters in parallel
        lock = asyncio.Lock()

        async def evaluate_single_result(result):
            nonlocal correct_count, no_answer_count, partial_correct_count, average_run_time, found_key_doc_id, no_key_doc_id

            if not result:
                self.trace("No result to evaluate")
                return

            testcase = result.get("testcase", {})
            response_answer = result.get("generated_answer", None)
            average_run_time += result.get("evaluation", {}).get("run_time", 0)
            expected_answer = testcase.get("answer", None)

            if expected_answer:
                prompt = self.get_eval_prompt(testcase, response_answer, preferences)
                eval_resp = await self.llmservice.invoke_model(
                    prompt, {"model_id": "sonnet_3_5_v2"}
                )

                if not eval_resp:
                    self.trace("No response from the model")
                    return

                try:

                    result["evaluation"] = {
                        **result["evaluation"],
                        **json.loads(eval_resp.text, strict=False),
                    }
                except Exception as _:
                    result["evaluation"] = {
                        **result["evaluation"],
                        "error": "Error parsing evaluation response",
                    }
                    print("Error parsing evaluation response", eval_resp.text)

                # Update counters based on evaluation results
                async with lock:
                    correctness = result["evaluation"].get("correctness")
                    if correctness == "correct":
                        correct_count += 1
                    elif correctness == "partially correct":
                        partial_correct_count += 1
                    if result["evaluation"].get("no_answer"):
                        no_answer_count += 1
                        result["evaluation"]["correctness"] = "no answer"

                    if result["evaluation"].get("error"):
                        err_count += 1
                    if result["evaluation"].get("contains_key_doc_id"):
                        found_key_doc_id += 1
                    elif result["evaluation"].get("contains_key_doc_id") is None:
                        no_key_doc_id += 1
                    self.log_eval_result(result, preferences)
            else:
                self.log_eval_result(result, preferences)

        # Run evaluations in parallel for each result
        tasks = [evaluate_single_result(result) for result in results]
        await asyncio.gather(*tasks)

        # Calculate averages after all tasks complete
        if average_run_time > 0:
            average_run_time /= len(results)

        # Compile evaluation data
        data = {
            "run_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "preferences": preferences.dict(),
            "stats": {
                "total_scenarios": len(results),
                "error_count": err_count,
                "total_found_key_doc_id": found_key_doc_id,
                "no_key_doc_id": no_key_doc_id,
                "not_found_key_doc_id": len(results) - found_key_doc_id - no_key_doc_id,
                "correct_count": correct_count,
                "no_answer_count": no_answer_count,
                "partial_correct_count": partial_correct_count,
                "correct_percentage": round(correct_count / len(results) * 100),
                "partial_correct_percentage": round(
                    partial_correct_count / len(results) * 100
                ),
                "average_run_time": average_run_time,
            },
            "results": results,
        }
        return data

    def log_eval_result(self, result: dict, preferences: EvaluationModel):
        if not self.es_client:
            return
        
        testcase = result.get("testcase", {})
        response_answer = result.get("generated_answer", None)

        o = {}
        o["timestamp"] = self.runtime
        o["question"] = testcase.get("question")
        o["question_hash"] = testcase.get("id")
        o["gen_answer"] = response_answer
        o["evaluation"] = result.get("evaluation", {})
        o["config"] = get_config_info(self.config)
        o["evaluation_ts"] = self.evaluation_ts
        o["evaluation_id"] = self.evaluation_id
        o["platform"] = get_platform_info()
        o["preferences"] = {
            **preferences.dict(),
            "input_files": [f.split("/")[-1] for f in preferences.input_files],
        }
        docs = result.get("metadata", {}).get("retrieved_documents", [])
        for doc in docs:
            del doc["date"]
        o["retrieved_documents"] = docs
        if o["evaluation"].get("correctness") != "correct":
            o["trace"] = result.get("metadata", {}).get("trace", [])
            o["routing"] = result.get("metadata", {}).get("routing", [])

        self.es_client.index(index=self.index_name, body=o)

    def reached_test_count(self, results: List, preferences: EvaluationModel):
        test_count = preferences.test_count
        if test_count <= 0:
            return False
        return len(results) >= test_count

    def get_scenarios(self, dataset: Dict):
        return dataset.get("scenarios", [])

    async def run_scenarios(self, dataset: Dict, preferences: EvaluationModel):
        scenarios = self.get_scenarios(dataset)

        max_tests = min(len(scenarios), preferences.test_count)
        self.trace(f"Running {max_tests} scenarios")

        results = []
        max_concurrency = preferences.max_concurrent_tests
        semaphore = asyncio.Semaphore(max_concurrency)
        lock = asyncio.Lock()
        test_counter = 0  # Counter for completed tests

        async def run_single_scenario(scenario):
            nonlocal test_counter
            async with semaphore:
                # Check if we've reached the maximum count
                async with lock:
                    if max_tests > 0 and test_counter >= max_tests:
                        return None
                    else:
                        test_counter += 1

                try:
                    scenario_object = EvaluationScenario(**scenario)
                    result = await self.run_scenario(scenario_object, preferences)
                    results.append(result)
                    self.write_test_output(result, self.output_file_raw_results)

                    return result
                except ValidationError as e:
                    self.trace(e)
                    self.trace(f"Invalid scenario: {scenario.get('question')}")
                except Exception as e:
                    print(traceback.print_exc())
                    self.trace(e)
                    self.trace(f"Error running scenario: {scenario.get('question')}")
                return None

        # Start all scenarios as tasks
        tasks = [run_single_scenario(scenario) for scenario in scenarios]
        await asyncio.gather(*tasks, return_exceptions=True)
        for result in results:
            if isinstance(result, Exception):
                print(f"Task failed with exception: {result}")

        return results[:max_tests]

    def write_eval_output(self, data: dict, output_file: str):
        with open(output_file, "w", encoding="utf-8-sig") as stream:
            yaml.safe_dump(data, stream, sort_keys=False, allow_unicode=True)

    def write_test_output(self, test_data: dict, output_file: str):
        with open(output_file, "a", encoding="utf-8-sig") as stream:
            if test_data:
                yaml.safe_dump([test_data], stream, sort_keys=False, allow_unicode=True)

    async def execute(self, request: FlowRunRequest) -> FlowResponse:
        self.llmservice = self.llmservice or BedrockService(self.config)
        preferences = EvaluationModel(**request.preferences)

        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        fname = f"{preferences.flow_id}-{timestamp}-eval.yaml"
        output_file = os.path.join(os.getcwd(), "output", fname)
        
        # ensure folder exists
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        self.output_file_raw_results = os.path.join(
            os.getcwd(), "output", "raw-" + fname
        )

        self.write_test_output(None, self.output_file_raw_results)
        self.trace(f"Storing raw results to {self.output_file_raw_results}")
        self.trace(f"Storing evaluation results to {output_file}")

        results = []

        for input_file in preferences.input_files:
            self.trace(f"Loading the dataset {input_file}")
            with open(input_file, "r", encoding="utf-8-sig") as stream:
                try:
                    dataset = yaml.safe_load(stream)
                    preferences.last_lookup_date = dataset["api_context"].get("date")
                except yaml.YAMLError as exc:
                    self.trace(exc)

                if preferences.tag:
                    dataset["scenarios"] = [
                        item
                        for item in dataset["scenarios"]
                        if "tags" in item["metadata"]
                        and preferences.tag in item["metadata"]["tags"]
                    ]

                dataset_results = await self.run_scenarios(dataset, preferences)
                results.extend(dataset_results)
                if self.reached_test_count(dataset_results, preferences):
                    self.trace("Max scenarios reached")
                    break

        if not preferences.run_only:
            evaluation_results = await self.evaluate_results(results, preferences)
            self.write_eval_output(evaluation_results, output_file)

        return FlowResponse(
            response_text="",
            payload={
                "output_file": output_file,
                "total_scenarios": len(results),
            },
        )

    @staticmethod
    def id():
        return "llm-evaluation-v1"

    @staticmethod
    def description():
        return "evaluate RAG results using LLMs"
