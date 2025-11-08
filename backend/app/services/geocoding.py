import requests
import time
from typing import Optional, Tuple

def geocode_location(city: str, state: str) -> Optional[Tuple[float, float]]:
    """
    Geocode a city, state combination using Nominatim (free OpenStreetMap geocoding)
    Returns (latitude, longitude) or None if not found
    """
    try:
        # Format the query
        query = f"{city}, {state}, USA"
        
        # Use Nominatim API (free, no API key required)
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': query,
            'format': 'json',
            'limit': 1,
            'countrycodes': 'us'
        }
        
        headers = {
            'User-Agent': 'CLEP-School-Finder/1.0'
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data:
                lat = float(data[0]['lat'])
                lon = float(data[0]['lon'])
                return (lat, lon)
        
        return None
        
    except Exception as e:
        print(f"Geocoding error for {city}, {state}: {e}")
        return None

def add_rate_limit():
    """Add a small delay to respect Nominatim's usage policy"""
    time.sleep(1)