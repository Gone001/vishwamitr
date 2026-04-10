from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from google.genai import Client
from dotenv import load_dotenv
import os

from config import get_settings
from supabase_client import get_supabase


# -------------------- LOAD ENV --------------------
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# -------------------- INIT APP --------------------
app = FastAPI()

# -------------------- CORS --------------------
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,   # ✅ correct
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- GEMINI SETUP --------------------
if api_key:
    client = Client(api_key=api_key)
else:
    client = None

# -------------------- SECURITY --------------------
security = HTTPBearer()


# -------------------- HELPER --------------------
def get_current_user(credentials=Depends(security)):
    token = credentials.credentials
    supabase = get_supabase()

    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# -------------------- REQUEST MODELS --------------------
class UserCreate(BaseModel):
    email: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)


class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class Question(BaseModel):
    question: str


# -------------------- ROUTES --------------------

@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.post("/create-user")
def create_user(user: UserCreate):
    supabase = get_supabase()

    row = {
        "email": user.email,
        "full_name": user.full_name
    }

    try:
        res = supabase.table("users").insert(row).execute()
    except Exception as e:
        error_msg = str(e)
        if "duplicate key value" in error_msg.lower():
            raise HTTPException(status_code=400, detail="User already exists")
        raise HTTPException(status_code=500, detail=error_msg)

    if not res.data:
        raise HTTPException(status_code=500, detail="Insert failed")

    created = res.data[0]
    return {
        "email": created["email"],
        "name": created["full_name"]
    }


@app.post("/signup")
def signup(user: SignupRequest):
    supabase = get_supabase()

    try:
        res = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        if not res.user:
            raise HTTPException(status_code=400, detail="Signup failed")

        supabase.table("users").insert({
            "email": user.email,
            "full_name": ""
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Signup successful",
        "user": user.email
    }


@app.post("/login")
def login(data: LoginRequest):
    supabase = get_supabase()

    res = supabase.auth.sign_in_with_password({
        "email": data.email,
        "password": data.password
    })

    session = res.session if hasattr(res, "session") else res.get("session", None)

    if not session:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {
        "access_token": session.access_token
    }


@app.get("/profile")
def profile(user=Depends(get_current_user)):
    return {
        "message": "Authorized",
        "email": user.user.email
    }


@app.post("/ask")
def ask_ai(data: Question):
    if not client:
        return {"error": "Gemini API key not configured"}

    try:
        prompt = f"""You are a helpful AI tutor for students.
Explain concepts in simple language with steps.

Question: {data.question}
"""
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return {"answer": response.text}
    except Exception as e:
        return {"error": str(e)}
