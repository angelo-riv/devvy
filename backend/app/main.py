'''
uvicorn app.main:app --reload
'''
print("main.py started")
from fastapi import FastAPI, Depends, UploadFile, File, Form
print("fast api started")
from fastapi.middleware.cors import CORSMiddleware
print("fast api middleware started")
from sqlalchemy import text
print("sql alchemy started")
from sqlalchemy.orm import Session
print("sql alchemy.orm started")
from app.database import SessionLocal, Base, engine
print("database started")
from supabase import create_client
print("supabase started")
from dotenv import load_dotenv
print("dotenv started")
import os
print("os started")
from app.models import User, Questions, Answers
print("app.models started")
from .dockerContainer import run_user_code
print("docker started")
import base64
print("base64 started")
from collections import defaultdict


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://main.d1a6a4zadfzjnl.amplifyapp.com", "http://localhost:3000"],
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

try:
    session = SessionLocal()
    print("DB session successfully created")
except Exception as e:
    import logging
    logging.error("Failed to create DB session: %s", e)
    session = None

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
def get_problems(session = Depends(get_db)):
    questions = session.query(Questions).all()
    return {"question_id": [question.question_id for question in questions], "question": [get_problem(question.storage_id) for question in questions]}

@app.get("/questions/count")
def count_questions(session = Depends(get_db)):
    count = session.query(Questions).count()
    return {"count": count}

@app.get("/answercount")
def count_solutions(session = Depends(get_db)):
    count = session.query(Answers).count()
    return {"count": count}

@app.get("/usercount")
def count_users(session = Depends(get_db)):
    count = session.query(User).count()
    return {"count": count}

@app.get("/getQuestionsDescription")
def get_problems(session = Depends(get_db)):
    questions = session.query(Questions).all()
    return {"tags": [question.tags for question in questions], "question_id": [question.question_id for question in questions], "question": [question.question for question in questions], "description": [question.description for question in questions],"diff": [question.diff for question in questions]}

@app.post("/getUserData/{username}")
def get_user_data(username: str, session = Depends(get_db)):
    user = session.query(User).filter(User.username == username).first()
    
    if not user:
        return {"error": "User not found"}

    solved_questions = user.solved_questions if user.solved_questions else []

    return {
        "username": user.username,
        "email": user.email,
        "solved_questions": solved_questions,
        "user_id": user.user_id
    }

@app.post("/getProblemDescription/{question_id}")
def problem_description(question_id: int, session = Depends(get_db)):
    question = session.query(Questions).filter(Questions.question_id == question_id).first()
    
    if not question:
        return {"error": "Question not found"}

    return {
        "question_id": question.question_id,
        "question": question.question,
        "description": question.description,
        "diff": question.diff,
        "tags": question.tags
    }

@app.get("/getProblemId/{question_id}/getUser{username}")
def get_problem_id(question_id: int, username: str, session = Depends(get_db)):
    answer = session.query(Answers).filter(Answers.username == username, Answers.question_id == question_id).first()
    
    if not answer:
        return {
        "submission": False,
        "code": None,
        "total_cases": None,
        "passed_cases": None,
        "passed": None,
        "error": None
    }

    if answer.code is None:
        return {
            "submission": True,
            "code": None,
            "total_cases": answer.total_cases,
            "passed_cases": answer.passed_cases,
            "passed": answer.passed,
            "error": "No code submitted"
        }

    encoded_code = base64.b64encode(answer.code).decode('utf-8')
    
    return {
        "submission": True,
        "code": encoded_code,
        "total_cases": answer.total_cases,
        "passed_cases": answer.passed_cases,
        "passed": answer.passed
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
    files = []
    folders = []

    def recurse(current_folder: str):
        response = supabase.storage.from_(bucket).list(current_folder)
        if not response or not isinstance(response, list):
            return

        for item in response:
            if not isinstance(item, dict):
                continue

            name = item.get("name")
            if not name:
                continue

            full_path = f"{current_folder}/{name}" if current_folder else name

            if item.get("metadata") is not None:  # File
                files.append(full_path)
            else:  # Folder
                folders.append(full_path)
                recurse(full_path)

    recurse(folder)
    return files, folders


@app.post("/submit")
async def submit_answer(
    code: UploadFile = File(...),
    username: str = Form(...),
    question_id: int = Form(...),
    session = Depends(get_db)
):
    print("username", username)
    print("question_id:", question_id, type(question_id))
    zip_bytes = await code.read()

    print("zip_bytes length:", len(zip_bytes))

    answer = session.query(Answers).filter(
        Answers.username == username,
        Answers.question_id == question_id
    ).first()

    results = await run_user_code(zip_bytes)

    print(results)

    if results[0]["StatusCode"] == 0: 
        passed_cases = results[1].count("True")
        total_cases = passed_cases + results[1].count("False")
        passed = passed_cases == total_cases
        error = ""
    else:
        passed_cases = 0
        total_cases = 0
        error = results[1]
        passed = False

    if not answer:
        new_answer = Answers(
            username=username,
            question_id=question_id,
            code=zip_bytes,
            passed_cases=passed_cases,
            total_cases=total_cases,
            passed=passed,
            error=error
        )
        session.add(new_answer)
    else:
        answer.code = zip_bytes
        answer.passed_cases = passed_cases
        answer.total_cases = total_cases
        answer.passed = passed
        answer.error = error

    session.commit()

    return {
        "passed_cases": passed_cases,
        "total_cases": total_cases,
        "passed": passed,
        "hasError": error != "",
        "error": error
    }