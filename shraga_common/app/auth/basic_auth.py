import base64
import binascii
import bcrypt


from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                     AuthenticationError, SimpleUser)

from ..config import get_config


class BasicAuthBackend(AuthenticationBackend):
    def verify_basic_auth(self, username, password, basic_list):
        for entry in basic_list:
            if ':' not in entry:
                continue
            entry_user, entry_hash = entry.split(':', 1)
            if username == entry_user:
                if bcrypt.checkpw(password.encode(), entry_hash.encode()):
                    return True
                elif password == entry_hash:
                    # Allow plaintext password for backward compatibility
                    return True
        return False
    
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
        
        basic_users = shraga_config.auth_realms().get("basic", [])
        if not self.verify_basic_auth(username, password, basic_users):
            raise AuthenticationError("Authentication failed")

        return AuthCredentials(["authenticated"]), SimpleUser(username)
