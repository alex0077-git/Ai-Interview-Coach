# 🚀 AI Interview Coach

An AI-powered interview preparation platform that helps candidates practice technical and behavioral interviews through dynamically generated questions, automated answer evaluation, and personalized feedback.

Built using **LangChain**, **Groq LLM (LLaMA 3.3 70B)**, **FastAPI**, and **React**, the application simulates realistic interview experiences and provides actionable insights to improve performance.

---

## ✨ Features

### 🎙️ Voice-to-Voice AI Interview Simulation 
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
  
### ⏱️ Time-Based Interview Sessions
* Choose interview durations such as **5, 10, 15, or 20 minutes**.
* AI continues asking questions until the selected time expires instead of using a fixed number of questions.
* If a question is asked before the timer ends, candidates are allowed to complete their answer without interruption.

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

### 💾 Smart History Tracking
* Caches previously asked questions locally using `localStorage` across sessions.
   
### 🔀 Random Question Variety 
* Filters historical data into the LLM prompt context to guarantee high random variety and prevent repetitive questions.

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

1. User selects the interview type, difficulty level, interview duration, and optionally uploads a resume.
2. AI starts the interview with a natural voice greeting.
3. AI asks questions using voice.
4. The candidate responds using continuous speech recognition.
5. The candidate manually ends their answer.
6. The AI evaluates the response and asks the next question until the selected interview duration expires.
7. Once the final answer is completed, the interview ends and detailed feedback is generated.

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
