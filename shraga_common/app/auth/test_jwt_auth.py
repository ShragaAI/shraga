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
        self.assertEqual(user.username, self.test_username)
    
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

    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_metadata_filters_none_values(self, mock_get_config):
        """Test that None values are filtered from metadata."""
        # Create payload with None values
        payload_with_none = {
            "username": self.test_username,
            "user_id": "user123",
            "company": None,
            "department": "engineering"
        }
        
        token = jwt.encode(payload_with_none, self.test_secret, algorithm="HS256")
        self.conn.headers = {"Authorization": f"Bearer {token}"}
        
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {"jwt": {"secret": self.test_secret}}
        mock_get_config.return_value = mock_config
        
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify None values are filtered out
        self.assertIsNone(user.get_metadata("company"))
        self.assertEqual(user.get_metadata("user_id"), "user123")
        self.assertEqual(user.get_metadata("department"), "engineering")
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_metadata_filters_non_string_non_int_values(self, mock_get_config):
        """Test that non-string/non-int values are filtered from metadata."""
        # Create payload with various data types
        payload_with_types = {
            "username": self.test_username,
            "user_id": "user123",
            "age": 30,  # int - should be kept
            "name": "John Doe",  # string - should be kept
            "roles": ["admin", "user"],  # list - should be filtered
            "settings": {"theme": "dark"},  # dict - should be filtered
            "active": True,  # bool - should be filtered
            "salary": 50000.50  # float - should be filtered
        }
        
        token = jwt.encode(payload_with_types, self.test_secret, algorithm="HS256")
        self.conn.headers = {"Authorization": f"Bearer {token}"}
        
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {"jwt": {"secret": self.test_secret}}
        mock_get_config.return_value = mock_config
        
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify only string and int values are kept
        self.assertEqual(user.get_metadata("user_id"), "user123")
        self.assertEqual(user.get_metadata("age"), 30)
        self.assertEqual(user.get_metadata("name"), "John Doe")
        self.assertIsNone(user.get_metadata("roles"))
        self.assertIsNone(user.get_metadata("settings"))
        self.assertIsNone(user.get_metadata("active"))
        self.assertIsNone(user.get_metadata("salary"))
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_metadata_filters_long_strings(self, mock_get_config):
        """Test that strings longer than 100 characters are filtered from metadata."""
        # Create payload with long string
        short_string = "a" * 100  # exactly 100 chars - should be kept
        long_string = "b" * 101  # 101 chars - should be filtered
        
        payload_with_long_strings = {
            "username": self.test_username,
            "short_field": short_string,
            "long_field": long_string,
            "normal_field": "normal value"
        }
        
        token = jwt.encode(payload_with_long_strings, self.test_secret, algorithm="HS256")
        self.conn.headers = {"Authorization": f"Bearer {token}"}
        
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {"jwt": {"secret": self.test_secret}}
        mock_get_config.return_value = mock_config
        
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify string length filtering
        self.assertEqual(user.get_metadata("short_field"), short_string)
        self.assertIsNone(user.get_metadata("long_field"))
        self.assertEqual(user.get_metadata("normal_field"), "normal value")
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_metadata_limited_to_10_items(self, mock_get_config):
        """Test that metadata is limited to maximum 10 items."""
        # Create payload with more than 10 metadata items
        # Note: username is extracted separately and not counted in the 10-item limit
        payload_with_many_fields = {
            "email": self.test_username,  # Will be used as username, not in metadata limit
            "field_01": "value_01",
            "field_02": "value_02",
            "field_03": "value_03",
            "field_04": "value_04",
            "field_05": "value_05",
            "field_06": "value_06",
            "field_07": "value_07",
            "field_08": "value_08",
            "field_09": "value_09",
            "field_10": "value_10",
            "field_11": "value_11",
            "field_12": "value_12",
            "field_13": "value_13",
            "field_14": "value_14",
            "field_15": "value_15"
        }
        
        token = jwt.encode(payload_with_many_fields, self.test_secret, algorithm="HS256")
        self.conn.headers = {"Authorization": f"Bearer {token}"}
        
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {"jwt": {"secret": self.test_secret}}
        mock_get_config.return_value = mock_config
        
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Count metadata items (excluding auth_type which is added separately)
        metadata_items = [k for k in user.metadata.keys() if k != "auth_type"]
        
        # Should have at most 10 items from the JWT payload (plus email used as username)
        self.assertLessEqual(len(metadata_items), 11)  # 10 fields + email
        
        # Verify auth_type is still present
        self.assertEqual(user.get_metadata("auth_type"), "jwt")
    
    @patch("shraga_common.app.auth.jwt_auth.get_config")
    async def test_metadata_with_mixed_valid_invalid_items(self, mock_get_config):
        """Test metadata extraction with mix of valid and invalid items."""
        # Create payload with mix of valid/invalid items
        payload_mixed = {
            "username": self.test_username,
            "valid_string": "test",
            "valid_int": 42,
            "none_value": None,
            "long_string": "x" * 101,
            "list_value": [1, 2, 3],
            "dict_value": {"key": "value"},
            "bool_value": True,
            "another_valid_string": "hello",
            "another_valid_int": 100
        }
        
        token = jwt.encode(payload_mixed, self.test_secret, algorithm="HS256")
        self.conn.headers = {"Authorization": f"Bearer {token}"}
        
        mock_config = MagicMock(spec=ShragaConfig)
        mock_config.auth_realms.return_value = {"jwt": {"secret": self.test_secret}}
        mock_get_config.return_value = mock_config
        
        credentials, user = await self.auth_backend.authenticate(self.conn)
        
        # Verify only valid items are kept
        self.assertEqual(user.get_metadata("valid_string"), "test")
        self.assertEqual(user.get_metadata("valid_int"), 42)
        self.assertEqual(user.get_metadata("another_valid_string"), "hello")
        self.assertEqual(user.get_metadata("another_valid_int"), 100)
        
        # Verify invalid items are filtered
        self.assertIsNone(user.get_metadata("none_value"))
        self.assertIsNone(user.get_metadata("long_string"))
        self.assertIsNone(user.get_metadata("list_value"))
        self.assertIsNone(user.get_metadata("dict_value"))
        self.assertIsNone(user.get_metadata("bool_value"))


if __name__ == "__main__":
    unittest.main()
