from typing import Optional, Literal
from pydantic import BaseModel
class RetrieverConfig(BaseModel):
    type: str
    host: str
    port: int = 9200
    index: Optional[str] = None
    auth_method: Optional[str] = None
    auth_type: Optional[Literal["basic", "apikey"]] = "basic"
    user: Optional[str] = None
    password: Optional[str] = None
    use_ssl: bool = True
    verify_certs: bool = False
    # Elasticsearch specific
    use_cloud_id: bool = False
    cloud_id: Optional[str] = None
    api_key: Optional[str] = None