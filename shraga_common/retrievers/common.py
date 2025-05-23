from typing import Optional, Literal
from pydantic import BaseModel
class RetrieverConfig(BaseModel):
    type: str
    host: str
    index: str
    port: int = 9200
    auth_method: Optional[str] = None
    auth_type: Optional[Literal["basic", "apikey"]] = "basic"
    user: Optional[str] = None
    password: Optional[str] = None
    use_ssl: bool = False
    verify_certs: bool = False
    use_cloud_id: bool = False