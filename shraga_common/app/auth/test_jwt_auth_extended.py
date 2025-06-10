import datetime
import unittest
from unittest.mock import MagicMock, patch

import jwt
from starlette.authentication import AuthCredentials, AuthenticationError

from shraga_common.app.auth.jwt_auth import JWTAuthBackend
from shraga_common.app.auth.user import ShragaUser
from shraga_common.shraga_config import ShragaConfig


class TestJWTAuthBackendExtended(unittest.IsolatedAsyncioTestCase):
    """Extended test suite for JWTAuthBackend class focusing on error handling and metadata."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.auth_backend = JWTAuthBackend()
        
        # Test credentials
        self.test_username = "test@example.com"
        self.test_secret = "test_secret_key"
        
        # Create test JWT payload
        self.test_payload = {
            "username": self.test_username,
            "email": self.test_username,
            "user_id": "user123",
            "company": "test_company",
            "roles": ["admin", "user"]
        }
        
        # Create encoded JWT token
        self.test_token = jwt.encode(
            self.test_payload, 
            self.test_secret, 
            algorithm="HS256"
        )
        
        # Create auth header
        self.auth_header = f"Bearer {self.test_token}"
        
        # Mock connection object
        self.conn = MagicMock()
        self.conn.headers = {"Authorization": self.auth_header}
        self.conn.user = MagicMock()
        self.conn.user.is_authenticated = False

    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_with_expired_token(self, mock_get_config):
        """Test authentication with expired JWT token."""
        # Create payload with expired token
        expired_payload = {
            "username": self.test_username,
            "exp": datetime.datetime.now().timestamp() - 3600  # 1 hour in the past
        }
        
        # Create token and auth header
        expired_token = jwt.encode(
            expired_payload, 
            self.test_secret, 
            algorithm="HS256"
        )
        self.conn.headers = {"Authorization": f"Bearer {expired_token}"}
        
        # Set up mock config
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "jwt": {"secret": self.test_secret}
        }
        mock_get_config.return_value = mock_config
        
        # Call authenticate and verify it raises error
        with self.assertRaises(jwt.ExpiredSignatureError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Signature has expired")

    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_with_roles(self, mock_get_config):
        """Test authentication with roles in JWT token."""
        # Create payload with roles
        payload_with_roles = {
            "username": self.test_username,
            "email": self.test_username,
            "roles": ["admin", "user", "moderator"]
        }
        
        # Create token and auth header
        token = jwt.encode(
            payload_with_roles, 
            self.test_secret, 
            algorithm="HS256"
        )
        self.conn.headers = {"Authorization": f"Bearer {token}"}
        
        # Set up mock config
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "jwt": {"secret": self.test_secret}
        }
        mock_get_config.return_value = mock_config
        
        # Call authenticate
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify results
        self.assertEqual(credentials.scopes, AuthCredentials(["authenticated"]).scopes)
        self.assertEqual(user.username, self.test_username)
        self.assertIsInstance(user, ShragaUser)
        
        # Verify roles are correctly in metadata
        self.assertEqual(user.get_metadata("roles"), ["admin", "user", "moderator"])
        
        # Verify other metadata
        self.assertEqual(user.get_metadata("auth_type"), "jwt")
        self.assertEqual(user.get_metadata("email"), self.test_username)

    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_with_null_values(self, mock_get_config):
        """Test authentication with null values in JWT token."""
        # Create payload with null values
        payload_with_nulls = {
            "username": self.test_username,
            "email": None,
            "user_id": "user123",
            "company": None
        }
        
        # Create token and auth header
        token = jwt.encode(
            payload_with_nulls, 
            self.test_secret, 
            algorithm="HS256"
        )
        self.conn.headers = {"Authorization": f"Bearer {token}"}
        
        # Set up mock config
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "jwt": {"secret": self.test_secret}
        }
        mock_get_config.return_value = mock_config
        
        # Call authenticate
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify results
        self.assertEqual(user.username, self.test_username)
        
        # Verify null values are filtered out from metadata
        self.assertEqual(user.get_metadata("auth_type"), "jwt")
        self.assertEqual(user.get_metadata("user_id"), "user123")
        self.assertIsNone(user.get_metadata("email"))
        self.assertIsNone(user.get_metadata("company"))

    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_missing_jwt_secret(self, mock_get_config):
        """Test authentication with missing JWT secret in config."""
        # Set up mock config with missing secret
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "jwt": {}  # Missing secret
        }
        mock_get_config.return_value = mock_config
        
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Invalid JWT token")

if __name__ == "__main__":
    unittest.main()
