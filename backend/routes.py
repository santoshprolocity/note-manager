from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from auth import signup, login, decode_token
from models import (
    create_note,
    get_notes_by_user,
    get_note_by_id,
    update_note,
    delete_note,
)
import jwt

router = APIRouter()

QUOTES = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "In the middle of every difficulty lies opportunity. – Albert Einstein",
    "It does not matter how slowly you go as long as you do not stop. – Confucius",
    "Life is what happens when you're busy making other plans. – John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
]

import random


# ---------- Auth schemas ----------

class SignupRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


# ---------- Note schemas (Bug #9: no field length/type validators) ----------

class NoteCreate(BaseModel):
    title: str
    content: str   # BUG #9: No max_length, no validation — accepts unlimited input.


class NoteUpdate(BaseModel):
    title: str
    content: str


# ---------- Token helper ----------

def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = authorization.split(" ")[1]
    try:
        # BUG #4: options={"verify_exp": False} means expired tokens are always accepted.
        payload = jwt.decode(
            token,
            "secret",
            algorithms=["HS256"],
            options={"verify_exp": False},
        )
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Routes ----------

@router.get("/quote")
def get_quote():
    return {"quote": random.choice(QUOTES)}


@router.post("/signup")
def do_signup(body: SignupRequest):
    result = signup(body.username, body.password)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


# BUG #10: No rate limiting — unlimited login attempts enable brute-force attacks.
@router.post("/login")
def do_login(body: LoginRequest):
    result = login(body.username, body.password)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result


@router.get("/notes")
def list_notes(authorization: str = Header(...)):
    payload = verify_token(authorization)
    notes = get_notes_by_user(payload["user_id"])
    return {"notes": notes}


@router.post("/notes")
def add_note(body: NoteCreate, authorization: str = Header(...)):
    payload = verify_token(authorization)
    note_id = create_note(payload["user_id"], body.title, body.content)
    return {"message": "Note created", "note_id": note_id}


@router.get("/notes/{note_id}")
def get_note(note_id: int, authorization: str = Header(...)):
    verify_token(authorization)
    note = get_note_by_id(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/notes/{note_id}")
def edit_note(note_id: int, body: NoteUpdate, authorization: str = Header(...)):
    verify_token(authorization)
    update_note(note_id, body.title, body.content)
    return {"message": "Note updated"}


@router.delete("/notes/{note_id}")
def remove_note(note_id: int, authorization: str = Header(...)):
    verify_token(authorization)
    delete_note(note_id)
    return {"message": "Note deleted"}
