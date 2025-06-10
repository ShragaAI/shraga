from typing import Any, Dict, Optional

from starlette.authentication import SimpleUser

from shraga_common.utils import extract_user_org


class ShragaUser(SimpleUser):
    """
    ShragaUser extends SimpleUser to provide additional functionality
    for Shraga application users.
    
    This class adds support for storing additional user information,
    such as roles, and any user-specific metadata.
    """
    
    def __init__(
        self,
        username: str,
        roles: Optional[list] = None,
        metadata: Optional[Dict[str, Any]] = None):
        super().__init__(username)
        self.user_org = extract_user_org(self.username)
        self.roles = roles or []
        self.metadata = metadata or {}
    
    @property
    def identity(self) -> str:
        return self.username
    
    def has_role(self, role: str) -> bool:
        return role in self.roles
    
    def get_metadata(self, key: str, default: Any = None) -> Any:
        """
        Get a metadata value by key.
        
        Args:
            key: The metadata key
            default: The default value to return if the key is not found
            
        Returns:
            The metadata value, or the default if not found
        """
        return self.metadata.get(key, default)
    
    def set_metadata(self, key: str, value: Any) -> None:
        """
        Set a metadata value.
        
        Args:
            key: The metadata key
            value: The value to set
        """
        self.metadata[key] = value
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ShragaUser":
        return cls(
            username=data.get("username"),
            roles=data.get("roles"),
            metadata=data.get("metadata"),
        )
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "username": self.username,
            "roles": self.roles,
            "metadata": self.metadata,
        }
    
    def __str__(self) -> str:
        """String representation of the user."""
        return f"{self.username}"
