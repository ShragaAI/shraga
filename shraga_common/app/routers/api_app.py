import os

from fastapi import Depends, FastAPI, HTTPException
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from shraga_common.logger import get_git_commit

from ..auth import (BasicAuthBackend, GoogleAuthBackend,
                   JWTAuthBackend, MicrosoftAuthBackend)
from ..config import get_config
from ..middlewares import logging_middleware
from ..services.analytics_service import is_analytics_authorized

from .analytics_api import router as analytics_router
from .flows_api import router as flows_router
from .history_api import router as history_router
from .services_api import router as services_router

api_app = FastAPI(root_path="/api")

api_app.add_middleware(BaseHTTPMiddleware, dispatch=logging_middleware)

def load_api_app():
    shraga_config = get_config()
    if shraga_config.auth_realms():

        @api_app.middleware("http")
        async def enforce_auth(request: Request, call_next):
            if not request.user.is_authenticated:
                return JSONResponse({"detail": "Unauthenticated"}, status_code=401)
            request.state.user_display_name = request.user.display_name
            response = await call_next(request)
            return response

        if "jwt" in shraga_config.auth_realms():
            api_app.add_middleware(
                AuthenticationMiddleware,
                backend=JWTAuthBackend(),
                on_error=lambda conn, exc: JSONResponse(
                    {"detail": str(exc)}, status_code=401
                ),
            )
        if "basic" in shraga_config.auth_realms():
            api_app.add_middleware(
                AuthenticationMiddleware,
                backend=BasicAuthBackend(),
                on_error=lambda conn, exc: JSONResponse(
                    {"detail": str(exc)}, status_code=401
                ),
            )
        if "google" in shraga_config.auth_realms():
            api_app.add_middleware(
                AuthenticationMiddleware,
                backend=GoogleAuthBackend(),
                on_error=lambda conn, exc: JSONResponse(
                    {"detail": str(exc)}, status_code=401
                ),
            )
        if "microsoft" in shraga_config.auth_realms():
            api_app.add_middleware(
                AuthenticationMiddleware,
                backend=MicrosoftAuthBackend(),
                on_error=lambda conn, exc: JSONResponse(
                    {"detail": str(exc)}, status_code=401
                ),
            )

        @api_app.get("/whoami")
        async def whoami(request: Request) -> dict:
            display_name = (
                request.user.display_name if hasattr(request, "user") else "<unknown>"
            )
            ret = {
                "display_name": display_name,
                "shraga_version": get_git_commit() or "unknown",
                # "identity": request.user.identity,
            }
            if is_analytics_authorized(display_name):
                ret["roles"] = ["analytics"]
            return ret

    else:

        @api_app.get("/whoami")
        async def whoami() -> dict:
            return {"user": "<unknown>", "roles": ["analytics"]}


    if os.getenv("SHRAGA_PROD") != "true":
        # Only enable CORS on non-prod
        api_app.add_middleware(
            CORSMiddleware,
            allow_origins=[
                "http://localhost:5000",
            ],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    api_app.include_router(
        flows_router,
        prefix="/flows",
        tags=["flows"],
    )

    if not get_config("history.enabled") is False:
        api_app.include_router(
            history_router,
            prefix="/history",
            tags=["history"],
        )
        if get_config("history.analytics"):

            def check_analytics_auth(request: Request):
                email = request.user.display_name if hasattr(request, "user") else None
                if not is_analytics_authorized(email):
                    raise HTTPException(status_code=403)
                return True

            api_app.include_router(
                analytics_router,
                prefix="/analytics",
                tags=["analytics"],
                dependencies=[Depends(check_analytics_auth)],
            )


    api_app.include_router(
        services_router,
        prefix="/services",
        tags=["services"],
    )


    @api_app.get("/ui/configs")
    async def ui_configs() -> dict:
        d = get_config("ui")
        d["history_enabled"] = get_config("history.enabled")
        d["map_api"] = get_config("services.googlemaps")
        d["input_max_length"] = get_config("flows.input_max_length")
        d["build"] = os.getenv("SHRAGA_BUILD_TAG")
        d["prod"] = os.getenv("SHRAGA_PROD")

        return d
