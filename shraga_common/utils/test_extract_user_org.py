import unittest

from shraga_common.utils import extract_user_org


class TestExtractUserOrg(unittest.TestCase):
    
    def test_extract_user_org(self):
        """Test extract_user_org with different user_id formats"""
        test_cases = [
            ("alice@techcorp.com", "techcorp.com"),
            ("user@gmail.com", ""),
            ("username123", ""),
            ("", ""),
            (None, ""),
        ]
        
        for user_id, expected_org in test_cases:
            with self.subTest(user_id=user_id, expected_org=expected_org):
                self.assertEqual(extract_user_org(user_id), expected_org)

    def test_case_insensitive_common_domains(self):
        """Test that common domains are case insensitive"""
        self.assertEqual(extract_user_org("user@GMAIL.COM"), "")
        self.assertEqual(extract_user_org("user@Gmail.Com"), "")
        self.assertEqual(extract_user_org("user@YAHOO.COM"), "")


if __name__ == '__main__':
    unittest.main()