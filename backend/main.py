import os
import requests
from fastapi import FastAPI, Query, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes, update_routes

load_dotenv()

app = FastAPI()

# MapBox only takes in long and lag so taking zip code from database
# and converting to long and lat so Mapbox can read correctly
def get_coordinates_from_zip(zip_code: str):
    """
    Uses Mapbox Geocoding API to convert ZIP code → (latitude, longitude)
    """
    MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")
    if not MAPBOX_TOKEN:
        raise HTTPException(status_code=500, detail="Mapbox token missing")

    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{zip_code}.json"
    params = {"access_token": MAPBOX_TOKEN, "limit": 1, "country": "US"}

    response = requests.get(url, params=params)
    data = response.json()

    if not data["features"]:
        raise HTTPException(status_code=404, detail="Invalid ZIP code or no results found")

    lon, lat = data["features"][0]["center"]
    return {"latitude": lat, "longitude": lon}

@app.get("/api/coordinates")
def get_coordinates(zip: str = Query(...)):
    return get_coordinates_from_zip(zip)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api")
app.include_router(update_routes.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)