import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.googlemaps import get_universities, University

app = FastAPI(title="University Finder API")

# Configure CORS for frontend integration
origins = [
    "http://localhost:3000",  # React default port
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/universities", response_model=list[University])
async def get_universities_endpoint(zip_code: str):
    """Get universities by zip code"""
    return get_universities(zip_code)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)