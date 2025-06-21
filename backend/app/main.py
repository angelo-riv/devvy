'''
uvicorn app.main:app --reload
'''
from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from supabase import create_client
from dotenv import load_dotenv
import os
from app.models import User, Questions, Answers

app = FastAPI()

load_dotenv()
url=os.getenv("SUPABASE_URL")
key=os.getenv("SUPABASE_KEY")
bucket=os.getenv("SUPABASE_BUCKET")

supabase = create_client(url, key)

Base.metadata.create_all(bind=engine)


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



def get_problem(folder: str):
    """
    Gets the problem folder from Supabase storage.
    """
    response = supabase.storage.from_(bucket).list(folder)

    #Handle folder not found
    if not response:
        return "Folder not found"
    
    return [
        supabase.storage.from_(bucket).get_public_url(f"{folder}/{file['name']}")
        for file in response if file.get("name")
    ]