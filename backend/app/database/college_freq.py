from supabase_client import supabase

def find_top_colleges(course_column: str):

    if supabase is None:
        raise RuntimeError("Supabase client not initialized. Check SUPABASE_URL and SUPABASE_KEY.")

    response = supabase.table("ms_sample_small").select(f"school_name, {course_column}").execute()
    # quick check for client error
    if getattr(response, "error", None):
        raise RuntimeError(f"Supabase error: {getattr(response, 'error')}")

    data = response.data

    
    if not data:
        diag = supabase.table("ms_sample_small").select("school_name").limit(1).execute()
        if getattr(diag, "error", None) or not getattr(diag, "data", None):
            raise RuntimeError("No data returned from table; table may be empty or access denied")

    college_map = {}

    for row in data:
        score = row.get(course_column)
        if score is not None:
            college_map[row["school_name"]] = score

    #run through the map in reverse to get top colleges
    sorted_colleges = sorted(college_map.items(), key=lambda x: x[1], reverse=True)

    #tester 
    print(f"Most'{course_column}':")
    for name, score in sorted_colleges:
        print(f"{name}: {score}")

    return sorted_colleges

