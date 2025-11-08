from fastapi import APIRouter, HTTPException
from app.database.supabase_client import supabase
from app.models.test_data import TestScoreUpdate

router = APIRouter()

@router.put("/tests/{test_id}/score")
def update_test_score(test_id: int, update_data: TestScoreUpdate):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        update_fields = {}
        if update_data.humanities is not None:
            update_fields["Humanities"] = update_data.humanities
        if update_data.american_government is not None:
            update_fields["American Government"] = update_data.american_government
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No scores provided to update")
        
        result = supabase.table("MS Sample SMALL").update(update_fields).eq("id", test_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Test record not found")
        
        return {"message": "Test scores updated successfully", "data": result.data[0]}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/tests/bulk-update")
def bulk_update_scores(updates: list[dict]):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        updated_records = []
        for update in updates:
            if "id" not in update:
                raise HTTPException(status_code=400, detail="Each update must have 'id'")
            
            update_fields = {}
            if "humanities" in update:
                update_fields["Humanities"] = update["humanities"]
            if "american_government" in update:
                update_fields["American Government"] = update["american_government"]
            
            if not update_fields:
                continue
            
            result = supabase.table("MS Sample SMALL").update(update_fields).eq("id", update["id"]).execute()
            
            if result.data:
                updated_records.extend(result.data)
        
        return {"message": f"Updated {len(updated_records)} records", "data": updated_records}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")