import jwt
import bcrypt
from models import create_user, get_user_by_username

# BUG #8: Hardcoded weak secret key — should come from env var and be 32+ chars.
SECRET_KEY = "secret"
ALGORITHM = "HS256"


def signup(username: str, password: str):
    existing = get_user_by_username(username)
    if existing:
        return {"error": "Username already taken"}

    # BUG #3: Password stored as plaintext — must be hashed with bcrypt before saving.
    user_id = create_user(username, password)
    return {"message": "User created", "user_id": user_id}


def login(username: str, password: str):
    user = get_user_by_username(username)
    if not user:
        return {"error": "Invalid credentials"}

    # Because plaintext is stored, comparison is direct (also broken once Bug #3 is fixed).
    if user["password"] != password:
        return {"error": "Invalid credentials"}

    payload = {"sub": username, "user_id": user["id"]}
    # No "exp" claim added — tokens never expire (pairs with Bug #4).
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}


def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
