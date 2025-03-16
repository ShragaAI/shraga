import re
from typing import Optional


def ok_response(msg: Optional[str] = None) -> dict:
    if msg:
        return {"ok": True, "message": msg}
    return {"ok": True}


def non_ok_response(msg: Optional[str] = None) -> dict:
    if msg:
        return {"ok": False, "message": msg}
    return {"ok": False}


def clean_input(text: str) -> str:
    disallowed_chars = r'[^\w\s.,!?;:\'"()\n-]'
    cleaned_text = re.sub(disallowed_chars, "", text, flags=re.UNICODE)
    cleaned_text = " ".join(cleaned_text.split())
    return cleaned_text
