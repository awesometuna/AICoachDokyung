import os
import httpx
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

UPSTAGE_API_KEY = os.getenv("UPSTAGE_API_KEY")
UPSTAGE_PARSE_URL = "https://api.upstage.ai/v1/document-digitization"
UPSTAGE_CHAT_URL = "https://api.upstage.ai/v1/solar/chat/completions"

async def extract_tasks_from_text(text: str):
    """
    Uses Solar LLM to parse raw syllabus text into structured JSON.
    """
    system_prompt = """
    You are an academic assistant. Extract tasks (assignments, exams) from the syllabus text.
    Return ONLY a JSON object with a key 'tasks_extracted' containing a list of objects.
    Each object must have:
    - title: string
    - description: string
    - due_date: string (YYYY-MM-DD format). If only "Week 5" is given, approximate based on a semester starting March 2nd, 2026. If no date, use null.
    
    Example Output:
    {
      "tasks_extracted": [
        {"title": "Midterm", "description": "Chapter 1-5", "due_date": "2026-04-20"}
      ]
    }
    """
    
    headers = {
        "Authorization": f"Bearer {UPSTAGE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "solar-1-mini-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Extract tasks from this text:\n\n{text[:3000]}"} # Limit context
        ],
        "response_format": { "type": "json_object" }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(UPSTAGE_CHAT_URL, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            return json.loads(content)
        except Exception as e:
            print(f"❌ Solar LLM Extraction Error: {e}")
            return {"tasks_extracted": []}

async def parse_syllabus(file_content: bytes, filename: str):
    """
    1. Upload to Upstage Document Digitization.
    2. Get Raw Text (HTML/Text).
    3. Send Raw Text to Solar LLM for extraction.
    """
    if not UPSTAGE_API_KEY:
        print("⚠️ No UPSTAGE_API_KEY found.")
        return mock_parse_response(filename)

    headers = {"Authorization": f"Bearer {UPSTAGE_API_KEY}"}
    files = {"document": (filename, file_content)}
    data = {
        "model": "document-parse-260128",
        "ocr": "auto", 
        "chart_recognition": "true", # string true for httpx form data usually safe
        "coordinates": "true",
        "output_formats": '["html"]', # JSON string format
        "base64_encoding": '["figure"]'
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # 1. Document Parse (Digitization)
            # httpx.post(url, data=dict, files=files) handles multipart/form-data
            scan_res = await client.post(UPSTAGE_PARSE_URL, headers=headers, files=files, data=data, timeout=60.0)
            scan_res.raise_for_status()
            scan_data = scan_res.json()
            
            # 2. Extract Text (HTML is usually in .content.html, but let's check .content.text if available, or fallback to parsing html)
            # The simplified logic: just grab 'text' if available, or try to use 'html'.
            # Upstage response usually has 'content': { 'html': '...', 'markdown': '...' } depending on format.
            # We requested HTML.
            
            content_block = scan_data.get("content", {})
            raw_text = content_block.get("html", "") # Prefer HTML if requested
            
            if not raw_text:
                # Fallback to anything
                raw_text = str(content_block)

            if not raw_text:
                raw_text = "No text extracted."
            
            # 3. LLM Refinement
            extracted_json = await extract_tasks_from_text(raw_text)
            
            return {
                "status": "success",
                "filename": filename,
                "raw_text_snippet": raw_text[:100],
                "tasks_extracted": extracted_json.get("tasks_extracted", [])
            }

        except Exception as e:
            print(f"❌ Upstage Parse Error: {e}")
            return mock_parse_response(filename)

def mock_parse_response(filename: str):
    return {
        "status": "mock_success",
        "filename": filename,
        "tasks_extracted": [
             {"title": "Mock Task 1", "due_date": "2026-03-15", "description": "Mock Data"}
        ]
    }
