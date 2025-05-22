import os

def is_prod_env() -> bool:
    return os.environ.get("PROD", "").lower() == "true"