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
        except (ValueError, UnicodeDecodeError, binascii.Error, jwt.DecodeError) as e:
            print(f"JWT decoding error: {e}")
            raise AuthenticationError("Invalid JWT token")

        username = decoded.get("username") or decoded.get("email") or "anonymous"
        
        # allow adding string \ numeric custom meta keys.
        # length is limited to 100 for strings.
        # max 10 metadata items to prevent excessive data storage.
        # These values are saved in user_metadata for reports etc.
        metadata = dict(list({
            k: v
            for k, v in decoded.items()
            if v is not None
            and not isinstance(v, bool)  # Exclude booleans (bool is subclass of int in Python)
            and isinstance(v, (str, int))
            and (not isinstance(v, str) or len(v) <= 100)
        }.items())[:10])

        user = ShragaUser(
            username=username,
            metadata={
                "auth_type": "jwt",
                **metadata
            }
        )
        
        return AuthCredentials(["authenticated"]), user
