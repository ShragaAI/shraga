import base64
import binascii

import jwt
import requests
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                      AuthenticationError, SimpleUser)

from ..config import get_config



class BasicAuthBackend(AuthenticationBackend):
    async def authenticate(self, conn):
        if "user" in conn and conn.user.is_authenticated:
            return AuthCredentials(["authenticated"]), conn.user

        if "Authorization" not in conn.headers:
            raise AuthenticationError("Unauthenticated")

        auth = conn.headers["Authorization"]
        try:
            scheme, credentials = auth.split()
            if scheme.lower() != "basic":
                return
            decoded = base64.b64decode(credentials).decode("ascii")
        except (ValueError, UnicodeDecodeError, binascii.Error):
            raise AuthenticationError("Invalid basic auth credentials")

        username, _, password = decoded.partition(":")
        username = username.lower().strip()
        shraga_config = get_config()
        if not (
            username in shraga_config.auth_users()
            and f"{username}:{password}" in shraga_config.auth_realms().get("basic")
        ):
            raise AuthenticationError("Authentication failed")

        return AuthCredentials(["authenticated"]), SimpleUser(username)


class JWTAuthBackend(AuthenticationBackend):
    async def authenticate(self, conn):
        shraga_config = get_config()
        if "user" in conn and conn.user.is_authenticated:
            return AuthCredentials(["authenticated"]), conn.user

        if "Authorization" not in conn.headers:
            raise AuthenticationError("Unauthenticated")

        auth = conn.headers["Authorization"]
        try:
            scheme, token = auth.split()
            if scheme.lower() != "bearer":
                return
            auth_secret = shraga_config.auth_realms().get("jwt").get("secret")
            decoded = jwt.decode(token, auth_secret, algorithms=["HS256"])
        except (ValueError, UnicodeDecodeError, binascii.Error, jwt.DecodeError):
            raise AuthenticationError("Invalid JWT token")

        username = decoded.get("username") or decoded.get("email") or "anonymous"
        return AuthCredentials(["authenticated"]), SimpleUser(str(username).strip())


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
                f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={token}"
            )
            if response.status_code != 200:
                raise AuthenticationError("Invalid Google OAuth token")
            user_info = response.json()
        except (ValueError, UnicodeDecodeError, binascii.Error):
            raise AuthenticationError("Invalid Google OAuth token")

        return AuthCredentials(["authenticated"]), SimpleUser(user_info["email"])


class MicrosoftAuthBackend(AuthenticationBackend):
    async def authenticate(self, conn):
        if "user" in conn and conn.user.is_authenticated:
            return AuthCredentials(["authenticated"]), conn.user

        if "Authorization" not in conn.headers:
            raise AuthenticationError("Unauthenticated")

        auth = conn.headers["Authorization"]
        try:
            scheme, token = auth.split()
            if scheme.lower() != "microsoft":
                return
            response = requests.get(
                f"https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f"Bearer {token}"},
            )
            if response.status_code != 200:
                raise AuthenticationError("Invalid Microsoft OAuth token")
            user_info = response.json()
        except (ValueError, UnicodeDecodeError, binascii.Error):
            raise AuthenticationError("Invalid Microsoft OAuth token")

        return AuthCredentials(["authenticated"]), SimpleUser(
            user_info["userPrincipalName"]
        )
