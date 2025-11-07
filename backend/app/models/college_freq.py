from supabase_client import supabase

def find_top_colleges(course_column: str):

    response = supabase.table("ms_sample_small").select(f"school_name, {course_column}").execute()
    data = response.data

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

