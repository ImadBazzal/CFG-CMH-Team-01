import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = None
if url and key:
    try:
        supabase = create_client(url, key)
        print("Supabase client created successfully!")
    except Exception as e:
        print(f"Failed to create Supabase client: {e}")
        supabase = None
else:
    print("Cannot create Supabase client: Missing URL or key")