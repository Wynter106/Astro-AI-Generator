from services.nightsky_service import generate_night_sky
from services.openai_service import process_request
from data.astrology_db import SessionLocal
import hashlib
import json
from services.location_service import resolve_location
from data.models import Insight, Fortune

def generate_astrology_response(data: dict, mode: str) -> dict:
    session = SessionLocal()
    user_hash = get_user_hash(data)
    response = get_stored_response(user_hash, session)
    if response:
        session.close()
        return response


    role = "You are an expert astrologer."
    insight_prompt = generate_astrology_prompt(data, mode="insight")
    insight_result = process_request(insight_prompt, role)

    fortune_prompt = generate_astrology_prompt(data, mode="fortune")
    fortune_result = process_request(fortune_prompt, role)

    image_path = generate_night_sky(data)

    new_insight = Insight(user_hash=user_hash, result_text=json.dumps(insight_result), image_path=image_path)
    new_fortune = Fortune(user_hash=user_hash, result_text=json.dumps(fortune_result))
    session.add(new_insight)
    session.add(new_fortune)
    session.commit()

    return {
        "insight": insight_result,
        "fortune": fortune_result,
        "image": image_path
    }

def get_stored_response(user_hash: str, session) -> dict:
    existing_insight = session.query(Insight).filter_by(user_hash=user_hash).first()
    existing_fortune = session.query(Fortune).filter_by(user_hash=user_hash).first()
    if existing_insight and existing_fortune:
        return {
            "insight": json.loads(existing_insight.result_text),
            "fortune": json.loads(existing_fortune.result_text),
            "image": existing_insight.image_path
        }
    return None


def get_user_hash(data:dict) -> str:
    lat, lon = resolve_location(data.get("region"))
    year = data.get("year")
    month = data.get("month")
    day = data.get("day")
    hour = data.get("hour", "unknown")
    minute = data.get("minute", "unknown")
    combined = f"{year}-{month}-{day}-{hour}-{minute}-{lat:.4f}-{lon:.4f}"
    return hashlib.sha256(combined.encode()).hexdigest()


def generate_fortune_prompt(birth_date:str, birth_time:str, location:str)->str:
     return (
            f"You are a skilled astrologer writing for an astrology app.\n"
            f"User birth info: {birth_date} {birth_time}, region: {location}.\n"
            "Only provide a JSON object structured like this:\n"
            "{"
            "\"dailyParagraph\": \"<2-3 sentence daily horoscope>\","
            "\"luckyItem\": \"<item>\","
            "\"love\": \"<love fortune>\","
            "\"money\": \"<money fortune>\","
            "\"health\": \"<health fortune>\""
            "}\n"
            "No extra text. Language should be warm and positive."
        )

def generate_insight_prompt(birth_date:str, birth_time:str, location:str)->str:
    return (
            f"You are a skilled astrologer writing for an astrology app.\n"
            f"User birth info: {birth_date} {birth_time}, region: {location}.\n"
            "Only provide a JSON object structured like this:\n"
            "{"
            "\"sign\": \"<sign>\","
            "\"paragraph\": \"<3-4 sentence personality>\","
            "\"strengths\": [\"<bullet>\", \"...\"],"
            "\"weaknesses\": [\"<bullet>\", \"...\"],"
            "\"compatibleSigns\": [{\"sign\":\"<sign>\", \"reason\":\"<reason>\"}, ...]"
            "}\n"
            "No extra text. Language should be warm and intuitive."
        )


def generate_astrology_prompt(data: dict, mode: str) -> str:
    year = data.get("year")
    month = data.get("month")
    day = data.get("day")
    birth_date = f"{year:04d}-{month:02d}-{day:02d}"

    hour = data.get("hour")
    minute = data.get("minute")
    if hour is not None and minute is not None:
        birth_time = f"{int(hour):02d}:{int(minute):02d}"
    else:
        birth_time = "unknown"

    location = data.get("region", "unknown")

    if mode == "insight":
        prompt = generate_insight_prompt(birth_date, birth_time, location)
    elif mode == "fortune":
        prompt = generate_fortune_prompt(birth_date, birth_time, location)
    else:
        raise ValueError("Invalid mode. Use 'insight' or 'fortune'.")
    return prompt
