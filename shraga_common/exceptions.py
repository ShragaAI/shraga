class RequestCancelledException(Exception):
    pass

class LLMServiceUnavailableException(Exception):
    def __init__(self, msg, orig_exception = None):
        extra_info = ""
        if orig_exception:
            exception_type = type(orig_exception).__name__
            exception_message = str(orig_exception)
            extra_info = ",".join([m for m in [exception_type, exception_message] if m])
            extra_info = f"({extra_info})"
        full_message = f"{msg} {extra_info}".strip()
        super().__init__(full_message)
