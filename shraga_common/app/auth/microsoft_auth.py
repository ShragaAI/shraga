import binascii

import requests
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                     AuthenticationError)

from .user import ShragaUser


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
                "https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10
            )
            if response.status_code != 200:
                raise AuthenticationError("Invalid Microsoft OAuth token")
            user_info = response.json()
        except (ValueError, UnicodeDecodeError, binascii.Error) as exc:
            raise AuthenticationError("Invalid Microsoft OAuth token") from exc

        username = user_info.get("mail") or user_info.get("userPrincipalName")
        
        metadata = {
            "display_name": user_info.get("displayName"),
            "email": user_info.get("mail") or user_info.get("userPrincipalName"),
            "user_id": user_info.get("id"),
            "auth_type": "microsoft",
        }
        
        # Remove None values
        metadata = {k: v for k, v in metadata.items() if v is not None}
            
        user = ShragaUser(
            username=username,
            metadata=metadata
        )

        return AuthCredentials(["authenticated"]), user
