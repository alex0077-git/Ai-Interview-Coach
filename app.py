from langchain_groq import ChatGroq
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import re
import json
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
llm = ChatGroq(api_key=os.environ.get("GROQ_API_KEY"), model="llama-3.3-70b-versatile")
class InterviewRequest(BaseModel):
    job_role: str
    user_answer: str
    question: str
    topic: str = "General"

@app.get("/get-topics")
def get_topics(job_role: str):
    prompt = f"List exactly 5 relevant technical interview topics for a {job_role} role. Return only a JSON array of strings, nothing else."
    response = llm.invoke(prompt)
    try:
        topics = json.loads(response.content)
    except:
        topics = ["DSA", "System Design", "Python", "Database", "General"]
    return {"topics": topics}

@app.get("/start-interview")
def start_interview(job_role: str, difficulty: str = "Medium"):
    prompt = f"""Generate exactly 5 {difficulty} level technical interview questions for a {job_role} role.
{
    'Focus on basic concepts, definitions and simple problems.' if difficulty == 'Easy' else
    'Mix of conceptual and practical problems.' if difficulty == 'Medium' else
    'Advanced, complex problems requiring deep expertise.'
}
Cover: coding/DSA, system design, domain knowledge, problem solving, practical experience.
Return ONLY a JSON array of 5 strings, no extra text."""
    response = llm.invoke(prompt)
    try:
        content = response.content.strip()
        if "```" in content:
            content = content.split("```")[1].replace("json", "").strip()
        questions = json.loads(content)
    except:
        questions = [f"Tell me about your experience with {job_role}." for _ in range(5)]
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