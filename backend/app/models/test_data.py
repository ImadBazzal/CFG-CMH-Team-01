from pydantic import BaseModel
from typing import Optional

class TestDataFilter(BaseModel):
    test_name: Optional[str] = None
    min_score: Optional[float] = None
    max_score: Optional[float] = None
    location: Optional[str] = None
    school: Optional[str] = None