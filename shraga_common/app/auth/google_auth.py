import binascii

import requests
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                     AuthenticationError, SimpleUser)


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
