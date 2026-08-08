# 🚀 AI Interview Coach

An AI-powered voice interview simulator that helps candidates practice technical and behavioral interviews through real-time voice-to-voice interaction, dynamically generated questions, automated answer evaluation, and personalized feedback.

Built using **LangChain**, **Groq LLM (LLaMA 3.3 70B)**, **FastAPI**, and **React**, the application simulates a realistic interview experience and provides actionable insights to improve performance.

---

## ✨ Features

### 🎙️ Voice-to-Voice AI Interview Simulation
* **Immersive Audio-First Interface:** AI reads questions out loud via text-to-speech without displaying text on-screen, enforcing active listening like a real interview.
* **Continuous Speech Recognition:** Uses the Web Speech API (`recognition.continuous = true`) to keep the microphone active through natural pauses and thinking gaps — never cuts off mid-answer.
* **Manual Answer Control:** Candidates control the flow with an "End Answer" button, ensuring complete thoughts are captured before moving on.
* **Natural AI Greeting:** Interview begins with a personalized voice greeting before questions start.

### 🎯 Dynamic Interview Generation
* Generate interview questions based on:
  * Job Role
  * Difficulty Level (Easy / Medium / Hard)
  * Interview Type (Technical / HR / Mixed)
* Powered by Large Language Models using advanced prompt engineering.
* High randomness (`temperature=0.9`) ensures fresh, unpredictable questions every session.

### 📄 Resume-Based Personalized Questions
* Upload your resume PDF.
* AI analyzes your projects, skills, and experience.
* Generates personalized interview questions tailored specifically to your background.

### 📋 Job Description Targeted Questions
* Paste any job description before starting.
* AI analyzes the JD and generates questions that match exactly what the company is looking for.
* Combines resume + JD for ultra-personalized interview simulation.

### 🤝 HR & Behavioral Questions
* Tell me about yourself.
* Strengths and weaknesses.
* Why should we hire you?
* Where do you see yourself in 5 years?
* Situational and behavioral questions.
* Complete mock interview experience.

### 🎯 Interview Types
* **Technical** — DSA, System Design, Domain knowledge.
* **HR** — Behavioral and soft skill questions.
* **Mixed** — Combination of both.

### ⏱️ Time-Based Interview Sessions
* Choose interview durations: **5, 10, 15, or 20 minutes**.
* AI continues asking questions dynamically until the selected time expires — no fixed question count.
* If a question is asked before the timer ends, candidates are always allowed to complete their answer without interruption.
* Timer only controls when new questions stop — never cuts off your current answer.

### ▶️ Continue Interview
* After completing an interview, choose **Continue Interview** instead of starting from scratch.
* Keeps the same job role, resume, and job description.
* Optionally change difficulty level and duration before continuing.
* Perfect for back-to-back practice sessions without re-uploading everything.

### 🤖 AI Answer Evaluation
* Scores answers on a scale of **0–10**.
* Evaluates both technical accuracy AND communication skills.
* Provides:
  * Detailed feedback.
  * What was good.
  * Areas for improvement.
  * Better sample answers.

### 📈 Progress Tracking
* Track interview performance across multiple sessions within a single session.
* Visual score graph showing improvement trends.
* Session summary: role, type, difficulty, duration, questions answered, total score.

### 💾 Smart History Tracking
* Caches previously asked questions locally using `localStorage` across browser sessions.
* Prevents exact question repetition across multiple practice sessions.
* Older questions may reappear occasionally in rephrased form for revision.

### 🔀 Random Question Variety
* Only the last 3 questions are strictly avoided — older concepts can resurface with fresh wording.
* Random question styles and angles injected into every LLM prompt.
* Unique session tokens ensure no two interviews feel the same.

### 🔥 LLM-Powered Experience
* Uses Groq-hosted LLaMA 3.3 70B for lightning-fast inference.
* LangChain orchestration for prompt management and response generation.
* High temperature setting ensures creative, varied, and unpredictable questions.

### 💻 Modern Full-Stack Architecture
* React frontend with Web Speech API integration.
* FastAPI backend with REST API endpoints.
* Clean, responsive dark UI.

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
* LLaMA 3.3 70B (temperature=0.9)

### Development Tools
* Git & GitHub
* VS Code

---

## 🏗 System Architecture

```
User → React Frontend → FastAPI Backend → LangChain → Groq LLM
```

1. User selects job role, interview type, difficulty, and duration. Optionally uploads resume PDF and/or pastes job description.
2. AI starts the interview with a natural personalized voice greeting.
3. AI dynamically generates and asks ONE question at a time using voice.
4. Candidate listens and responds using continuous speech recognition.
5. Candidate manually clicks "End Answer" when done — mic never stops automatically.
6. AI evaluates the response, saves it, and immediately asks the next question.
7. This continues until the selected interview duration expires.
8. If a question was asked before time expired, candidate completes that final answer.
9. Once the final answer is submitted, interview ends and detailed evaluation is generated.
10. Candidate can choose to Continue (same setup) or Start New Interview.

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key (free at groq.com)
- **Chrome Browser** (required for Web Speech API)

### Backend Setup

```bash
cd ai_interview_coach
pip install langchain-groq fastapi uvicorn python-dotenv pypdf python-multipart
```

Create `.env` file in root folder:
```
GROQ_API_KEY=your_groq_api_key_here
```

Run backend:
```bash
python -m uvicorn app:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Access
- Frontend: http://localhost:3000
- API Docs: http://127.0.0.1:8000/docs

---

## 🎯 Future Enhancements
* Deploy to cloud — live public URL
* User authentication and persistent history
* AI-generated PDF interview report
* Multi-language support
* Video interview simulation
* Salary negotiation practice mode

---

## 👨‍💻 Author

**Alex Antony**
* GitHub: [github.com/alex0077-git](https://github.com/alex0077-git)
* LinkedIn: [linkedin.com/in/alex-antony-9586173b1](https://linkedin.com/in/alex-antony-9586173b1)
* Portfolio: [portfolio-ten-roan-adlhx3sbsz.vercel.app](https://portfolio-ten-roan-adlhx3sbsz.vercel.app)
