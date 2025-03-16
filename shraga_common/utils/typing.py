from typing import List


def safe_to_int(val):
    if val is None:
        return None
    try:
        return int(val)
    except Exception:
        return None


def first_not_none(*args):
    if not args:
        return None
    for x in args:
        if x is not None:
            return x
    return None


def dict_minus_field(d: dict, f: str) -> dict:
    if f in d:
        del d[f]
    return d
