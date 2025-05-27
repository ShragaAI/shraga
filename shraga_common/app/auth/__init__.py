from .basic_auth import BasicAuthBackend
from .jwt_auth import JWTAuthBackend
from .google_auth import GoogleAuthBackend
from .microsoft_auth import MicrosoftAuthBackend

__all__ = [
    "BasicAuthBackend",
    "JWTAuthBackend", 
    "GoogleAuthBackend", 
    "MicrosoftAuthBackend"
]