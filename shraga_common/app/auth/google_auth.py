import binascii

import requests
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                     AuthenticationError)

from .user import ShragaUser


class GoogleAuthBackend(AuthenticationBackend):
    async def authenticate(self, conn):
        if "user" in conn and conn.user.is_authenticated:
            return AuthCredentials(["authenticated"]), conn.user

        if "Authorization" not in conn.headers:
            raise AuthenticationError("Unauthenticated")

        auth = conn.headers["Authorization"]
        try:
            scheme, token = auth.split()
            if scheme.lower() != "google":
                return
            response = requests.get(
                f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={token}",
                timeout=10
            )
            if response.status_code != 200:
                raise AuthenticationError("Invalid Google OAuth token")
            user_info = response.json()
        except (ValueError, UnicodeDecodeError, binascii.Error) as exc:
            raise AuthenticationError("Invalid Google OAuth token") from exc

        username = user_info.get("email") or user_info.get("verified_email")
        user = ShragaUser(
            username=username,
            metadata={
                "display_name": user_info.get("displayName"),
                "email": username,
                "user_id": user_info.get("id"),
                "auth_type": "google",
            }
        )

        return AuthCredentials(["authenticated"]), user
