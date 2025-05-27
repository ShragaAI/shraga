import binascii

import requests
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                     AuthenticationError, SimpleUser)


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
