import { useState, useRef, useEffect } from "react";

function App() {
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [allQA, setAllQA] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("setup");
  const [sessionHistory, setSessionHistory] = useState([]);
  const [allPreviousQuestions, setAllPreviousQuestions] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const fileRef = useRef();
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  const difficulties = ["Easy", "Medium", "Hard"];
  const interviewTypes = ["Technical", "HR", "Mixed"];

  const speakText = (text, onDone) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      if (onDone) onDone();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      if (onDone) onDone();
    };
    window.speechSynthesis.speak(utterance);
  };

  const askQuestion = (index, qs) => {
    const qList = qs || questions;
    if (index >= qList.length) return;
    setAiStatus("AI is asking question...");
    setCurrentTranscript("");
    transcriptRef.current = "";
    speakText(qList[index], () => {
      setAiStatus("Your turn — click Speak to answer");
    });
  };

  useEffect(() => {
    if (stage === "interview" && questions.length > 0) {
      setTimeout(() => askQuestion(0, questions), 500);
    }
  }, [stage]);

  const uploadResume = async (file) => {
    setResumeName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://127.0.0.1:8000/upload-resume", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResumeText(data.resume_text);
  };

  const startInterview = async () => {
    if (!jobRole) return;
    setLoading(true);
    const previousStr = allPreviousQuestions.join(" | ");
    const res = await fetch("http://127.0.0.1:8000/start-interview-full", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_role: jobRole,
        difficulty,
        interview_type: interviewType,
        resume_text: resumeText,
        previous: previousStr,
      }),
    });
    const data = await res.json();
    setQuestions(data.questions);
    setAllPreviousQuestions(prev => [...prev, ...data.questions]);
    setAllQA([]);
    setCurrentQIndex(0);
    setCurrentTranscript("");
    setResults(null);
    setStage("interview");
    setLoading(false);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Please use Chrome browser for speech recognition.");
      return;
    }
    window.speechSynthesis.cancel();
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setAiStatus("Listening... speak your answer");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      const combined = finalText + interimText;
      transcriptRef.current = finalText;
      setCurrentTranscript(combined);
    };

    recognition.onerror = () => {
      setListening(false);
      setAiStatus("Your turn — click Speak to answer");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const endAnswer = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);

    const answer = transcriptRef.current.trim() || currentTranscript.trim();
    if (!answer) {
      setAiStatus("No answer detected. Please try again.");
      return;
    }

    const newQA = [...allQA, { question: questions[currentQIndex], answer }];
    setAllQA(newQA);
    setCurrentTranscript("");
    transcriptRef.current = "";

    const nextIndex = currentQIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQIndex(nextIndex);
      setAiStatus("Moving to next question...");
      setTimeout(() => askQuestion(nextIndex), 1000);
    } else {
      setAiStatus("Interview complete! Evaluating...");
      await evaluateAll(newQA);
    }
  };

  const evaluateAll = async (qaList) => {
    setLoading(true);
    const qa_pairs = qaList.map(qa => ({ question: qa.question, answer: qa.answer }));
    const res = await fetch("http://127.0.0.1:8000/evaluate-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_role: jobRole, qa_pairs, difficulty }),
    });
    const data = await res.json();
    setResults(data);
    setSessionHistory(prev => [...prev, {
      role: jobRole, difficulty, type: interviewType,
      total: data.total_score, max: data.max_score,
    }]);
    setStage("results");
    setLoading(false);
  };

  const restart = () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setJobRole(""); setQuestions([]); setAllQA([]); setCurrentQIndex(0);
    setCurrentTranscript(""); setResults(null); setResumeText(""); setResumeName("");
    setListening(false); setSpeaking(false); setAiStatus(""); setStage("setup");
  };

  const fullReset = () => { restart(); setAllPreviousQuestions([]); setSessionHistory([]); };
  const scoreColor = (s) => s >= 7 ? "#10b981" : s >= 4 ? "#f59e0b" : "#ef4444";
  const scoreLabel = (s) => s >= 7 ? "Great!" : s >= 4 ? "Okay" : "Needs work";
  const pct = (s, m) => Math.round((s / m) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "Inter, sans-serif", padding: "30px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#6366f1", margin: 0 }}>AI Interview Coach</h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Practice. Improve. Get hired.</p>
        </div>

        {/* Progress */}
        {sessionHistory.length > 0 && (
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ color: "#e2e8f0", margin: 0, fontSize: "15px" }}>Session Progress</h3>
              <button onClick={fullReset} style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: "12px", cursor: "pointer" }}>Reset All</button>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "60px" }}>
              {sessionHistory.map((s, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>{pct(s.total, s.max)}%</span>
                  <div style={{ width: "100%", borderRadius: "4px 4px 0 0", height: `${pct(s.total, s.max) * 0.5}px`, background: pct(s.total, s.max) >= 70 ? "#10b981" : pct(s.total, s.max) >= 50 ? "#f59e0b" : "#ef4444", minHeight: "4px" }} />
                  <span style={{ fontSize: "9px", color: "#64748b" }}>#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETUP */}
        {stage === "setup" && (
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px" }}>
            <h2 style={{ color: "#e2e8f0", margin: "0 0 24px", fontSize: "18px" }}>Start your mock interview</h2>

            <input placeholder="Enter job role (e.g. AI Engineer, Software Engineer)" value={jobRole}
              onChange={(e) => setJobRole(e.target.value)} onKeyDown={(e) => e.key === "Enter" && startInterview()}
              style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: "15px", marginBottom: "20px", boxSizing: "border-box" }} />

            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 10px" }}>Interview Type</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {interviewTypes.map(t => (
                <button key={t} onClick={() => setInterviewType(t)}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", background: interviewType === t ? "#6366f1" : "#334155", color: interviewType === t ? "white" : "#94a3b8" }}>
                  {t === "Technical" ? "💻 Technical" : t === "HR" ? "🤝 HR" : "🎯 Mixed"}
                </button>
              ))}
            </div>

            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 10px" }}>Difficulty</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {difficulties.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", background: difficulty === d ? (d === "Easy" ? "#10b981" : d === "Medium" ? "#f59e0b" : "#ef4444") : "#334155", color: difficulty === d ? "white" : "#94a3b8" }}>
                  {d}
                </button>
              ))}
            </div>

            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 10px" }}>Resume (optional)</p>
            <div onClick={() => fileRef.current.click()}
              style={{ border: "2px dashed #334155", borderRadius: "10px", padding: "20px", textAlign: "center", cursor: "pointer", marginBottom: "20px", background: resumeText ? "#0f2a1a" : "transparent", borderColor: resumeText ? "#10b981" : "#334155" }}>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files[0] && uploadResume(e.target.files[0])} />
              {resumeText ? (
                <div><div style={{ color: "#10b981" }}>✅ {resumeName}</div><div style={{ color: "#64748b", fontSize: "11px" }}>Personalized questions enabled</div></div>
              ) : (
                <div><div style={{ color: "#64748b", fontSize: "24px" }}>📄</div><div style={{ color: "#64748b", fontSize: "13px" }}>Click to upload resume PDF</div></div>
              )}
            </div>

            <button onClick={startInterview} disabled={!jobRole || loading}
              style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: !jobRole ? "#334155" : "#6366f1", color: "white", fontSize: "15px", fontWeight: "600", cursor: !jobRole ? "not-allowed" : "pointer" }}>
              {loading ? "Preparing interview..." : "Start Interview →"}
            </button>
          </div>
        )}

        {/* INTERVIEW */}
        {stage === "interview" && (
          <div>
            {/* Progress bar */}
            <div style={{ background: "#1e293b", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>Question {currentQIndex + 1} of {questions.length}</span>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>{jobRole} · {interviewType} · {difficulty}</span>
              </div>
              <div style={{ background: "#334155", borderRadius: "4px", height: "4px" }}>
                <div style={{ background: "#6366f1", borderRadius: "4px", height: "4px", width: `${((currentQIndex) / questions.length) * 100}%`, transition: "width 0.5s" }} />
              </div>
            </div>

            {/* AI Status */}
            <div style={{ background: "#1e293b", borderRadius: "16px", padding: "40px 24px", textAlign: "center", marginBottom: "24px" }}>
              {/* AI Avatar */}
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: speaking ? "#1e3a5f" : listening ? "#064e3b" : "#1e293b", border: `3px solid ${speaking ? "#3b82f6" : listening ? "#10b981" : "#334155"}`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", transition: "all 0.3s" }}>
                {speaking ? "🎙️" : listening ? "👂" : "🤖"}
              </div>

              <div style={{ fontSize: "16px", color: speaking ? "#93c5fd" : listening ? "#6ee7b7" : "#94a3b8", fontWeight: "500", marginBottom: "8px" }}>
                {speaking ? "AI Interviewer is speaking..." : listening ? "Listening to your answer..." : aiStatus}
              </div>

              {loading && <div style={{ color: "#64748b", fontSize: "13px" }}>Evaluating your answers...</div>}
            </div>

            {/* Transcript */}
            {(listening || currentTranscript) && (
              <div style={{ background: "#1e293b", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px" }}>
                <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 8px" }}>Your answer (transcript):</p>
                <p style={{ color: "#e2e8f0", fontSize: "14px", margin: 0, lineHeight: "1.6", minHeight: "40px" }}>
                  {currentTranscript || <span style={{ color: "#475569" }}>Start speaking...</span>}
                </p>
              </div>
            )}

            {/* Answered so far */}
            {allQA.length > 0 && (
              <div style={{ background: "#1e293b", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
                <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 6px" }}>Answered: {allQA.length} question{allQA.length > 1 ? "s" : ""}</p>
                {allQA.map((qa, i) => (
                  <div key={i} style={{ fontSize: "12px", color: "#475569", padding: "4px 0", borderBottom: i < allQA.length - 1 ? "1px solid #0f172a" : "none" }}>
                    ✅ Q{i + 1}: {qa.answer.substring(0, 60)}...
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {!listening ? (
                <button onClick={startListening} disabled={speaking || loading}
                  style={{ flex: 1, padding: "18px", borderRadius: "12px", border: "none", background: speaking || loading ? "#334155" : "#6366f1", color: "white", fontSize: "16px", fontWeight: "700", cursor: speaking || loading ? "not-allowed" : "pointer" }}>
                  🎤 Speak Answer
                </button>
              ) : (
                <button onClick={endAnswer}
                  style={{ flex: 1, padding: "18px", borderRadius: "12px", border: "none", background: "#10b981", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
                  ✅ End Answer
                </button>
              )}
              <button onClick={restart}
                style={{ padding: "18px 20px", borderRadius: "12px", border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: "14px", cursor: "pointer" }}>
                Exit
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {stage === "results" && results && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", textAlign: "center", marginBottom: "24px" }}>
              <p style={{ color: "#94a3b8", margin: "0 0 8px", fontSize: "14px" }}>Interview Complete!</p>
              <div style={{ fontSize: "56px", fontWeight: "700", color: scoreColor((results.total_score / results.max_score) * 10) }}>
                {results.total_score}/{results.max_score}
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#94a3b8" }}>{pct(results.total_score, results.max_score)}% · {interviewType} · {difficulty}</div>
              <p style={{ color: "#94a3b8", margin: "8px 0 0", fontSize: "14px" }}>
                {results.total_score >= 35 ? "Excellent! You're interview ready!" : results.total_score >= 25 ? "Good performance. Keep practicing!" : "Keep practicing. You'll get there!"}
              </p>
            </div>

            {results.results.map((r, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1 }}>
                    <span style={{ background: "#6366f1", color: "white", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</span>
                    <p style={{ color: "#e2e8f0", margin: 0, fontSize: "14px", lineHeight: "1.6" }}>{r.question}</p>
                  </div>
                  <div style={{ textAlign: "center", marginLeft: "16px", flexShrink: 0 }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: scoreColor(r.score) }}>{r.score}/10</div>
                    <div style={{ fontSize: "11px", color: scoreColor(r.score) }}>{scoreLabel(r.score)}</div>
                  </div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
                  <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 4px" }}>Your answer:</p>
                  <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0, lineHeight: "1.6" }}>{r.answer}</p>
                </div>
                <pre style={{ whiteSpace: "pre-wrap", color: "#cbd5e1", fontSize: "13px", lineHeight: "1.7", margin: 0, background: "#0f172a", padding: "12px", borderRadius: "8px" }}>{r.feedback}</pre>
              </div>
            ))}

            <button onClick={restart}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#6366f1", color: "white", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}>
              Start New Interview
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;