import json
import re
from typing import Tuple, Optional

from langchain_core.output_parsers import JsonOutputParser, StrOutputParser


def extract_xml_section(tag_name: str, text: str) -> Tuple[Optional[str], str]:
    pattern = re.compile(f"<{tag_name}>(.*?)</{tag_name}>", re.DOTALL)
    match = pattern.search(text)
    if match:
        extracted_text = match.group(1).strip()
        rest_of_text = text.replace(match.group(0), "").strip()
        return extracted_text, rest_of_text
    return None, text


class BasicParser:
    def parse(self, result) -> dict:
        return json.loads(result)


class BedrockParser(BasicParser):
    def __init__(self, format_class=None):
        self.format_class = format_class
        self.json_parser = JsonOutputParser(pydantic_object=format_class)
        self.str_parser = StrOutputParser()

    def parse(self, result) -> dict:
        if self.format_class is None:
            return super().parse(result)

        try:
            parsed_result = self.json_parser.parse(result)
        except Exception as e:
            print(e)
            parsed_result = self.str_parser.parse(result)
            parsed_result = json.loads(parsed_result.split("\n\n")[1])

        if set(self.format_class.schema(True).get("properties").keys()) != set(
            parsed_result.keys()
        ):
            raise Exception(
                "Result json is incorrect. It should be {0} but it's {1}.".format(
                    set(self.format_class.schema(True).get("properties").keys()),
                    set(parsed_result.keys()),
                )
            )

        return parsed_result

    def get_format_instructions(self):
        return self.json_parser.get_format_instructions()
