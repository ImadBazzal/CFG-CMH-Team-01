from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.database.supabase_client import supabase
from app.models.test_data import TestDataFilter, TestScoreUpdate

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Hello World"}

@router.get("/health")
def health_check():
    try:
        if supabase:
            return {"status": "healthy", "database": "connected"}
        else:
            return {"status": "healthy", "database": "disconnected"}
    except Exception as e:
        return {"status": "healthy", "database": "error", "detail": str(e)}

@router.get("/tests/search")
def search_tests(
    school_name: Optional[str] = Query(None, description="Search by school name"),
    city: Optional[str] = Query(None, description="Filter by city"),
    state: Optional[str] = Query(None, description="Filter by state"),
    min_humanities: Optional[float] = Query(None, description="Minimum humanities score"),
    max_humanities: Optional[float] = Query(None, description="Maximum humanities score"),
    min_american_government: Optional[float] = Query(None, description="Minimum American Government score"),
    max_american_government: Optional[float] = Query(None, description="Maximum American Government score")
):
    try:
        query = supabase.table("MS Sample SMALL").select("*")
        
        if school_name:
            query = query.ilike("School Name", f"%{school_name}%")
        
        if city:
            query = query.ilike("City", f"%{city}%")
        
        if state:
            query = query.ilike("State", f"%{state}%")
        
        if min_humanities is not None:
            query = query.neq("Humanities", "NULL").gte("Humanities", str(min_humanities))
        
        if max_humanities is not None:
            query = query.neq("Humanities", "NULL").lte("Humanities", str(max_humanities))
        
        if min_american_government is not None:
            query = query.neq("American Government", "NULL").gte("American Government", str(min_american_government))
        
        if max_american_government is not None:
            query = query.neq("American Government", "NULL").lte("American Government", str(max_american_government))
        
        result = query.execute()
        return {"data": result.data, "count": len(result.data)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tests/filter")
def filter_tests(filters: TestDataFilter):
    try:
        query = supabase.table("MS Sample SMALL").select("*")
        
        if filters.school_name:
            query = query.ilike("School Name", f"%{filters.school_name}%")
        
        if filters.city:
            query = query.ilike("City", f"%{filters.city}%")
        
        if filters.state:
            query = query.ilike("State", f"%{filters.state}%")
        
        if filters.min_humanities is not None:
            query = query.neq("Humanities", "NULL").gte("Humanities", str(filters.min_humanities))
        
        if filters.max_humanities is not None:
            query = query.neq("Humanities", "NULL").lte("Humanities", str(filters.max_humanities))
        
        if filters.min_american_government is not None:
            query = query.neq("American Government", "NULL").gte("American Government", str(filters.min_american_government))
        
        if filters.max_american_government is not None:
            query = query.neq("American Government", "NULL").lte("American Government", str(filters.max_american_government))
        
        result = query.execute()
        return {"data": result.data, "count": len(result.data)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))