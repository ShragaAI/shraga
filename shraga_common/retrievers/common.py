from typing import Optional, TypedDict


class RetrieverConfig(TypedDict):
    type: str
    auth_method: str
    host: str
    index: str
    port: Optional[int]
    user: Optional[str]
    password: Optional[str]
    use_ssl: Optional[bool]
    verify_certs: Optional[bool]
    use_cloud_id: Optional[bool]
