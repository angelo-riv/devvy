from sqlalchemy import (
    Column, String, Integer, Boolean, Boolean, Text, LargeBinary,ForeignKey, UniqueConstraint, create_engine
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import ARRAY
import uuid

Base = declarative_base()

# --- USER MODEL ---
class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    solved_questions = Column(ARRAY(Integer), default=[])


# --- QUESTIONS MODEL ---
class Questions(Base):
    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, autoincrement=False)  # manually set
    question = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tags = Column(ARRAY(String), default=[])
    storage_id = Column(String, nullable=False)  # Supabase storage ref
    diff = Column(String, nullable=False)        # difficulty


# --- ANSWERS MODEL ---
class Answers(Base):
    __tablename__ = "answers"

    answer_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, ForeignKey("users.username"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.question_id"), nullable=False)
    code = Column(LargeBinary, nullable=False)
    passed_cases = Column(Integer, nullable=False)
    total_cases = Column(Integer, nullable=False)
    passed = Column(Boolean, nullable=False)
    error = Column(Text, nullable=True)  # Error message if any

    __table_args__ = (
        UniqueConstraint("answer_id", name="uq_answer_id"),
    )
