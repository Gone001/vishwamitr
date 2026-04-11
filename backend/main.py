from fastapi import FastAPI, HTTPException, Depends, Query
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
    print(f"Token received: {token[:50] if token else 'None'}...")
    
    if not token:
        print("No token provided")
        raise HTTPException(status_code=401, detail="Invalid token")
    
    supabase = get_supabase()

    try:
        user = supabase.auth.get_user(token)
        print(f"User authenticated: {user.user.email if user and user.user else 'None'}")
        return user
    except Exception as e:
        print(f"Token error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")


# -------------------- REQUEST MODELS --------------------
class UserCreate(BaseModel):
    email: str
    full_name: str
    user_class: str
    board: str
    target_exam: str


class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class Question(BaseModel):
    question: str


# -------------------- QUIZ MODELS --------------------
class QuizAnswer(BaseModel):
    question_id: str
    selected_idx: int
    correct: bool


class QuizSubmitRequest(BaseModel):
    subject: str
    score: int
    total: int
    time_taken: int
    difficulty: str
    answers: list[QuizAnswer]


class QuizGenerateRequest(BaseModel):
    subject: str
    difficulty: str = "medium"
    topic: str | None = None


# -------------------- ROUTES --------------------

@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.post("/create-user")
def create_user(user: UserCreate):
    supabase = get_supabase()

    try:
        res = supabase.table("users").insert({
            "email": user.email,
            "full_name": user.full_name,
            "class": user.user_class,
            "board": user.board,
            "target_exam": user.target_exam
        }).execute()

        return {"message": "User stored successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
def profile(email: str = Query(...)):
    print(f"Loading profile for: {email}")
    import requests
    supabase = get_supabase()
    email_lower = email.lower()
    try:
        url = f"{supabase.url}/rest/v1/users?email=ilike.{email_lower}&select=*"
        print(f"Profile URL: {url}")
        resp = requests.get(url, headers=supabase.headers)
        print(f"Profile response: {resp.status_code} - {resp.text[:200] if resp.text else 'empty'}")
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"Profile data from DB: {data}")
            if data and len(data) > 0:
                user_data = data[0]
                return {"user": user_data}
        print(f"No user found for {email_lower}, returning defaults")
        return {"user": {"email": email, "full_name": "", "class": "", "board": "", "target_exam": "", "language": "English"}}
    except Exception as e:
        print(f"Profile error: {str(e)}")
        return {"user": {"email": email, "full_name": "", "class": "", "board": "", "target_exam": "", "language": "English"}}


class ProfileUpdate(BaseModel):
    full_name: str
    user_class: str
    board: str
    target_exam: str
    language: str = "English"


@app.put("/profile")
def update_profile(data: ProfileUpdate, email: str = Query(...)):
    supabase = get_supabase()
    print(f"Updating profile for: {email}")
    try:
        import requests
        url = f"{supabase.url}/rest/v1/users?email=eq.{email}"
        headers = supabase.headers.copy()
        
        update_data = {
            "full_name": data.full_name,
            "class": data.user_class,
            "board": data.board,
            "target_exam": data.target_exam,
            "language": data.language,
        }
        
        resp = requests.patch(url, headers=headers, json=update_data)
        print(f"Update response status: {resp.status_code}, text: {resp.text}")
        
        if resp.status_code == 204:
            return {"message": "Profile updated successfully"}
        
        if resp.status_code == 200 or resp.status_code == 201:
            return {"message": "Profile saved"}
            
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Update error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


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


# -------------------- QUIZ ROUTES --------------------

def generate_quiz_prompt(subject: str, difficulty: str, topic: str | None = None) -> str:
    """Generate prompt for Gemini to create quiz questions"""
    topic_str = f" on the topic '{topic}'" if topic else ""
    difficulty_desc = {
        "easy": "Simple recall questions that test basic facts and definitions",
        "medium": "Application-based questions that require understanding and problem-solving",
        "hard": "Analysis and numerical questions that require deep understanding and multi-step solutions"
    }.get(difficulty, "Application-based questions")

    return f"""You are an expert Indian educator for CBSE/NCERT curriculum (Class 11-12).

Generate exactly 5 unique multiple choice quiz questions for {subject}{topic_str}.

Difficulty: {difficulty_desc}

Requirements:
- Each question tests understanding, not just memory
- Use simple English with technical terms where needed
- 4 options per question (A, B, C, D) - only one correct
- Make distractors plausible but clearly incorrect
- No calculation errors in numerical questions
- Questions should be varied (not same pattern)

Output format - ONLY return valid JSON, no extra text:
{{
  "questions": [
    {{
      "id": "gemini_1",
      "question": "question text here",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correct": 0,
      "subject": "{subject}",
      "difficulty": "{difficulty}",
      "explanation": "Why this answer is correct"
    }}
  ]
}}"""


