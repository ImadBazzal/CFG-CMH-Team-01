from fastapi import APIRouter, Query, HTTPException, Query, HTTPException
from typing import Optional
from app.database.supabase_client import supabase
from app.models.test_data import TestDataFilter

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Hello World"}

@router.get("/health")
def health_check():
    return {"status": "healthy"}

@router.get("/tests/search")
def search_tests(
    test_name: Optional[str] = Query(None, description="Search by test name"),
    min_score: Optional[float] = Query(None, description="Minimum test score"),
    max_score: Optional[float] = Query(None, description="Maximum test score"),
    location: Optional[str] = Query(None, description="Filter by location"),
    school: Optional[str] = Query(None, description="Filter by school")
):
    try:
        query = supabase.table("test_data").select("*")
        
        if test_name:
            query = query.ilike("test_name", f"%{test_name}%")
        
        if min_score is not None:
            query = query.gte("test_score", min_score)
        
        if max_score is not None:
            query = query.lte("test_score", max_score)
        
        if location:
            query = query.ilike("location", f"%{location}%")
        
        if school:
            query = query.ilike("school", f"%{school}%")
        
        result = query.execute()
        return {"data": result.data, "count": len(result.data)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tests/filter")
def filter_tests(filters: TestDataFilter):
    try:
        query = supabase.table("test_data").select("*")
        
        if filters.test_name:
            query = query.ilike("test_name", f"%{filters.test_name}%")
        
        if filters.min_score is not None:
            query = query.gte("test_score", filters.min_score)
        
        if filters.max_score is not None:
            query = query.lte("test_score", filters.max_score)
        
        if filters.location:
            query = query.ilike("location", f"%{filters.location}%")
        
        if filters.school:
            query = query.ilike("school", f"%{filters.school}%")
        
        result = query.execute()
        return {"data": result.data, "count": len(result.data)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))