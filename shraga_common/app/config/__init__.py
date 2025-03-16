import logging

from shraga_common import ShragaConfig

logger = logging.getLogger(__name__)

SHRAGA_CONFIG = None

def load_config(path):
    global SHRAGA_CONFIG
    SHRAGA_CONFIG = ShragaConfig().load(path)
    return SHRAGA_CONFIG

def get_config(k: str = None, default=None):
    if not SHRAGA_CONFIG:
        logger.error("Shraga config not loaded")
        return default
    if not k:
        return SHRAGA_CONFIG
    return SHRAGA_CONFIG.get(k, default)
