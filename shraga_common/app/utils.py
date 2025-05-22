import os
import re
import importlib.util
from typing import Optional

if importlib.util.find_spec("dotenv") is not None:
    from dotenv import load_dotenv

    env_path = os.getcwd() + "/.env"
    if os.path.exists(env_path):
        load_dotenv(dotenv_path=env_path)

def ok_response(msg: Optional[str] = None) -> dict:
    if msg:
        return {"ok": True, "message": msg}
    return {"ok": True}


def non_ok_response(msg: Optional[str] = None) -> dict:
    if msg:
        return {"ok": False, "message": msg}
    return {"ok": False}


def clean_input(text: str) -> str:
    disallowed_chars = r'[^\w\s.,!?;:\'"()/\n-]'
    cleaned_text = re.sub(disallowed_chars, "", text, flags=re.UNICODE)
    cleaned_text = " ".join(cleaned_text.split())
    return cleaned_text
