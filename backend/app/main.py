'''
uvicorn app.main:app --reload
'''
from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
import uvicorn

app = FastAPI()

from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
from app.models import User, Questions, Answers


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
    return {"question_id": [question.question_id for question in questions], "question": [question.question for question in questions]}

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