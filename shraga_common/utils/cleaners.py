class BasicCleaner:
    def clean(self, texts) -> list[list]:
        return [text.strip() for text in texts]


def normalize_url(url):
    """
    Normalizing url to the same format.

    Args:
        url (str): the url to normalize.

    Returns:
        Normalized url.
    """
    if url and url[-1] == "/":
        return url[:-1]
    return url
