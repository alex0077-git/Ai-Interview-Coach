from langchain_groq import ChatGroq
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pypdf import PdfReader
import re
import json
import os
import io

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(api_key=os.environ.get("GROQ_API_KEY"), model="llama-3.3-70b-versatile")

class InterviewRequest(BaseModel):
    job_role: str
    user_answer: str
    question: str
    topic: str = "General"

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return {"resume_text": text}

@app.post("/get-next-question")
def get_next_question(data: dict):
    job_role = data.get("job_role", "Software Engineer")
    difficulty = data.get("difficulty", "Medium")
    interview_type = data.get("interview_type", "Mixed")
    resume_text = data.get("resume_text", "")
    previous = data.get("previous", [])

    avoid = "\n\nDo NOT ask these questions again:\n" + "\n".join(previous) if previous else ""

    if resume_text:
        resume_section = f"\nCandidate Resume:\n{resume_text[:2000]}\nAsk about their specific projects and skills."
    else:
        resume_section = ""

    if interview_type == "Technical":
        type_instruction = "Ask a technical question — DSA, system design, coding, or domain knowledge."
    elif interview_type == "HR":
        type_instruction = "Ask an HR or behavioral question — strengths, weaknesses, situational, career goals, tell me about yourself."
    else:
        type_instruction = "Ask either a technical OR behavioral/HR question — mix them naturally like a real interview."

    prompt = f"""You are a professional interviewer for a {job_role} role ({difficulty} level).
{type_instruction}
{resume_section}
{avoid}

Generate exactly ONE interview question. Return ONLY the question, nothing else. No numbering, no explanation, no preamble."""

    response = llm.invoke(prompt)
    return {"question": response.content.strip()}

@app.post("/start-interview-full")
def start_interview_full(data: dict):
    job_role = data.get("job_role", "Software Engineer")
    difficulty = data.get("difficulty", "Medium")
    resume_text = data.get("resume_text", "")
    previous = data.get("previous", "")
    interview_type = data.get("interview_type", "Mixed")

    avoid = f"\n\nDo NOT repeat these questions:\n{previous}" if previous else ""

    if resume_text:
        resume_section = f"""
Candidate's Resume:
{resume_text[:2000]}

Generate personalized questions based on this resume — ask about their specific projects, skills, and experiences mentioned above.
"""
    else:
        resume_section = ""

    if interview_type == "Technical":
        type_instruction = "Focus only on technical questions — DSA, system design, coding, and domain knowledge."
    elif interview_type == "HR":
        type_instruction = """Focus only on HR and behavioral questions such as:
- Tell me about yourself
- What are your strengths and weaknesses?
- Why should we hire you?
- Where do you see yourself in 5 years?
- Describe a challenging situation you faced
- Tell me about a failure and what you learned
- Why do you want to join this company?
- What are your salary expectations?"""
    else:
        type_instruction = """Mix of both technical AND HR/behavioral questions. Include:
- 2-3 technical questions (DSA, system design, domain)
- 2-3 HR/behavioral questions (strengths, weaknesses, situational)"""

    prompt = f"""You are a professional interviewer conducting a {difficulty} level interview for a {job_role} role.

{type_instruction}
{resume_section}

Generate exactly 5 interview questions.
{avoid}

Return ONLY a JSON array of 5 strings, no extra text.
Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]"""

    response = llm.invoke(prompt)
    try:
        content = response.content.strip()
        if "```" in content:
            content = content.split("```")[1].replace("json", "").strip()
        questions = json.loads(content)
    except:
        questions = [f"Tell me about yourself and your experience with {job_role}." for _ in range(5)]
    return {"questions": questions}

@app.post("/evaluate-all")
def evaluate_all(data: dict):
    job_role = data["job_role"]
    qa_pairs = data["qa_pairs"]
    difficulty = data.get("difficulty", "Medium")
    results = []
    total = 0
    for qa in qa_pairs:
        prompt = f"""
You are an expert interviewer for {job_role} roles.
Difficulty: {difficulty}
Question: {qa['question']}
Candidate answer: {qa['answer']}

Evaluate both technical accuracy AND communication skills.

Respond in exactly this format:
SCORE: [0-10]

WHAT WAS GOOD:
[points]

WHAT TO IMPROVE:
[points]

BETTER ANSWER:
[answer]
"""
        response = llm.invoke(prompt)
        score_match = re.search(r'SCORE:\s*(\d+)', response.content)
        score = int(score_match.group(1)) if score_match else 0
        total += score
        results.append({
            "question": qa["question"],
            "answer": qa["answer"],
            "feedback": response.content,
            "score": score
        })
    return {"results": results, "total_score": total, "max_score": len(qa_pairs) * 10}