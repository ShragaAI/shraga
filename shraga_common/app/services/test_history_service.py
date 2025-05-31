import pytest
from unittest.mock import Mock, patch

from shraga_common.app.services.history_service import extract_user_org, log_interaction


class TestExtractUserOrg:
    
    @pytest.mark.parametrize("user_id,expected_org", [
        ("alice@techcorp.com", "techcorp.com"),
        ("user@gmail.com", ""),
        ("username123", ""),
        ("", ""),
        (None, ""),
    ])
    def test_extract_user_org(self, user_id, expected_org):
        assert extract_user_org(user_id) == expected_org

    def test_case_insensitive_common_domains(self):
        assert extract_user_org("user@GMAIL.COM") == ""
        assert extract_user_org("user@Gmail.Com") == ""
        assert extract_user_org("user@YAHOO.COM") == ""


class TestLogInteraction:

    def create_mock_request(self, user_id: str):
        request = Mock()
        if user_id != "<unknown>":
            request.user = Mock()
            request.user.display_name = user_id
        else:
            pass
        request.headers = {"user-agent": "test-agent"}
        return request

    @pytest.mark.asyncio
    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.get_history_client')
    @patch('shraga_common.logging.get_config_info')
    @patch('shraga_common.logging.get_platform_info')
    @patch('shraga_common.logging.get_user_agent_info')
    @pytest.mark.parametrize("user_id,expected_org", [
        ("alice@techcorp.com", "techcorp.com"),
        ("user@gmail.com", ""),
        ("username123", ""),
    ])
    async def test_user_org_added_to_log_document(
        self, 
        mock_get_user_agent_info,
        mock_get_platform_info,
        mock_get_config_info,
        mock_get_history_client, 
        mock_get_config,
        user_id, 
        expected_org
    ):
        
        mock_opensearch_client = Mock()
        mock_get_history_client.return_value = (mock_opensearch_client, "test_index")
        mock_get_config.return_value = {"test": "config"}
        mock_get_config_info.return_value = {"config": "test"}
        mock_get_platform_info.return_value = {"platform": "test"}
        mock_get_user_agent_info.return_value = {"user_agent": "test"}
        
        request = self.create_mock_request(user_id)
        context = {"text": "test message", "chat_id": "test_chat", "flow_id": "test_flow"}
        
        result = await log_interaction("user", request, context)
        
        assert result is True
        
        mock_opensearch_client.index.assert_called_once()
        
        call_args = mock_opensearch_client.index.call_args
        assert call_args[1]["index"] == "test_index"
        
        saved_document = call_args[1]["body"]
        assert saved_document["user_org"] == expected_org
        assert saved_document["text"] == "test message"

    @pytest.mark.asyncio
    @patch('shraga_common.app.services.history_service.get_config')
    @patch('shraga_common.app.services.history_service.get_history_client')
    @patch('shraga_common.logging.get_config_info')
    @patch('shraga_common.logging.get_platform_info')
    @patch('shraga_common.logging.get_user_agent_info')
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
        
        assert result is True
        
        saved_document = mock_opensearch_client.index.call_args[1]["body"]
        assert saved_document["user_org"] == ""
