import os
from typing import List

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.gzip import GZipMiddleware

from shraga_common.logger import get_git_commit
from shraga_common.models import FlowBase

from ..config import get_config, load_config
from ..middlewares import logging_middleware
from ..services import list_flows_service
from .api_app import api_app, load_api_app
from .oauth_app import load_oauth_app, oauth_app


def setup_app(config_path: str, flows: List[FlowBase]) -> FastAPI:
    shraga_config = load_config(config_path)
    list_flows_service.register_flows(flows, shraga_config)
    load_api_app()
    load_oauth_app()
    
    if not shraga_config:
        exit(1)

    app = FastAPI(
        title="Shraga",
        description="Shraga AI",
        openapi_url="/openapi.json",
        # version=version,
        docs_url=None,
        redoc_url=None,
    )
    app.add_middleware(GZipMiddleware, minimum_size=5000)
    app.add_middleware(BaseHTTPMiddleware, dispatch=logging_middleware)
    app.mount("/api", api_app)
    app.mount("/oauth", oauth_app)


    @app.middleware("http")
    async def version_header_middleware(request, call_next):
        response = await call_next(request)
        response.headers["x-shraga-version"] = get_git_commit() or "unknown"
        return response


    @app.get("/healthz")
    async def healthz() -> dict:
        return {"ok": True, "build": os.getenv("SHRAGA_BUILD_TAG")}


    @app.get("/auth/login_methods")
    async def login_methods() -> List[str]:
        realms = list(shraga_config.auth_realms().keys())
        if "basic" in realms and ("google" in realms or "microsoft" in realms):
            realms.remove("basic")
            return realms
        return realms
    
    if get_config("ui.enabled") != "false":
        dist_path = "frontend/dist"
        if os.path.exists(dist_path):
            # Serve the frontend
            templates = Jinja2Templates(directory=dist_path)
            app.mount(
                "/assets", StaticFiles(directory=f"{dist_path}/assets"), name="static"
            )

            @app.get("/{path:path}", response_class=HTMLResponse)
            async def serve_react_app(request: Request, path: str):
                if path.startswith("api"):
                    raise HTTPException(404)
                return templates.TemplateResponse("index.html", {"request": request})


    return app