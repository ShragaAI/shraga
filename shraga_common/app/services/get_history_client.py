from shraga_common import ShragaConfig
from shraga_common.retrievers import get_client


def get_history_client(shraga_config: ShragaConfig):
    history_enabled = shraga_config.get("history.enabled", False)
    if history_enabled:
        client = get_client(shraga_config)
        index = shraga_config.get("history.index") or "chat-history"
    else:
        client = None
        index = None

    return client, index
