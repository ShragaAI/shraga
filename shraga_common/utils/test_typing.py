import unittest

from shraga_common.utils.typing import safe_to_int


class TestSafeToInt(unittest.TestCase):
    
    def test_safe_to_int_valid_inputs(self):
        """Test safe_to_int with valid inputs that should convert successfully"""
        test_cases = [
            (42, 42),                 # Integer stays the same
            (3.14, 3),                # Rounds floats
            ("42", 42),               # String of digits
            ("-42", -42),             # Negative number as string
            (42.0, 42),               # Float without decimal part
            (True, 1),                # Boolean True converts to 1
            (False, 0),               # Boolean False converts to 0
        ]
        
        for input_val, expected_result in test_cases:
            with self.subTest(input_val=input_val, expected_result=expected_result):
                self.assertEqual(safe_to_int(input_val), expected_result)
    
    def test_safe_to_int_none_input(self):
        """Test safe_to_int with None input"""
        self.assertIsNone(safe_to_int(None))
    
    def test_safe_to_int_invalid_inputs(self):
        """Test safe_to_int with inputs that cannot be converted to int"""
        invalid_inputs = [
            "not_a_number",           # Non-numeric string
            "42abc",                  # Mixed string
            "3.14",                   # Float string
            [],                       # Empty list
            {},                       # Empty dict
            object(),                 # Generic object
            "",                       # Empty string
        ]
        
        for input_val in invalid_inputs:
            with self.subTest(input_val=input_val):
                self.assertIsNone(safe_to_int(input_val))


if __name__ == '__main__':
    unittest.main()
