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
        roles = decoded.get("roles", [])
        
        other_keys = set(decoded.keys()) - {"username", "email", "roles"}
        
        
        # allow adding string \ numeric custom meta keys.
        # length is limited to 100 for strings.
        # max 10 metadata items to prevent excessive data storage.
        # These values are saved in user_metadata for reports etc.
        metadata = {}
        for key in list(other_keys)[:10]:
            value = decoded[key]
            if not (isinstance(value, (str, int)) and (not isinstance(value, bool))):
                continue
            if isinstance(value, str) and len(value) > 100:
                continue
            metadata[key] = value
            

        user = ShragaUser(
            username=username,
            roles=roles,
            metadata={
                "auth_type": "jwt",
                **metadata
            }
        )
        
        return AuthCredentials(["authenticated"]), user
