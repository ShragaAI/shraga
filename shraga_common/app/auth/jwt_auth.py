import binascii

import jwt
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                     AuthenticationError)

from ..config import get_config
from .user import ShragaUser


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
                raise AuthenticationError("Invalid scheme")
            auth_secret = shraga_config.auth_realms().get("jwt", {}).get("secret", "")
            decoded = jwt.decode(token, auth_secret, algorithms=["HS256"])
        except (ValueError, UnicodeDecodeError, binascii.Error, jwt.DecodeError):
            raise AuthenticationError("Invalid JWT token")

        username = decoded.get("username") or decoded.get("email") or "anonymous"
        metadata = {k: v for k, v in decoded.items() if v is not None}

        user = ShragaUser(
            username=username,
            metadata={
                "auth_type": "jwt",
                **metadata
            }
        )
        
        return AuthCredentials(["authenticated"]), user
