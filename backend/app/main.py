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
    return {"tags": [question.tags for question in questions], "question_id": [question.question_id for question in questions], "question": [question.question for question in questions], "description": [question.description for question in questions],"diff": [question.diff for question in questions]}

@app.post("/getUserData/{username}")
def get_user_data(username: str):
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
def problem_description(question_id: int):
    question = session.query(Questions).filter(Questions.question_id == question_id).first()
    
    if not question:
        return {"error": "Question not found"}

    return {
        "question_id": question.question_id,
        "question": question.question,
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
    """
    Gets all files (regardless of extension) in the specified folder from Supabase storage.
    """
    response = supabase.storage.from_(bucket).list(folder)

    # Handle folder not found or empty
    if not response or not isinstance(response, list):
        return "Folder not found"

    # Return public URLs for all files in the folder (excluding subfolders)
    return {"files":[
        supabase.storage.from_(bucket).get_public_url(f"{folder}/{file['name']}")
        for file in response
        if "name" in file
        ]
    }


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