import os

import requests
from fastapi import FastAPI, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

from ..config import get_config
from ..middlewares import logging_middleware

oauth_app = FastAPI(root_path="/oauth")

oauth_app.add_middleware(BaseHTTPMiddleware, dispatch=logging_middleware)

def load_oauth_app():
    shraga_config = get_config()
    if shraga_config.auth_realms():

        @oauth_app.get("/keys")
        async def google_oauth_client_key(request: Request):
            google_client_id = get_config("auth.realms.google.client_id")
            microsoft_client_id = get_config("auth.realms.microsoft.client_id")

            response_data = {
                "google": google_client_id,
                "microsoft": microsoft_client_id,
            }
            return response_data

        @oauth_app.post("/google/token")
        async def google_oauth_callback(request: Request):
            try:
                data = await request.json()

                token_url = "https://accounts.google.com/o/oauth2/token"
                request_data = {
                    "code": data.get("code"),
                    "client_id": get_config("auth.realms.google.client_id"),
                    "client_secret": get_config("auth.realms.google.client_secret"),
                    "redirect_uri": data.get("redirect_uri"),
                    "grant_type": "authorization_code",
                }

                token_response = requests.post(token_url, data=request_data)
                token_data = token_response.json()

                if "error" in token_data:
                    raise HTTPException(
                        status_code=400, detail=f"Google OAuth error: {token_data['error']}"
                    )

                return {"token": token_data["access_token"]}

            except Exception as e:
                raise HTTPException(
                    status_code=500, detail=f"Authentication error: {str(e)}"
                )

        @oauth_app.post("/microsoft/token")
        async def microsoft_oauth_callback(request: Request):
            try:
                data = await request.json()

                token_url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
                request_data = {
                    "code": data.get("code"),
                    "client_id": get_config("auth.realms.microsoft.client_id"),
                    "client_secret": get_config("auth.realms.microsoft.client_secret"),
                    "redirect_uri": data.get("redirect_uri"),
                    "grant_type": "authorization_code",
                }

                token_response = requests.post(token_url, data=request_data)
                token_data = token_response.json()

                if "error" in token_data:
                    raise HTTPException(
                        status_code=400, detail=f"Google OAuth error: {token_data['error']}"
                    )

                return {"token": token_data["access_token"]}

            except Exception as e:
                raise HTTPException(
                    status_code=500, detail=f"Authentication error: {str(e)}"
                )


    if os.getenv("SHRAGA_PROD") != "true":
        # Only enable CORS on non-prod
        oauth_app.add_middleware(
            CORSMiddleware,
            allow_origins=[
                "http://localhost:5000",
                "http://localhost:3000",
            ],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
