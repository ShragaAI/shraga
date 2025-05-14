from typing import Optional
from pydantic import BaseModel
class RetrieverConfig(BaseModel):
    type: str
    auth_method: str
    host: str
    index: str
    port: Optional[int] = None
    user: Optional[str] = None
    password: Optional[str] = None
    use_ssl: Optional[bool] = None
    verify_certs: Optional[bool] = None
    use_cloud_id: Optional[bool] = None