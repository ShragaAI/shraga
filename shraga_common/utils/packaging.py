import gzip
import json
import os


def json_to_jsonlines(input_folder, output_file):
    with gzip.open(output_file, "wt", encoding="utf-8") as gzfile:
        for filename in os.listdir(input_folder):
            if filename.endswith(".json"):
                file_path = os.path.join(input_folder, filename)
                with open(file_path, "r", encoding="utf-8") as json_file:
                    try:
                        data = json.load(json_file)
                        gzfile.write(json.dumps(data, ensure_ascii=False, indent=None))
                        gzfile.write("\n")
                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON from file {filename}: {e}")


if __name__ == "__main__":
    json_to_jsonlines("/media/work/code/out", "/media/work/code/out.jsonl.gz")
