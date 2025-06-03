import os
import unittest
from unittest.mock import patch, mock_open, MagicMock

import yaml
from shraga_common.shraga_config import ShragaConfig


class TestShragaConfig(unittest.TestCase):
    def setUp(self):
        # Sample YAML content for tests
        self.sample_yaml = """
auth:
  realms:
    realm1:
      type: basic
    realm2:
      type: oauth
  users:
    - user1
    - user2

retrievers:
  retriever1:
    type: elasticsearch
    host: localhost
    port: 9200
  retriever2:
    type: opensearch
    host: search.example.com
    port: 443

paths:
  data_path: ${DATA_DIR}/data
  log_path: ${LOG_DIR}/logs
"""

    def test_init(self):
        """Test the initialization of ShragaConfig"""
        config = ShragaConfig()
        self.assertIsNone(config.all_configs)

    @patch("builtins.open", new_callable=mock_open)
    def test_load_default_path(self, mock_file):
        """Test loading config from default path"""
        mock_file.return_value.__enter__.return_value.read.return_value = self.sample_yaml
        
        # Mock yaml.load to return a dict representation of our YAML
        with patch("yaml.load") as mock_yaml_load:
            mock_yaml_load.return_value = yaml.safe_load(self.sample_yaml)
            
            config = ShragaConfig()
            result = config.load()
            
            # Check that the file was opened with the default path
            mock_file.assert_called_once_with("config.yaml")
            
            # Check that the config was loaded and returned self
            self.assertEqual(result, config)
            self.assertIsNotNone(config.all_configs)

    @patch.dict(os.environ, {"CONFIG_PATH": "/custom/path/config.yaml"})
    @patch("builtins.open", new_callable=mock_open)
    def test_load_env_path(self, mock_file):
        """Test loading config from environment variable path"""
        mock_file.return_value.__enter__.return_value.read.return_value = self.sample_yaml
        
        with patch("yaml.load") as mock_yaml_load:
            mock_yaml_load.return_value = yaml.safe_load(self.sample_yaml)
            
            config = ShragaConfig()
            config.load()
            
            # Check that the file was opened with the path from environment variable
            mock_file.assert_called_once_with("/custom/path/config.yaml")

    @patch.dict(os.environ, {"CONFIG_PATH": "/custom/path/config.yaml"})
    @patch("builtins.open", new_callable=mock_open)
    def test_load_custom_path(self, mock_file):
        """Test loading config from explicitly provided path"""
        mock_file.return_value.__enter__.return_value.read.return_value = self.sample_yaml
        
        with patch("yaml.load") as mock_yaml_load:
            mock_yaml_load.return_value = yaml.safe_load(self.sample_yaml)
            
            config = ShragaConfig()
            config.load("/explicit/path/config.yaml")
            
            # Check that the file was opened with the explicitly provided path
            mock_file.assert_called_once_with("/explicit/path/config.yaml")

    def test_get_existing_key(self):
        """Test getting an existing key from config"""
        config = ShragaConfig()
        
        # Directly set the all_configs property to our test data
        config.all_configs = {
            "retrievers": {
                "retriever1": {
                    "type": "elasticsearch",
                    "host": "localhost",
                    "port": 9200
                }
            },
            "auth": {
                "users": ["user1", "user2"]
            }
        }
        
        # Test getting existing keys
        self.assertEqual(config.get("retrievers.retriever1.type"), "elasticsearch")
        self.assertEqual(config.get("auth.users"), ["user1", "user2"])

    def test_get_nonexistent_key(self):
        """Test getting a nonexistent key from config"""
        config = ShragaConfig()
        
        # Directly set the all_configs property to our test data
        config.all_configs = {
            "retrievers": {
                "retriever1": {
                    "type": "elasticsearch"
                }
            }
        }
        
        # Test getting nonexistent key
        self.assertIsNone(config.get("nonexistent.key"))
        
        # Test getting nonexistent key with default value
        self.assertEqual(config.get("nonexistent.key", "default_value"), "default_value")

    def test_set_key(self):
        """Test setting a key in config"""
        config = ShragaConfig()
        
        # Directly set the all_configs property to our test data
        config.all_configs = {
            "retrievers": {
                "retriever1": {
                    "type": "elasticsearch",
                    "host": "localhost",
                    "port": 9200
                }
            }
        }
        
        # Set a new key
        config.set("new.key", "new_value")
        self.assertEqual(config.get("new.key"), "new_value")
        
        # Update an existing key
        config.set("retrievers.retriever1.type", "new_type")
        self.assertEqual(config.get("retrievers.retriever1.type"), "new_type")

    def test_auth_realms(self):
        """Test auth_realms method"""
        config = ShragaConfig()
        
        # Directly set the all_configs property to our test data
        config.all_configs = {
            "auth": {
                "realms": {
                    "realm1": {"type": "basic"},
                    "realm2": {"type": "oauth"}
                }
            }
        }
        
        expected_realms = {
            "realm1": {"type": "basic"},
            "realm2": {"type": "oauth"}
        }
        self.assertEqual(config.auth_realms(), expected_realms)

    def test_auth_users(self):
        """Test auth_users method"""
        config = ShragaConfig()
        
        # Directly set the all_configs property to our test data
        config.all_configs = {
            "auth": {
                "users": ["user1", "user2"]
            }
        }
        
        expected_users = {"user1", "user2"}
        self.assertEqual(config.auth_users(), expected_users)

    def test_retrievers(self):
        """Test retrievers method"""
        config = ShragaConfig()
        
        # Directly set the all_configs property to our test data
        config.all_configs = {
            "retrievers": {
                "retriever1": {
                    "type": "elasticsearch",
                    "host": "localhost",
                    "port": 9200
                },
                "retriever2": {
                    "type": "opensearch",
                    "host": "search.example.com",
                    "port": 443
                }
            }
        }
        
        expected_retrievers = {
            "retriever1": {
                "type": "elasticsearch",
                "host": "localhost",
                "port": 9200
            },
            "retriever2": {
                "type": "opensearch",
                "host": "search.example.com",
                "port": 443
            }
        }
        self.assertEqual(config.retrievers(), expected_retrievers)

    @patch("builtins.open", new_callable=mock_open)
    @patch.dict(os.environ, {"DATA_DIR": "/data", "LOG_DIR": "/logs"})
    def test_path_constructor(self, mock_file):
        """Test the path_constructor method for environment variable expansion"""
        mock_file.return_value.__enter__.return_value.read.return_value = self.sample_yaml
        
        # We need to actually test the YAML loading with the constructor
        config = ShragaConfig()
        
        # Create a mock loader and node
        loader = MagicMock()
        node = MagicMock()
        
        # Test with an environment variable that exists
        node.value = "${DATA_DIR}/data"
        result = config.path_constructor(loader, node)
        self.assertEqual(result, "/data/data")
        
        # Test with an environment variable that doesn't exist
        node.value = "${NONEXISTENT_VAR}/data"
        result = config.path_constructor(loader, node)
        self.assertEqual(result, "")


if __name__ == "__main__":
    unittest.main()
