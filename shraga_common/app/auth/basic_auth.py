import base64
import binascii

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
