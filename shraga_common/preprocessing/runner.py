import asyncio
import gzip
import json
import multiprocessing
import os
import platform
import queue
import uuid
from collections.abc import Iterable
from multiprocessing import Process, Queue
from typing import Optional

from pydantic import BaseModel

from shraga_common.preprocessing.doc_handler import DocHandler


class PreprocessingRunnerPreferences(BaseModel):
    parallelism: bool = True
    number_of_processes: int = 20
    number_of_push_threads: int = 1
    queue_timeout: int = 60
    max_queue_size: int = 10_000
    output_file_prefix: Optional[str] = ""


class PreprocessingRunner:
    doc_handler: DocHandler = None
    out_path: str = None
    data_provider: Iterable = ([],)
    config: PreprocessingRunnerPreferences = None

    def __init__(
        self,
        doc_handler: DocHandler,
        data_provider: Iterable,
        out_path: str = None,
        config: Optional[PreprocessingRunnerPreferences] = None,
    ):
        self.data_provider = data_provider
        self.doc_handler = doc_handler
        self.out_path = out_path
        self.config = config or PreprocessingRunnerPreferences()
        is_first_run = not multiprocessing.get_start_method(allow_none=True)
        if platform.system() == "Darwin" and is_first_run:
            multiprocessing.set_start_method("fork")

    def run_async_job(self, tasks_to_accomplish, tasks_that_are_done):
        try:
            asyncio.run(self.do_job(tasks_to_accomplish, tasks_that_are_done))
        except KeyboardInterrupt:
            print("Job interrupted by user. Exiting gracefully.")

    def get_filename(self):
        output_file_prefix = ""
        if self.config.output_file_prefix:
            output_file_prefix = f"{self.config.output_file_prefix}_"
        return f"{self.out_path}/{output_file_prefix}{uuid.uuid4().hex}.jsonl.gz"

    async def do_job(self, tasks_to_accomplish, tasks_that_are_done):
        print(f"[{os.getpid()}] Started")
        while True:
            try:
                task = tasks_to_accomplish.get(block=True, timeout=5)
            except queue.Empty:
                print(f"[{os.getpid()}] Queue is empty")
            else:
                if task is None:
                    print(f"[{os.getpid()}] Got sentinel")
                    tasks_that_are_done.put(None)
                    # use sentinel pattern
                    break
                try:
                    async for result in self.doc_handler.handle_document(task):
                        if not result:
                            break
                        tasks_that_are_done.put(result)
                except Exception as e:
                    print(f"[{os.getpid()}] Error: {e}")
                    continue

        print(f"[{os.getpid()}] Stopped")
        return True

    def push_data(self, tasks_that_are_done):
        print("[Push Thread] Started")
        processed_ids = set()
        total_chunks = 0
        sentinel_count = 0

        if not os.path.exists(self.out_path):
            print(f"[Push Thread] Creating output directory: {self.out_path}")
            os.makedirs(self.out_path)

        filename = self.get_filename()
        with gzip.open(filename, "wt", encoding="utf-8") as gzfile:
            while True:
                try:
                    chunk = tasks_that_are_done.get(block=True, timeout=5)
                except queue.Empty:
                    print("[Push Thread] Queue is empty")
                else:
                    if chunk is None:
                        print("[Push Thread] Got sentinel")
                        sentinel_count += 1
                        if sentinel_count == self.config.number_of_processes:
                            print("[Push Thread] All processes finished")
                            break
                    else:
                        gzfile.write(json.dumps(chunk, ensure_ascii=False, indent=None))
                        gzfile.write("\n")

                        processed_ids.add(chunk.get("id"))
                        total_chunks += 1

                        if total_chunks and total_chunks % 1000 == 0:
                            print(
                                f"[Push Thread] Pushed (total {total_chunks} chunks, {len(processed_ids)} items)"
                            )

        print("[Push Thread] Stopped")
        return True

    async def execute(self):
        tasks_to_accomplish = Queue()
        tasks_that_are_done = Queue()

        processes = []
        push_threads = []

        if not self.config.parallelism:
            count = 0
            for data in self.data_provider:
                if isinstance(data, list):
                    for d in data:
                        tasks_to_accomplish.put(d)
                        count += 1
                else:
                    tasks_to_accomplish.put(data)
                    count += 1

                if count >= self.config.max_queue_size:
                    await self.do_job(tasks_to_accomplish, tasks_that_are_done)
                    self.push_data(tasks_that_are_done)
                    count = 0

            await self.do_job(tasks_to_accomplish, tasks_that_are_done)
            self.push_data(tasks_that_are_done)
        else:
            for _ in range(self.config.number_of_processes):
                p = Process(
                    target=self.run_async_job,
                    args=(tasks_to_accomplish, tasks_that_are_done),
                )
                processes.append(p)
                p.start()

            for _ in range(self.config.number_of_push_threads):
                push_thread = Process(
                    target=self.push_data, args=(tasks_that_are_done,)
                )
                push_threads.append(push_thread)
                push_thread.start()

            count = 0
            for data in self.data_provider:
                count += 1
                if count >= self.config.max_queue_size:
                    while not tasks_to_accomplish.empty():
                        print(
                            "Queue is full. Waiting for tasks to be processed before loading more..."
                        )
                        await asyncio.sleep(1)
                    count = 0

                if isinstance(data, list):
                    for d in data:
                        tasks_to_accomplish.put(d)
                else:
                    tasks_to_accomplish.put(data)

            # send shut down signal to all task workers
            for _ in range(self.config.number_of_processes):
                tasks_to_accomplish.put(None)

            for p in processes:
                p.join()
            for p in push_threads:
                p.join()
