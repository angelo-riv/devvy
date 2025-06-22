'''
uvicorn app.main:app --reload
'''
from fastapi import FastAPI, Depends, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from supabase import create_client
from dotenv import load_dotenv
import os
from app.models import User, Questions, Answers
from .dockerContainer import run_user_code
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
url=os.getenv("SUPABASE_URL")
key=os.getenv("SUPABASE_KEY")
bucket=os.getenv("SUPABASE_BUCKET")

supabase = create_client(url, key)

Base.metadata.create_all(bind=engine)
session = SessionLocal()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/")
def root():
    return {"message": "Hello world"}

@app.get("/getQuestions")
def get_problems():
    questions = session.query(Questions).all()
    return {"question_id": [question.question_id for question in questions], "question": [get_problem(question.storage_id) for question in questions]}

@app.get("/questions/count")
def count_questions():
    count = session.query(Questions).count()
    return {"count": count}

@app.get("/getQuestionsDescription")
def get_problems():
    questions = session.query(Questions).all()
    return {"question_id": [question.question_id for question in questions], "description": [question.description for question in questions]}

@app.post("/getProblemDescription/{question_id}")
def problem_description(question_id: int):
    question = session.query(Questions).filter(Questions.question_id == question_id).first()
    
    if not question:
        return {"error": "Question not found"}

    return {
        "question_id": question.question_id,
        "description": question.description
    }

@app.get("/getProblemId/{question_id}/getUser{username}")
def get_problem_id(question_id: int, username: str):
    answers = session.query(Answers).filter(Answers.username == username, Answers.question_id == question_id).first()
    
    answer = [x for x in answers]

    if len(answer) == 0:
        return {
        "submission": False,
        "code": None,
        "total_cases": None,
        "passed_cases": None,
        "passed": None,
        "error": None
    }

    encoded_code = base64.b64encode(answers.code).decode('utf-8')
    
    return {
        "submission": True,
        "code": encoded_code,
        "total_cases": answer[0].total_cases,
        "passed_cases": answer[0].passed_cases,
        "passed": answer[0].passed
    }

'''
dumping this here for the frontend to see how to convert the code byte back into a zip file 

async function fetchAndUnzipCode(questionId, username) {
  const res = await fetch(`/getProblemId/${questionId}/getUser${username}`);
  const data = await res.json();

  if (!data.submission) {
    console.log("No submission found");
    return;
  }

  const base64String = data.code_zip_base64;
  const binaryString = atob(base64String); // decode base64 to binary string
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Now bytes contains the zip file data as Uint8Array
  // Use JSZip or similar to unzip and read files from bytes

  const jszip = new JSZip();
  const zip = await jszip.loadAsync(bytes);
  for (const filename of Object.keys(zip.files)) {
    const content = await zip.files[filename].async("string");
    console.log(`File: ${filename}`, content);
  }
}



'''

@app.post("/problem-code/{folder}")
async def get_problem(folder: str):
    files, folders = get_all_items_recursively(folder)

    return {
        "files": [
            supabase.storage.from_(bucket).get_public_url(path)
            for path in files
        ],
        "folders": folders
    }

def get_all_items_recursively(folder: str):
    """
    Helper function to recursively get all files and folders in a given folder in Supabase storage
    """
    files = []
    folders = []

    def recurse(current_folder):
        items = supabase.storage.from_(bucket).list(current_folder)

        if not items or not isinstance(items, list):
            return

        for item in items:
            name = item.get("name")
            full_path = f"{current_folder}/{name}"

            if "metadata" in item:  # This is a file
                files.append(full_path)
            else:  # This is a subfolder
                folders.append(full_path)
                recurse(full_path)  # Recurse into the subfolder

    recurse(folder)
    return files, folders


@app.post("/submit")
async def submit_answer(
    code: UploadFile,
    username: str,
    question_id: int,
):
    zip_bytes = await code.read()

    answers = session.query(Answers).filter(Answers.username == username, Answers.question_id == question_id).first()
    answer = [x for x in answers]

    results = await run_user_code(zip_bytes)

    if results[0] == 0: 
        passed_cases = results[1].count("True")
        total_cases = results[1].count("True") + results[1].count("False")
        passed = passed_cases == total_cases
        error = ""

    else:
        passed_cases = 0
        total_cases = 0
        error = results[1]
        passed = False

    if len(answer) == 0:
        
        new_answer = Answers(
        username=username,
        question_id=question_id,
        code=zip_bytes,  # bytes for LargeBinary
        passed_cases=5,
        total_cases=5,
        passed=True,
        error=error
        )

        session.add(new_answer)

    else:
        answerSelected = answer[0].answer_id

        answerSelected.code = zip_bytes  # update with new code
        answerSelected.passed_cases = passed_cases  
        answerSelected.total_cases = total_cases
        answerSelected.passed = passed
        answerSelected.error = error
        
    session.commit()

    return {
        "passed_cases": passed_cases,
        "total_cases": total_cases,
        "passed": passed,
        "hasError": error != "",
        "error": error
    }