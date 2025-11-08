from supabase_client import supabase

def find_top_colleges(course_column: str, threshold: float = 0.0, k: int = None):
    if supabase is None:
        raise RuntimeError("Supabase client not initialized. Check SUPABASE_URL and SUPABASE_KEY.")

    response = supabase.table("MS Sample SMALL").select(f"School Name, {course_column}").execute()
    # quick check for client error
    if getattr(response, "error", None):
        raise RuntimeError(f"Supabase error: {getattr(response, 'error')}")

    data = response.data

    if not data:
        diag = supabase.table("MS Sample Small").select("School Name").limit(1).execute()
        if getattr(diag, "error", None) or not getattr(diag, "data", None):
            raise RuntimeError("No data returned from table; table may be empty or access denied")

    college_map = {}

    for row in data:
        score = row.get(course_column)
        # Skip if score is None or not convertible to float
        try:
            if score is not None:
                score_float = float(score)
                if score_float >= float(threshold):
                    college_map[row["School Name"]] = score_float
        except (ValueError, TypeError):
            continue  # Skip this entry if score can't be converted to float

    # run through the map in reverse to get top colleges
    sorted_colleges = sorted(college_map.items(), key=lambda x: x[1], reverse=True)

    # If k is specified, return only top k colleges
    if k is not None:
        sorted_colleges = sorted_colleges[:k]

    # #tester 
    # print(f"Top {k if k else 'all'} colleges for {course_column} (threshold: {threshold}):")
    # for name, score in sorted_colleges:
    #     print(f"{name}: {score}")

    return sorted_colleges


from supabase_client import supabase

if __name__ == "__main__":
    # Example: Find top 5 colleges requiring at least 70% in Humanities
    find_top_colleges("Humanities", threshold=70.0, k=5)



