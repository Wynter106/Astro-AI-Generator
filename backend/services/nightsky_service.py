from services.location_service import resolve_location
from skyfield.api import Star, load, wgs84
from skyfield.data import hipparcos
from skyfield.projections import build_stereographic_projection
import matplotlib
from pytz import timezone, utc
matplotlib.use('Agg')
from datetime import datetime
import matplotlib.pyplot as plt
import io
import base64
from timezonefinder import TimezoneFinder
from matplotlib.patches import Circle


def generate_night_sky(data) -> str:
    ts = load.timescale()
    lat, lon = resolve_location(data.get("region"))
    year = data.get("year")
    month = data.get("month")
    day = data.get("day")
    hour = data.get("hour") or 0
    minute = data.get("minute") or 0

    tf = TimezoneFinder()
    tz_name = tf.timezone_at(lat=lat, lng=lon)
    local_zone = timezone(tz_name)
    local_dt = local_zone.localize(datetime(year, month, day, hour or 0, minute or 0))
    utc_dt = local_dt.astimezone(utc)

    eph = load('de421.bsp')
    with load.open(hipparcos.URL) as f:
        stars = hipparcos.load_dataframe(f)

    earth = eph['earth']
    ts = load.timescale()
    t = ts.from_datetime(utc_dt)
    observer = wgs84.latlon(lat, lon).at(t)

    ra, dec, _ = observer.radec()
    center_object = Star(ra=ra, dec=dec)
    center = earth.at(t).observe(center_object)
    projection = build_stereographic_projection(center)

    star_positions = earth.at(t).observe(Star.from_dataframe(stars))
    stars['x'], stars['y'] = projection(star_positions)

    # Step 4: Filter and scale stars
    limiting_magnitude = 6
    stars = stars[stars['magnitude'] <= limiting_magnitude]
    magnitude = stars['magnitude']
    marker_size = 20 * 10 ** (magnitude / -2.5)

    # Step 5: Plot sky map
    fig, ax = plt.subplots(figsize=(10, 10))
    border = plt.Circle((0, 0), 1, color='black', fill=True)
    ax.add_patch(border)

    ax.scatter(stars['x'], stars['y'], s=marker_size, color='white', marker='.', linewidths=0, zorder=2)
    
    # Clip outside of circle
    horizon = Circle((0, 0), radius=1, transform=ax.transData)
    for col in ax.collections:
        col.set_clip_path(horizon)

    ax.set_xlim(-1, 1)
    ax.set_ylim(-1, 1)
    plt.axis('off')

    # Step 6: Return base64 image
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', pad_inches=0, facecolor='black')
    plt.close()
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode('utf-8')
    return encoded