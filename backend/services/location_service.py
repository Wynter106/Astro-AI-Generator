from geopy.geocoders import Nominatim

def resolve_location(region: str | None) -> tuple[float, float]:
    DEFAULT_COORDS = (40.7128, -74.0060)  # New York

    if not region or region.lower() == "unknown":
        return DEFAULT_COORDS

    geolocator = Nominatim(user_agent="astro-app")
    try:
        location = geolocator.geocode(region)
        if location:
            return location.latitude, location.longitude
    except Exception:
        pass

    return DEFAULT_COORDS
