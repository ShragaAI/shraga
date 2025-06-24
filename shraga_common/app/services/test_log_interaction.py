import unittest
from unittest.mock import Mock, patch

from shraga_common.app.auth.user import ShragaUser
from shraga_common.app.services.history_service import log_interaction

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


if __name__ == '__main__':
    unittest.main()