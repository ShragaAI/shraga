import unittest
from unittest.mock import MagicMock, patch

import jwt
from starlette.authentication import AuthCredentials, AuthenticationError

from shraga_common.app.auth.jwt_auth import JWTAuthBackend
from shraga_common.app.auth.user import ShragaUser
from shraga_common.shraga_config import ShragaConfig


class TestJWTAuthBackend(unittest.IsolatedAsyncioTestCase):
    """Test suite for JWTAuthBackend class."""
    
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
    async def test_authenticate_success(self, mock_get_config):
        """Test successful JWT authentication."""
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
        
        # Verify user metadata contains auth_type and JWT claims
        self.assertEqual(user.get_metadata("auth_type"), "jwt")
        self.assertEqual(user.get_metadata("user_id"), "user123")
        self.assertEqual(user.get_metadata("company"), "test_company")
        self.assertEqual(user.get_metadata("email"), self.test_username)
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_with_missing_username(self, mock_get_config):
        """Test JWT authentication with missing username but having email."""
        # Create payload without username
        payload_without_username = {
            "email": self.test_username,
            "user_id": "user123",
            "company": "test_company"
        }
        
        # Create token and auth header
        token = jwt.encode(
            payload_without_username, 
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
        
        # Verify results - should use email as username
        self.assertEqual(user.username, self.test_username)
        self.assertEqual(user.get_metadata("auth_type"), "jwt")
        self.assertEqual(user.get_metadata("email"), self.test_username)
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_without_username_or_email(self, mock_get_config):
        """Test JWT authentication without username or email."""
        # Create payload without username or email
        payload_minimal = {
            "user_id": "user123",
            "company": "test_company"
        }
        
        # Create token and auth header
        token = jwt.encode(
            payload_minimal, 
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
        
        # Verify results - should use "anonymous" as username
        self.assertEqual(user.username, "anonymous")
        self.assertEqual(user.get_metadata("auth_type"), "jwt")
        self.assertEqual(user.get_metadata("user_id"), "user123")
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_invalid_token(self, mock_get_config):
        """Test authentication with invalid JWT token."""
        # Set up mock config
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "jwt": {"secret": "wrong_secret"}  # Use wrong secret to cause verification failure
        }
        mock_get_config.return_value = mock_config
        
        # Call authenticate and verify it raises error
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Invalid JWT token")
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_corrupted_token(self, mock_get_config):
        """Test authentication with corrupted JWT token."""
        # Create corrupted token
        self.conn.headers = {"Authorization": "Bearer invalid.token.format"}
        
        # Set up mock config
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "jwt": {"secret": self.test_secret}
        }
        mock_get_config.return_value = mock_config
        
        # Call authenticate and verify it raises error
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Invalid JWT token")
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_already_authenticated(self, mock_get_config):
        """Test skipping authentication when user is already authenticated."""
        # Set up already authenticated user
        mock_user = MagicMock(spec=ShragaUser)
        mock_user.is_authenticated = True
        mock_user.metadata = {"auth_type": "test_auth"}
        
        # Create a new mock connection to avoid side effects from other tests
        conn = MagicMock()
        conn.user = mock_user
        
        # Properly define the __contains__ method with both self and item parameters
        conn.__contains__ = lambda self, item: item == "user"
        
        # Call authenticate
        credentials, user = await self.auth_backend.authenticate(conn)
        
        # Verify results - should return existing user
        self.assertEqual(credentials.scopes, AuthCredentials(["authenticated"]).scopes)
        self.assertEqual(user, conn.user)
        self.assertEqual(user.metadata["auth_type"], "test_auth")
        
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_no_auth_header(self, mock_get_config):
        """Test authentication failure when Authorization header is missing."""
        # Remove Authorization header
        self.conn.headers = {}
        
        # Call authenticate and verify it raises error
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Unauthenticated")
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_authenticate_wrong_scheme(self, mock_get_config):
        """Test authentication is skipped for non-Bearer auth schemes."""
        # Set different auth scheme
        self.conn.headers = {"Authorization": f"Basic {self.test_token}"}
        
        # Call authenticate and verify it raises error
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Invalid scheme")


if __name__ == "__main__":
    unittest.main()
