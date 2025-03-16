from typing import List


class DocHandler:
    async def handle_document(self, document: dict) -> List[dict]:
        return [document]
