import os
import csv
import json
from supabase import create_client
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET = os.getenv("SUPABASE_BUCKET")
GEMINI_API_KEY = os.getenv("GEMINI_KEY")


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-001")


def list_all_files_recursively(prefix):
    """
    Recursively lists all files in a Supabase storage bucket under the given prefix
    """
    files = []

    def recurse(path):
        items = supabase.storage.from_(BUCKET).list(path)
        if not items:
            return
        for item in items:
            name = item.get("name")
            full_path = f"{path}/{name}".strip("/")
            if item.get("metadata"):
                files.append(full_path)
            else:
                recurse(full_path)
    recurse(prefix)
    return files


def read_folder_content(folder):
    """
    Reads all relevant files in a given folder in Supabase storage and returns their content as a single string
    """
    files = list_all_files_recursively(folder)
    content = ""
    for file_path in files:
        filename = file_path.lower()
        if any(skip in filename for skip in ["dockerfile", "readme", "test"]):
            continue
        try:
            res = supabase.storage.from_(BUCKET).download(file_path)
            if res:
                content += f"\n\n# File: {file_path}\n{res.decode('utf-8')}"
        except Exception as e:
            print(f"  Failed to fetch {file_path}: {e}")
            continue
    return content.strip()

def analyze_with_gemini(content):
    """
    Uses Google Gemini to analyze the provided code content and extract metadata for a coding question
    """
    prompt = f"""
You are an AI that reads code and generates metadata for a coding question.

Given the following code files, extract:
- A clear problem name (title)
- A short and helpful problem description
- Tags (frameworks, libraries, or languages used)
- A difficulty level (easy, medium, or hard)

**IGNORE ALL DOCKERFILES, README FILES, AND TEST CASES.**

Return the result as JSON in this format:
{{
  "question": "...",
  "description": "...",
  "tags": ["..."],
  "diff": "easy|medium|hard"
}}

Code:
{content}
"""
    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()
        if raw.startswith("```json"):
            raw = raw.removeprefix("```json").strip()
        if raw.endswith("```"):
            raw = raw.removesuffix("```").strip()
        return json.loads(raw)
    except Exception as e:
        print("Gemini parsing error:", e)
        print("--- Raw Gemini output ---")
        print(response.text if 'response' in locals() else "No response")
        print("--------------------------")
        return None

def get_top_level_folders():
    items = supabase.storage.from_(BUCKET).list("", {"recursive": True})
    folder_set = set()
    for item in items:
        name = item.get("name", "")
        if "/" in name:
            folder_set.add(name.split("/")[0])
        elif name.isdigit():
            folder_set.add(name)
    return sorted(folder_set)

def generate_csv_output():
    output_rows = []
    folders = get_top_level_folders()
    print(f"Found {len(folders)} folders: {folders}")

    for folder in folders:
        print(f"\n---\nProcessing folder: {folder}")
        try:
            question_id = int(folder)
        except ValueError:
            print(f"  Skipping: folder '{folder}' is not a valid integer.")
            continue

        content = read_folder_content(folder)
        if not content:
            print("  No content found.")
            continue

        print("  Sending to Gemini...")
        analysis = analyze_with_gemini(content)
        if not analysis:
            print("  Skipping due to Gemini error.")
            continue

        output_rows.append({
            "question_id": question_id,
            "question": analysis.get("question", "Untitled"),
            "description": analysis.get("description", ""),
            "tags": json.dumps(analysis.get("tags", [])),
            "storage_id": folder,
            "diff": analysis.get("diff", "medium")
        })
        print(f"  ✅ Added: {analysis.get('question')}")

    with open("questions.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["question_id", "question", "description", "tags", "storage_id", "diff"])
        writer.writeheader()
        writer.writerows(output_rows)

    print("\n✅ CSV file 'questions.csv' written successfully.")


generate_csv_output()