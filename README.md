# 🚀 AI Interview Coach

An AI-powered interview preparation platform that helps candidates practice technical and behavioral interviews through dynamically generated questions, automated answer evaluation, and personalized feedback.

Built using **LangChain**, **Groq LLM (LLaMA 3.3 70B)**, **FastAPI**, and **React**, the application simulates realistic interview experiences and provides actionable insights to improve performance.

---

## ✨ Features

### 🎙️ Voice-to-Voice AI Interview Simulation (NEW)
* **Immersive Audio-First Interface:** AI reads questions out loud via text-to-speech without displaying text on-screen, enforcing active listening like a real interview.
* **Continuous Speech Recognition:** Uses the Web Speech API (`recognition.continuous = true`) to keep the microphone active through natural pauses and thinking gaps.
* **Manual Answer Control:** Candidates control the flow with an "End Answer" button, ensuring their complete thoughts are captured before moving on.

### 🎯 Dynamic Interview Generation
* Generate interview questions based on:
  * Job Role
  * Difficulty Level (Easy / Medium / Hard)
* Powered by Large Language Models using advanced prompt engineering.

### 📄 Resume-Based Personalized Questions
* Upload your resume PDF.
* AI analyzes your projects, skills, and experience.
* Generates personalized interview questions tailored specifically to your background.

### 🤝 HR & Behavioral Questions
* Tell me about yourself.
* Strengths and weaknesses.
* Situational and behavioral questions.
* Complete mock interview experience.

### 🎯 Interview Types
* **Technical** — DSA, System Design, Domain knowledge.
* **HR** — Behavioral and soft skill questions.  
* **Mixed** — Combination of both.

### 🤖 AI Answer Evaluation
* Scores answers on a scale of **0–10**.
* Provides:
  * Detailed feedback.
  * Strengths.
  * Areas for improvement.
  * Better sample answers.

### 📈 Progress Tracking
* Track interview performance across multiple sessions.
* Visual score trends and performance analytics.

### 🔥 LLM-Powered Experience
* Uses Groq-hosted LLaMA models for lightning-fast inference.
* LangChain orchestration for prompt management and response generation.

### 💻 Modern Full-Stack Architecture
* React frontend with Web Speech API integration.
* FastAPI backend.
* REST API communication.
* Clean, responsive user interface.

---

## 🛠 Tech Stack

### Frontend
* React.js
* Web Speech API (Speech Recognition & Synthesis)
* JavaScript
* HTML & CSS

### Backend
* FastAPI
* Python

### AI & LLM
* LangChain
* Groq API
* LLaMA 3.3 70B

### Development Tools
* Git & GitHub
* VS Code

---

## 🏗 System Architecture

User → React Frontend → FastAPI Backend → LangChain → Groq LLM

1. User selects role, difficulty, and uploads a resume.
2. AI generates contextual interview questions.
3. AI speaks the question; user responds via continuous voice recognition.
4. User submits the transcribed answer.
5. LLM evaluates responses.
6. Scores and actionable feedback are displayed.
7. Progress is tracked across sessions.

---
## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key (free at groq.com)
- Chrome Browser (required for Web Speech API compatibility)

### Backend Setup

```bash
cd ai_interview_coach
pip install langchain-groq fastapi uvicorn python-dotenv
