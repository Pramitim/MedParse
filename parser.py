
import os
import json
import re
from dotenv import load_dotenv
from google import genai


load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def parse_note(note: str) -> dict:

    prompt = f"""
Extract structured medical information from this note.

Return ONLY raw JSON.
No markdown.
No backticks.
No explanations.

Format:
{{
  "name": string,
  "age": number,
  "gender": string,
  "symptom": string,
  "medication": string,
  "dosage": string
}}

If something is missing, use null.

Note:
{note}
"""

# gemini generates response according to the prompt 
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
    except Exception as e:
        print("API ERROR:", e)
        return {"error": "api_error", "message": str(e)}


# transforms response into proper JSON format

    text = response.text
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except Exception as e:
            return {"error": "bad_json", "raw": text}

    return {"error": "no_json_found", "raw": text}

    
def compute_quality_score(data: dict) -> int:
    score = 0

    required_fields = ["name", "age", "gender", "symptom", "medication", "dosage"]

    # 1. completeness (60 points total)
    filled = sum(1 for f in required_fields if data.get(f))
    score += (filled / len(required_fields)) * 60

    # 2. age validity (10 points)
    if isinstance(data.get("age"), int) and 0 < data["age"] < 120:
        score += 10

    # 3. medication + dosage consistency (20 points)
    if data.get("medication") and data.get("dosage"):
        score += 20

    # 4. symptom present (10 points)
    if data.get("symptom"):
        score += 10

    return int(score)