@app.post("/quiz/generate")
def generate_quiz(data: QuizGenerateRequest, email: str = Query(...)):
    """
    Try Gemini first, if fails return fallback flag with DB questions
    """
    # Try Gemini if API key is available
    if not client:
        return fallback_to_db(data.subject, data.difficulty)

    try:
        prompt = generate_quiz_prompt(data.subject, data.difficulty, data.topic)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        if not response.text:
            return fallback_to_db(data.subject, data.difficulty)

        # Parse Gemini response
        import json
        import re

        # Clean response - extract JSON from potential markdown code blocks
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = re.sub(r'^```json?\s*', '', response_text)
            response_text = re.sub(r'```\s*$', '', response_text)

        quiz_data = json.loads(response_text)

        if quiz_data.get("questions") and len(quiz_data["questions"]) >= 3:
            return {
                "source": "gemini",
                "questions": quiz_data["questions"]
            }
        else:
            return fallback_to_db(data.subject, data.difficulty)

    except Exception as e:
        print(f"Gemini quiz generation failed: {e}")
        return fallback_to_db(data.subject, data.difficulty)


def fallback_to_db(subject: str, difficulty: str):
    """Fetch questions from database when Gemini fails"""
    supabase = get_supabase()

    query = supabase.table("questions").select("*")

    if subject and subject != "all":
        query = query.eq("subject", subject)
    if difficulty and difficulty != "all":
        query = query.eq("difficulty", difficulty)

    query = query.limit(15)  # fetch extra for shuffling

    try:
        result = query.execute()
        questions = result.data

        if not questions:
            return {"fallback": True, "error": "No questions available in database"}

        # Shuffle and pick 5
        import random
        random.shuffle(questions)
        selected = questions[:5]

        formatted = [{
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "correct": q["correct_idx"],
            "subject": q["subject"],
            "difficulty": q["difficulty"]
        } for q in selected]

        return {
            "source": "database",
            "fallback": True,
            "questions": formatted,
            "message": "Gemini is taking a break. Showing Previous Year Questions instead."
        }
    except Exception as e:
        return {"fallback": True, "error": str(e)}

@app.get("/quiz/questions")
def get_questions(
    subject: str | None = None,
    difficulty: str | None = None,
    limit: int = 5,
    email: str = Query(...)
):
    supabase = get_supabase()

    query = supabase.table("questions").select("*")

    if subject and subject != "all":
        query = query.eq("subject", subject)
    if difficulty and difficulty != "all":
        query = query.eq("difficulty", difficulty)

    # Random order, limited to requested count
    query = query.order("created_at", desc=False)
    query = query.limit(limit * 3)  # fetch extra to allow filtering

    try:
        result = query.execute()
        questions = result.data

        if not questions:
            return {"questions": [], "message": "No questions found"}

        # Shuffle and pick
        import random
        random.shuffle(questions)
        selected = questions[:limit]

        # Transform to frontend format
        formatted = [{
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "correct": q["correct_idx"],
            "subject": q["subject"],
            "difficulty": q["difficulty"]
        } for q in selected]

        return {"questions": formatted}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/quiz/subjects")
def get_subjects():
    supabase = get_supabase()

    try:
        result = supabase.table("questions").select("subject").execute()
        subjects = list(set([q["subject"] for q in result.data if q.get("subject")]))
        return {"subjects": sorted(subjects)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quiz/submit")
def submit_quiz(data: QuizSubmitRequest, email: str = Query(...)):
    supabase = get_supabase()

    try:
        result = supabase.table("quiz_results").insert({
            "email": email,
            "subject": data.subject,
            "score": data.score,
            "total": data.total,
            "time_taken": data.time_taken,
            "difficulty": data.difficulty,
            "completed_at": "now()"
        }).execute()

        return {"message": "Quiz result saved", "id": result.data[0]["id"] if result.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/quiz/history")
def get_quiz_history(email: str = Query(...)):
    supabase = get_supabase()

    try:
        result = supabase.table("quiz_results").select("*").eq("email", email).order("completed_at", desc=True).limit(20).execute()
        return {"history": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
