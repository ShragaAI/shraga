import logging

from shraga_common import ShragaConfig

logger = logging.getLogger(__name__)

shraga_config = ShragaConfig().load()


def get_config(k: str, default=None):
    return shraga_config.get(k, default)
