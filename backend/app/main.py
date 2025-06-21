'''
uvicorn app.main:app --reload
'''
from fastapi import FastAPI, Depends, UploadFile
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from supabase import create_client
from dotenv import load_dotenv
import os
from app.models import User, Questions, Answers
from dockerContainer import run_user_code

app = FastAPI()

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
def test_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT version();"))
    version = result.fetchone()
    return {"PostgreSQL Version": version[0]}

@app.get("/getQuestions")
def get_problems():
    questions = session.query(Questions).all()
    return {"question_id": [question.question_id for question in questions], "question": [get_problem(question.storage_id) for question in questions]}

@app.get("/getQuestionsDescription")
def get_problems():
    questions = session.query(Questions).all()
    return {"question_id": [question.question_id for question in questions], "description": [question.description for question in questions]}

@app.get("/getProblemId/{question_id}/getUser{username}")
def get_problem_id(question_id: int, username: str):
    answers = session.query(Answers).filter(Answers.username == username, Answers.question_id == question_id).first()
    
    answer = [x for x in answers]

    if len(answer) == 0:
        return {
        "submission": False,
        "question_id": None,
        "description": None,
        "tags": None,
        "storage_id": None,
        "difficulty": None,
        "test_cases": None
    }
    
    return {
        "submission": True,
        "question_id": answer[0].question_id,
        "code": answer[0].code,
        "total_cases": answer[0].total_cases,
        "passed_cases": answer[0].passed_cases,
        "passed": answer[0].passed
    }

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