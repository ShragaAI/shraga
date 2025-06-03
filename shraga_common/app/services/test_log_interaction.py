import unittest
from unittest.mock import Mock, patch

from shraga_common.app.services.history_service import log_interaction

class TestLogInteraction(unittest.IsolatedAsyncioTestCase):

    def create_mock_request(self, user_id: str):
        request = Mock()
        if user_id != "<unknown>":
            request.user = Mock()
            request.user.display_name = user_id
        else:
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
        
        request = Mock(spec=['headers'])
        request.headers = {"user-agent": "test-agent"}
        
        result = await log_interaction("user", request, {"text": "test", "chat_id": "test_chat", "flow_id": "test_flow"})
        
        self.assertTrue(result)
        
        saved_document = mock_opensearch_client.index.call_args[1]["body"]
        self.assertEqual(saved_document["user_org"], "")


if __name__ == '__main__':
    unittest.main()