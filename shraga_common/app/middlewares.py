import time

from starlette.requests import Request
from starlette.responses import Response

from shraga_common.logger import (get_config_info, get_platform_info,
                                   get_user_agent_info, init_logging)

from .config import get_config

logger = init_logging(__name__)


async def logging_middleware(request: Request, call_next) -> Response:
    try:
        start_time = time.time()

        response = await call_next(request)

        if request.url.path == "/healthz":
            return response

        user_display_name = getattr(
            request.state, "user_display_name", "anonymous")

        took = int((time.time() - start_time) * 1000)
        shraga_config = get_config()
        logger.info(
            f"Request {request.url.path} completed in {took}ms",
            extra={
                "took": took,
                "url.path": request.url.path,
                "http.request.method": request.method,
                "http.response.status_code": response.status_code,
                "user.display_name": user_display_name,
                "platform": get_platform_info(),
                "config": get_config_info(shraga_config),
                "user_agent": get_user_agent_info(request.headers.get("user-agent")),
                "tags": ["request"],
            },
        )
        return response
    except Exception:
        logger.exception(f"Unhandled exception in request {request.url.path}")
        return Response("Internal Server Error", status_code=500)
