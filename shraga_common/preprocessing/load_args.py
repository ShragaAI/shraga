import argparse


def load_args():
    parser = argparse.ArgumentParser(
        description="Run the Preprocessing Preparation Flow"
    )
    parser.add_argument(
        "--embed",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Should the flow embed the text",
    )
    parser.add_argument(
        "--output_chunk_text",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Should the flow output the chunk text",
    )

    parser.add_argument(
        "--parallelism",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Should the flow run in parallel",
    )
    parser.add_argument(
        "--max_queue_size",
        type=int,
        default=50_000,
        help="The maximum queue size, if parallelism is enabled",
    )
    parser.add_argument(
        "--number_of_processes",
        type=int,
        default=20,
        help="The number of processes to run in parallel",
    )
    parser.add_argument(
        "--doc_type",
        type=str,
        help="Document type to process",
    )
    parser.add_argument(
        "--input_dir",
        required=True,
        type=str,
        help="Input dir",
    )
    parser.add_argument(
        "--input_file",
        type=str,
        help="Input file path",
    )
    parser.add_argument(
        "--skip_count",
        type=int,
        help="How many input files to skip",
    )
    args = parser.parse_args()

    print(args)
    return args
