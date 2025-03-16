import argparse
import os


def load_args():
    parser = argparse.ArgumentParser(description="Run the Ingest Flow")
    parser.add_argument(
        "--input_dir",
        required=True,
        type=str,
        help="Input dir",
    )
    parser.add_argument(
        "--batch_size",
        type=int,
        default=10000,
        help="Batch size",
    )
    parser.add_argument(
        "--target_index",
        type=str,
        help="Target ES index override",
    )
    parser.add_argument(
        "--action",
        type=str,
        help="index or update",
    )
    parser.add_argument(
        "--dry_run",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Dry run",
    )
    parser.add_argument(
        "--doc_type",
        type=str,
        required=True,
        help="Document type",
    )
    parser.add_argument(
        "--max_items",
        type=int,
        default=0,
        help="Max items to ingest",
    )
    args = parser.parse_args()

    if not os.path.isdir(args.input_dir):
        raise ValueError(f"Input dir {args.input_dir} does not exist")

    print(args)
    return args
