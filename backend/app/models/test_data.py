from pydantic import BaseModel
from typing import Optional

class TestDataFilter(BaseModel):
    school_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    min_humanities: Optional[float] = None
    max_humanities: Optional[float] = None
    min_american_government: Optional[float] = None
    max_american_government: Optional[float] = None

class TestScoreUpdate(BaseModel):
    humanities: Optional[float] = None
    american_government: Optional[float] = None