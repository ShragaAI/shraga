import unittest
from unittest.mock import Mock, patch
import sys
import os

# Add the project root to the path to help with imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

from shraga_common.app.auth.user import ShragaUser
from shraga_common.app.services.history_service import log_interaction, log_system_message

class TestLogInteraction(unittest.IsolatedAsyncioTestCase):

    def create_mock_request(self, user_id: str):
        request = Mock()
        if user_id != "<unknown>":
            # Create a ShragaUser instead of a basic Mock
            request.user = ShragaUser(
                username=user_id,
                roles=["user"],
                metadata={"auth_type": "test"}
            )
        else:
            # For the case where we test without a user
            pass
        request.headers = {"user-agent": "test-agent"}
        return request

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.get_history_client')
    @patch('shraga_common.logger.get_config_info')
    @patch('shraga_common.logger.get_platform_info')
    @patch('shraga_common.logger.get_user_agent_info')
    async def test_user_org_added_to_log_document(
        self, 
        mock_get_user_agent_info,
        mock_get_platform_info,
        mock_get_config_info,
        mock_get_history_client, 
        mock_get_config
    ):
        test_cases = [
            ("alice@techcorp.com", "techcorp.com"),
            ("user@gmail.com", ""),
            ("username123", ""),
        ]
        
        for user_id, expected_org in test_cases:
            with self.subTest(user_id=user_id, expected_org=expected_org):
                mock_opensearch_client = Mock()
                mock_get_history_client.return_value = (mock_opensearch_client, "test_index")
                mock_get_config.return_value = {"test": "config"}
                mock_get_config_info.return_value = {"config": "test"}
                mock_get_platform_info.return_value = {"platform": "test"}
                mock_get_user_agent_info.return_value = {"user_agent": "test"}
                
                request = self.create_mock_request(user_id)
                context = {"text": "test message", "chat_id": "test_chat", "flow_id": "test_flow"}
                
                result = await log_interaction("user", request, context)
                
                self.assertTrue(result)
                
                mock_opensearch_client.index.assert_called_once()
                
                call_args = mock_opensearch_client.index.call_args
                self.assertEqual(call_args[1]["index"], "test_index")
                
                saved_document = call_args[1]["body"]
                self.assertEqual(saved_document["user_org"], expected_org)
                self.assertEqual(saved_document["text"], "test message")

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.get_history_client')
    @patch('shraga_common.logger.get_config_info')
    @patch('shraga_common.logger.get_platform_info')
    @patch('shraga_common.logger.get_user_agent_info')
    async def test_handles_request_without_user(
        self,
        mock_get_user_agent_info,
        mock_get_platform_info,
        mock_get_config_info,
        mock_get_history_client,
        mock_get_config
    ):
        mock_opensearch_client = Mock()
        mock_get_history_client.return_value = (mock_opensearch_client, "test_index")
        mock_get_config.return_value = {"test": "config"}
        mock_get_config_info.return_value = {"config": "test"}
        mock_get_platform_info.return_value = {"platform": "test"}
        mock_get_user_agent_info.return_value = {"user_agent": "test"}
        
        # Creating a request without a user attribute
        request = Mock(spec=['headers'])
        request.headers = {"user-agent": "test-agent"}
        # Make request.user raise AttributeError when accessed
        def user_property_raiser(obj):
            raise AttributeError("'Request' object has no attribute 'user'")
        
        # Create a property that raises an AttributeError when accessed
        type(request).__getattr__ = Mock(side_effect=user_property_raiser)
        
        context = {"text": "test", "chat_id": "test_chat", "flow_id": "test_flow"}
        with patch('shraga_common.app.services.history_service.ShragaUser') as mock_shraga_user:
            # Create a mock ShragaUser with default values
            mock_anonymous_user = Mock()
            mock_anonymous_user.identity = "<unknown>"
            mock_anonymous_user.user_org = ""
            mock_anonymous_user.metadata = {}
            mock_shraga_user.return_value = mock_anonymous_user
            
            result = await log_interaction("user", request, context)
            
            self.assertTrue(result)
            mock_shraga_user.assert_called_once()
            
            saved_document = mock_opensearch_client.index.call_args[1]["body"]
            self.assertEqual(saved_document["user_id"], "<unknown>")
            self.assertEqual(saved_document["user_org"], "")

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.get_history_client')
    @patch('shraga_common.logger.get_config_info')
    @patch('shraga_common.logger.get_platform_info')
    @patch('shraga_common.logger.get_user_agent_info')
    async def test_log_interaction_no_client_returns_false(
        self,
        mock_get_user_agent_info,
        mock_get_platform_info,
        mock_get_config_info,
        mock_get_history_client,
        mock_get_config
    ):
        """Test that log_interaction returns False when no history client is available."""
        # Simulate no history client available
        mock_get_history_client.return_value = (None, None)
        
        request = self.create_mock_request("test@example.com")
        context = {"text": "test message", "chat_id": "test_chat"}
        
        result = await log_interaction("user", request, context)
        
        self.assertFalse(result)
        # Ensure no indexing was attempted
        mock_get_config_info.assert_not_called()
        mock_get_platform_info.assert_not_called()

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.get_history_client')
    @patch('shraga_common.logger.get_config_info')
    @patch('shraga_common.logger.get_platform_info')
    @patch('shraga_common.logger.get_user_agent_info')
    async def test_log_interaction_handles_indexing_exception(
        self,
        mock_get_user_agent_info,
        mock_get_platform_info,
        mock_get_config_info,
        mock_get_history_client,
        mock_get_config
    ):
        """Test that log_interaction handles exceptions during indexing gracefully."""
        mock_opensearch_client = Mock()
        mock_opensearch_client.index.side_effect = Exception("Indexing failed")
        mock_get_history_client.return_value = (mock_opensearch_client, "test_index")
        mock_get_config.return_value = {"test": "config"}
        mock_get_config_info.return_value = {"config": "test"}
        mock_get_platform_info.return_value = {"platform": "test"}
        mock_get_user_agent_info.return_value = {"user_agent": "test"}
        
        request = self.create_mock_request("test@example.com")
        context = {"text": "test message", "chat_id": "test_chat"}
        
        with patch('shraga_common.app.services.history_service.logger') as mock_logger:
            result = await log_interaction("user", request, context)
            
            self.assertFalse(result)
            mock_logger.exception.assert_called_once()

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.log_interaction')
    async def test_log_system_message_history_disabled(
        self,
        mock_log_interaction,
        mock_get_config
    ):
        """Test that log_system_message returns False when history is disabled."""
        mock_get_config.return_value = False  # history.enabled = False
        
        request = self.create_mock_request("test@example.com")
        request_body = Mock()
        request_body.msg_id = "msg_123"
        request_body.chat_id = "chat_123"
        request_body.flow_id = "flow_123"
        request_body.position = 1
        request_body.preferences = {}
        
        response = Mock()
        response.response_text = "System response"
        response.stats = []
        response.payload = {}
        response.retrieval_results = []
        response.trace = []
        
        result = await log_system_message(request, request_body, response)
        
        self.assertFalse(result)
        mock_log_interaction.assert_not_called()

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.log_interaction')
    async def test_log_system_message_cleans_retrieval_results(
        self,
        mock_log_interaction,
        mock_get_config
    ):
        """Test that log_system_message cleans extra data from retrieval results."""
        mock_get_config.return_value = True  # history.enabled = True
        mock_log_interaction.return_value = True
        
        request = self.create_mock_request("test@example.com")
        request_body = Mock()
        request_body.msg_id = "msg_123"
        request_body.chat_id = "chat_123"
        request_body.flow_id = "flow_123"
        request_body.position = 1
        request_body.preferences = {"theme": "dark"}
        
        # Create mock retrieval results with extra data
        retrieval_result1 = Mock()
        retrieval_result1.extra = {"sensitive": "data"}
        retrieval_result2 = Mock()
        retrieval_result2.extra = {"more": "sensitive_data"}
        
        response = Mock()
        response.response_text = "System response"
        response.stats = [{"metric": "value"}]
        response.payload = {"key": "value"}
        response.retrieval_results = [retrieval_result1, retrieval_result2]
        response.trace = ["trace1", "trace2"]
        
        result = await log_system_message(request, request_body, response)
        
        self.assertTrue(result)
        
        # Verify extra data was cleaned
        self.assertEqual(retrieval_result1.extra, {})
        self.assertEqual(retrieval_result2.extra, {})
        
        # Verify log_interaction was called with correct parameters
        mock_log_interaction.assert_called_once_with(
            "system",
            request,
            {
                "msg_id": "msg_123",
                "chat_id": "chat_123",
                "flow_id": "flow_123",
                "text": "System response",
                "position": 2,  # position + 1
                "preferences": {"theme": "dark"},
                "stats": [{"metric": "value"}],
                "payload": {"key": "value"},
                "retrieval_results": [retrieval_result1, retrieval_result2],
                "trace": ["trace1", "trace2"],
            },
        )

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.log_interaction')
    async def test_log_system_message_handles_none_response(
        self,
        mock_log_interaction,
        mock_get_config
    ):
        """Test that log_system_message handles None response gracefully."""
        mock_get_config.return_value = True  # history.enabled = True
        mock_log_interaction.return_value = True
        
        request = self.create_mock_request("test@example.com")
        request_body = Mock()
        request_body.msg_id = "msg_123"
        request_body.chat_id = "chat_123"
        request_body.flow_id = "flow_123"
        request_body.position = 5
        request_body.preferences = {}
        
        result = await log_system_message(request, request_body, None)
        
        self.assertTrue(result)
        
        # Verify log_interaction was called with default values for None response
        mock_log_interaction.assert_called_once_with(
            "system",
            request,
            {
                "msg_id": "msg_123",
                "chat_id": "chat_123",
                "flow_id": "flow_123",
                "text": "",
                "position": 6,  # position + 1
                "preferences": {},
                "stats": None,
                "payload": None,
                "retrieval_results": None,
                "trace": None,
            },
        )

    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.log_interaction')
    async def test_log_system_message_handles_none_position(
        self,
        mock_log_interaction,
        mock_get_config
    ):
        """Test that log_system_message handles None position in request_body."""
        mock_get_config.return_value = True  # history.enabled = True
        mock_log_interaction.return_value = True
        
        request = self.create_mock_request("test@example.com")
        request_body = Mock()
        request_body.msg_id = "msg_123"
        request_body.chat_id = "chat_123"
        request_body.flow_id = "flow_123"
        request_body.position = None  # None position
        request_body.preferences = {}
        
        response = Mock()
        response.response_text = "System response"
        response.stats = []
        response.payload = {}
        response.retrieval_results = None
        response.trace = []
        
        result = await log_system_message(request, request_body, response)
        
        self.assertTrue(result)
        
        # Verify position calculation handles None
        mock_log_interaction.assert_called_once()
        call_args = mock_log_interaction.call_args[0][2]  # Get the context dict
        self.assertEqual(call_args["position"], 1)  # (None or 0) + 1 = 1


if __name__ == '__main__':
    unittest.main()