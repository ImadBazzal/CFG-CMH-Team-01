import os
from typing import List, Optional
from pydantic import BaseModel
from fastapi import Query, HTTPException
from supabase import create_client, Client

# Data Model
class University(BaseModel):
    id: int
    name: str
    zip_code: str
    address: Optional[str] = None
    website: Optional[str] = None

# GEOLOCATION API CONFIGURATION FOR GOOGLE MAPS
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_universities(zip_code: str = Query(..., description="The zip code to search for universities")) -> List[University]:
    """
    Retrieve universities by zip code from Supabase.
    If no universities found, returns an empty list.
    """
    try:
        response = (
            supabase.table("universities")
            .select("*")
            .eq("zip_code", zip_code)
            .execute()
        )
        return [University(**univ) for univ in response.data]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching universities: {str(e)}"
        )