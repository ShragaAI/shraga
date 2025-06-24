import base64
import unittest
from unittest.mock import MagicMock, patch

import bcrypt
from starlette.authentication import AuthCredentials, AuthenticationError, SimpleUser

from shraga_common.app.auth.basic_auth import BasicAuthBackend
from shraga_common.app.auth.user import ShragaUser
from shraga_common.shraga_config import ShragaConfig


class TestBasicAuthBackend(unittest.IsolatedAsyncioTestCase):
    """Test suite for BasicAuthBackend class."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.auth_backend = BasicAuthBackend()
        
        # Test credentials
        self.test_username = "test@example.com"
        self.test_password = "password123"
        
        # Generate bcrypt hash for test password
        self.test_password_hash = bcrypt.hashpw(
            self.test_password.encode(), bcrypt.gensalt()
        ).decode()
        
        # Create basic auth header
        credentials = f"{self.test_username}:{self.test_password}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        self.auth_header = f"Basic {encoded_credentials}"
        
        # Mock connection object
        self.conn = MagicMock()
        self.conn.headers = {"Authorization": self.auth_header}
        self.conn.user = MagicMock()
        self.conn.user.is_authenticated = False

    def test_verify_basic_auth_with_hashed_password(self):
        """Test authentication with properly hashed bcrypt password."""
        basic_list = [f"{self.test_username}:{self.test_password_hash}"]
        
        result = self.auth_backend.verify_basic_auth(
            self.test_username, self.test_password, basic_list
        )
        
        self.assertTrue(result)

    def test_verify_basic_auth_with_plaintext_password(self):
        """
        Test authentication with plaintext password.
        
        WARNING: This is for backward compatibility only and will be removed in a future release.
        DO NOT use plaintext passwords in production environments.
        """
        basic_list = [f"{self.test_username}:{self.test_password}"]
        
        result = self.auth_backend.verify_basic_auth(
            self.test_username, self.test_password, basic_list
        )
        
        self.assertTrue(result)
        # Add a warning message in the test to remind developers this will be removed
        print(
            "\nWARNING: Plaintext password authentication is deprecated and will be "
            "removed in a future release. Use bcrypt hashed passwords instead."
        )

    def test_verify_basic_auth_with_invalid_password(self):
        """Test authentication with invalid password."""
        basic_list = [f"{self.test_username}:{self.test_password_hash}"]
        
        result = self.auth_backend.verify_basic_auth(
            self.test_username, "wrong_password", basic_list
        )
        
        self.assertFalse(result)

    def test_verify_basic_auth_with_invalid_format(self):
        """Test authentication with invalid credential format."""
        # Missing colon separator
        basic_list = [self.test_username]
        
        result = self.auth_backend.verify_basic_auth(
            self.test_username, self.test_password, basic_list
        )
        
        self.assertFalse(result)

    def test_verify_basic_auth_with_wrong_username(self):
        """Test authentication with non-existent username."""
        basic_list = [f"{self.test_username}:{self.test_password_hash}"]
        
        result = self.auth_backend.verify_basic_auth(
            "wrong@example.com", self.test_password, basic_list
        )
        
        self.assertFalse(result)

    @patch("shraga_common.app.auth.basic_auth.get_config")
    async def test_authenticate_success(self, mock_get_config):
        """Test successful authentication."""
        # Set up mock config
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "basic": [f"{self.test_username}:{self.test_password_hash}"]
        }
        mock_get_config.return_value = mock_config
        
        # Call authenticate
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify results
        self.assertEqual(credentials.scopes, AuthCredentials(["authenticated"]).scopes)
        self.assertEqual(user.username, self.test_username)
        self.assertIsInstance(user, ShragaUser)
        
        # Verify user metadata contains auth_type
        self.assertEqual(user.get_metadata("auth_type"), "basic")
        self.assertEqual(user.get_metadata("email"), self.test_username)

    @patch("shraga_common.app.auth.basic_auth.get_config")
    async def test_authenticate_with_plaintext_password(self, mock_get_config):
        """
        Test authentication with plaintext password.
        
        WARNING: This is for backward compatibility only and will be removed in a future release.
        DO NOT use plaintext passwords in production environments.
        """
        # Set up mock config with plaintext password
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "basic": [f"{self.test_username}:{self.test_password}"]
        }
        mock_get_config.return_value = mock_config
        
        # Call authenticate
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify results
        self.assertEqual(credentials.scopes, AuthCredentials(["authenticated"]).scopes)
        self.assertEqual(user.username, self.test_username)
        self.assertIsInstance(user, ShragaUser)
        
        # Verify user metadata contains auth_type
        self.assertEqual(user.get_metadata("auth_type"), "basic")
        self.assertEqual(user.get_metadata("email"), self.test_username)
        
        # Add a warning message in the test to remind developers this will be removed
        print(
            "\nWARNING: Plaintext password authentication is deprecated and will be "
            "removed in a future release. Use bcrypt hashed passwords instead."
        )

    @patch("shraga_common.app.auth.basic_auth.get_config")
    async def test_authenticate_already_authenticated(self, mock_get_config):
        """Test skipping authentication when user is already authenticated."""
        # Set up already authenticated user
        # In Starlette, conn.user is an attribute not a dictionary key
        # so we need to make our mock behave like the real connection object
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
        
        # Verify we didn't try to authenticate again
        mock_get_config.assert_not_called()

    @patch("shraga_common.app.auth.basic_auth.get_config")
    async def test_authenticate_no_auth_header(self, mock_get_config):
        """Test authentication failure when Authorization header is missing."""
        # Remove Authorization header
        self.conn.headers = {}
        
        # Call authenticate and verify it raises error
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Unauthenticated")
        mock_get_config.assert_not_called()

    @patch("shraga_common.app.auth.basic_auth.get_config")
    async def test_authenticate_wrong_scheme(self, mock_get_config):
        """Test authentication is skipped for non-Basic auth schemes."""
        # Set different auth scheme
        self.conn.headers = {"Authorization": "Bearer token123"}
        
        # Call authenticate
        result = await self.auth_backend.authenticate(self.conn)
        
        # Should return None to skip this authentication backend
        self.assertIsNone(result)
        mock_get_config.assert_not_called()

    @patch("shraga_common.app.auth.basic_auth.get_config")
    async def test_authenticate_invalid_auth_format(self, mock_get_config):
        """Test authentication failure with invalid auth header format."""
        # Set invalid auth header
        self.conn.headers = {"Authorization": "Basic invalid-base64"}
        
        # Call authenticate and verify it raises error
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Invalid basic auth credentials")
        mock_get_config.assert_not_called()

    @patch("shraga_common.app.auth.basic_auth.get_config")
    async def test_authenticate_invalid_credentials(self, mock_get_config):
        """Test authentication failure with invalid credentials."""
        # Set up mock config
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {
            "basic": [f"{self.test_username}:{self.test_password_hash}"]
        }
        mock_get_config.return_value = mock_config
        
        # Create auth header with wrong password
        wrong_credentials = f"{self.test_username}:wrong_password"
        encoded_wrong_credentials = base64.b64encode(wrong_credentials.encode()).decode()
        self.conn.headers = {"Authorization": f"Basic {encoded_wrong_credentials}"}
        
        # Call authenticate and verify it raises error
        with self.assertRaises(AuthenticationError) as context:
            await self.auth_backend.authenticate(self.conn)
        
        self.assertEqual(str(context.exception), "Authentication failed")


if __name__ == "__main__":
    unittest.main()
