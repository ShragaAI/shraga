from typing import List

from bs4 import BeautifulSoup

from .chunkers import BasicChunker


class HtmlChunker(BasicChunker):
    def get_document_text(self, soup):
        return soup.get_text(" ")

    def get_soup(self, text) -> List[str]:
        return BeautifulSoup(text, "html.parser")
