from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def process_request(prompt: str, role: str) -> dict:
    """
    Process a request to OpenAI's GPT-3.5 model with a given prompt and role. 
    """
    messages = [
        {"role": "system", "content": role},
        {"role": "user", "content": prompt}
    ]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7
    )

    content = response.choices[0].message.content
    return parse_json_response(content)

def parse_json_response(raw: str) -> dict:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError("Failed to parse JSON from OpenAI response")
