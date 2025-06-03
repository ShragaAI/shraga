import logging
import sys

import colorlog


class EndpointFilter(logging.Filter):    
    def __init__(self, paths_to_skip_logging=None):
        super().__init__()
        self.paths_to_skip_logging = paths_to_skip_logging or {}

    def filter(self, record: logging.LogRecord) -> bool:
        return record.args[2] not in self.paths_to_skip_logging


log_handler = logging.StreamHandler(stream=sys.stdout)

# Define log format with colors
LOG_FORMAT = (
    "%(log_color)s[%(levelname)s] %(asctime)s - %(message)s (%(filename)s:%(lineno)d)"
)
colors = {
    "DEBUG": "cyan",
    "INFO": "green",
    "WARNING": "yellow",
    "ERROR": "red",
    "CRITICAL": "bold_red",
}

# Configure colorlog
formatter = colorlog.ColoredFormatter(LOG_FORMAT, log_colors=colors)
log_handler.setFormatter(formatter)

# use getLogger(None) to get the root logger
logging.getLogger(None).handlers = [log_handler]

es_logger = logging.getLogger("elasticsearch.trace")
es_logger.setLevel(logging.WARNING)
es_logger.addHandler(log_handler)

# Adjust uvicorn access logger to match ecs format and add endpoint filter
logging.getLogger("gunicorn.access").setLevel(logging.WARN)
logging.getLogger("uvicorn.asgi").setLevel(logging.WARN)
logging.getLogger("uvicorn.access").setLevel(logging.WARN)
logging.getLogger("uvicorn.access").addFilter(EndpointFilter({"/healthz"}))
logging.getLogger("uvicorn.access").propagate = False


def init_logging(logger):
    # Get the Logger
    logger = logging.getLogger(logger)
    logger.setLevel(logging.INFO)
    logger.addHandler(log_handler)
    logger.propagate = False
    return logger
