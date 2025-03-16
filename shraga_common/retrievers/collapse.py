from typing import List

from pydash import _


def get_inner_hits(result_set: dict):
    if not result_set:
        result_set = {}
    return (
        result_set.get("inner_hits", {})
        .get("chunks", {})
        .get("hits", {})
        .get("hits", [])
    )


def merge_inner_hits_results(inner_hits: List[dict], orig_doc: dict):
    original_chunk = orig_doc.get("_source", {})
    original_system_id = original_chunk.get("system_id", "")

    # Sort by system_id ascending
    inner_hits.append(orig_doc)
    inner_hits = sorted(_.uniq(inner_hits), key=lambda x: x["_id"])
    inner_hits = _.uniq_by(
        inner_hits, lambda x: x["_source"].get("system_id", x["_id"])
    )
    # text
    merged_text = "\n".join([x["_source"]["text"] for x in inner_hits])

    # base doc
    merged_inner_hits = inner_hits[0]["_source"] if inner_hits else {}

    # metadata
    merged_inner_hits["_score"] = orig_doc.get("_score", 0)
    merged_inner_hits["_index"] = orig_doc.get("_index", "")

    merged_inner_hits["_id"] = original_chunk["id"]
    merged_inner_hits["text"] = merged_text
    merged_inner_hits["chunk_text_length"] = len(merged_text)
    start_system_id = inner_hits[0]["_source"].get("system_id", "")
    end_system_id = inner_hits[-1]["_source"].get("system_id", "")
    merged_inner_hits["system_id"] = (
        f"{start_system_id} - {end_system_id} ({original_system_id})"
    )
    return merged_inner_hits
