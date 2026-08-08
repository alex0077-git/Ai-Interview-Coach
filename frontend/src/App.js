import { useState, useRef, useEffect } from "react";

const COLORS = {
  bg: "#080B14",
  surface: "#0F1628",
  card: "#141B2D",
  border: "#1E2D4A",
  primary: "#6C63FF",
  primaryGlow: "rgba(108, 99, 255, 0.3)",
  secondary: "#FF6584",
  accent: "#00D4FF",
  accentGlow: "rgba(0, 212, 255, 0.2)",
  success: "#00E5A0",
  successGlow: "rgba(0, 229, 160, 0.2)",
  warning: "#FFB347",
  danger: "#FF4757",
  text: "#E8EEFF",
  textMuted: "#5B6B8A",
  textSub: "#8899BB",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    font-family: 'Inter', sans-serif;
    color: ${COLORS.text};
  }

  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 0.4; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  @keyframes pulse-ring2 {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.3); opacity: 0.1; }
    100% { transform: scale(1); opacity: 0.5; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes barDance {
    0%, 100% { height: 8px; }
    50% { height: 28px; }
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px ${COLORS.primaryGlow}; }
    50% { box-shadow: 0 0 40px ${COLORS.primaryGlow}, 0 0 80px rgba(108,99,255,0.1); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes timerWarning {
    0%, 100% { color: ${COLORS.warning}; }
    50% { color: #FF8C00; }
  }

  .fade-up { animation: fadeSlideUp 0.4s ease forwards; }

  .btn-primary {
    background: linear-gradient(135deg, ${COLORS.primary}, #8B5CF6);
    border: none;
    color: white;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px ${COLORS.primaryGlow};
  }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-success {
    background: linear-gradient(135deg, ${COLORS.success}, #00B894);
    border: none; color: #000;
    font-family: 'Inter', sans-serif;
    font-weight: 700; cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-success:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${COLORS.successGlow}; }

  .btn-ghost {
    background: transparent;
    border: 1px solid ${COLORS.border};
    color: ${COLORS.textSub};
    font-family: 'Inter', sans-serif;
    font-weight: 500; cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-ghost:hover { border-color: ${COLORS.primary}; color: ${COLORS.primary}; }

  .card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    transition: all 0.3s ease;
  }

  .chip {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
  }

  input, textarea {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    color: ${COLORS.text};
    font-family: 'Inter', sans-serif;
    transition: all 0.2s ease;
    outline: none;
  }
  input:focus, textarea:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 3px ${COLORS.primaryGlow};
  }
  input::placeholder, textarea::placeholder { color: ${COLORS.textMuted}; }

  .progress-bar {
    height: 3px;
    background: ${COLORS.border};
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s linear;
  }

  .sound-bar {
    width: 4px;
    border-radius: 4px;
    background: ${COLORS.accent};
    animation: barDance 0.8s ease-in-out infinite;
  }

  .toggle-group {
    display: flex;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
  }
  .toggle-btn {
    flex: 1; padding: 10px;
    border: none; border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    color: ${COLORS.textSub};
  }
  .toggle-btn.active {
    background: ${COLORS.card};
    color: ${COLORS.text};
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .session-bar {
    display: flex; align-items: center;
    gap: 8px; padding: 8px 0;
    border-bottom: 1px solid ${COLORS.border};
  }
  .session-bar:last-child { border-bottom: none; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
`;

export default function App() {
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [duration, setDuration] = useState(10);
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [allQA, setAllQA] = useState([]);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("setup");
  const [sessionHistory, setSessionHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [questionNum, setQuestionNum] = useState(0);
  const [showContinueOptions, setShowContinueOptions] = useState(false);
  const [continueDifficulty, setContinueDifficulty] = useState("");
  const [continueDuration, setContinueDuration] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef();
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const timerRef = useRef(null);
  const timeLeftRef = useRef(0);
  const timeExpiredRef = useRef(false);

  const difficulties = ["Easy", "Medium", "Hard"];
  const interviewTypes = ["Technical", "HR", "Mixed"];
  const durations = [5, 10, 15, 20];
  const getStorageKey = (role) => `prev_questions_${role.toLowerCase().replace(/\s/g, "_")}`;

  const diffColor = (d) => d === "Easy" ? COLORS.success : d === "Medium" ? COLORS.warning : COLORS.danger;
  const diffGlow = (d) => d === "Easy" ? COLORS.successGlow : d === "Medium" ? "rgba(255,179,71,0.2)" : "rgba(255,71,87,0.2)";

  const speakText = (text, onDone) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; utterance.rate = 0.9; utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); if (onDone) onDone(); };
    utterance.onerror = () => { setSpeaking(false); if (onDone) onDone(); };
    window.speechSynthesis.speak(utterance);
  };

  const startTimer = (mins) => {
    const total = mins * 60;
    setTimeLeft(total); timeLeftRef.current = total;
    timeExpiredRef.current = false; setTimeExpired(false);
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current);
        timeExpiredRef.current = true; setTimeExpired(true);
      }
    }, 1000);
  };

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const fetchNextQuestion = async (prevQs, diffOverride) => {
    const res = await fetch("http://127.0.0.1:8000/get-next-question", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_role: jobRole, difficulty: diffOverride || difficulty, interview_type: interviewType, resume_text: resumeText, previous: prevQs, job_description: jobDescription }),
    });
    return (await res.json()).question;
  };

  const askNextQuestion = async (prevQs, qNum, diffOverride) => {
    setAiStatus("Crafting your next question...");
    const question = await fetchNextQuestion(prevQs, diffOverride);
    setCurrentQuestion(question); setQuestionNum(qNum);
    setCurrentTranscript(""); transcriptRef.current = "";
    setAiStatus("Listen carefully...");
    speakText(question, () => setAiStatus("Your turn — tap the mic to answer"));
  };

  const uploadResume = async (file) => {
    setResumeName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://127.0.0.1:8000/upload-resume", { method: "POST", body: formData });
    setResumeText((await res.json()).resume_text);
  };

  const startInterview = async (diffOverride, durOverride) => {
    const activeDiff = diffOverride || difficulty;
    const activeDur = durOverride || duration;
    if (!jobRole) return;
    setLoading(true); setAllQA([]); setCurrentQuestion(""); setCurrentTranscript("");
    setResults(null); setQuestionNum(0); setShowContinueOptions(false);
    try {
      const saved = localStorage.getItem(getStorageKey(jobRole));
      setPreviousQuestions(saved ? JSON.parse(saved) : []);
    } catch { setPreviousQuestions([]); }
    setStage("interview"); setLoading(false);
    const greeting = `Welcome! I'm your AI interviewer today. We'll be doing a ${activeDur}-minute ${activeDiff} level ${interviewType} interview for the ${jobRole} role. Take a breath, and let's get started!`;
    setAiStatus("Your interviewer is ready...");
    speakText(greeting, async () => {
      startTimer(activeDur);
      const saved = localStorage.getItem(getStorageKey(jobRole));
      await askNextQuestion(saved ? JSON.parse(saved) : [], 1, activeDiff);
    });
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Please use Chrome browser."); return;
    }
    window.speechSynthesis.cancel(); setSpeaking(false);
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    let finalT = ""; let isEnded = false;
    const create = () => {
      const r = new SR();
      r.lang = "en-US"; r.continuous = true; r.interimResults = true;
      r.onstart = () => { setListening(true); setAiStatus("Listening... speak freely"); };
      r.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalT += e.results[i][0].transcript + " ";
          else interim += e.results[i][0].transcript;
        }
        transcriptRef.current = finalT;
        setCurrentTranscript(finalT + interim);
      };
      r.onend = () => { if (!isEnded) { try { r.start(); } catch { const nr = create(); recognitionRef.current = { stop: () => { isEnded = true; nr.stop(); } }; nr.start(); } } };
      r.onerror = (e) => {
        if (e.error === "no-speech" || e.error === "audio-capture") { if (!isEnded) { try { r.start(); } catch {} } }
        else { setListening(false); setAiStatus("Your turn — tap the mic to answer"); }
      };
      return r;
    };
    const rec = create();
    recognitionRef.current = { stop: () => { isEnded = true; rec.stop(); } };
    rec.start();
  };

  const endAnswer = async () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setListening(false);
    const answer = transcriptRef.current.trim() || currentTranscript.trim();
    if (!answer) { setAiStatus("Nothing detected — try again"); return; }
    const newQA = [...allQA, { question: currentQuestion, answer }];
    setAllQA(newQA);
    const newPrev = [...previousQuestions, currentQuestion];
    setPreviousQuestions(newPrev);
    try { localStorage.setItem(getStorageKey(jobRole), JSON.stringify(newPrev)); } catch {}
    setCurrentTranscript(""); transcriptRef.current = "";
    if (timeExpiredRef.current) {
      setAiStatus("Wrapping up your interview...");
      stopTimer(); await evaluateAll(newQA);
    } else { await askNextQuestion(newPrev, questionNum + 1); }
  };

  const evaluateAll = async (qaList) => {
    setLoading(true); setStage("evaluating");
    const res = await fetch("http://127.0.0.1:8000/evaluate-all", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_role: jobRole, qa_pairs: qaList.map(q => ({ question: q.question, answer: q.answer })), difficulty }),
    });
    const data = await res.json();
    setResults(data);
    setSessionHistory(prev => [...prev, { role: jobRole, difficulty, type: interviewType, duration, total: data.total_score, max: data.max_score, questions: qaList.length }]);
    setStage("results"); setLoading(false);
  };

  const restart = () => {
    window.speechSynthesis.cancel(); stopTimer();
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setJobRole(""); setCurrentQuestion(""); setAllQA([]); setPreviousQuestions([]);
    setCurrentTranscript(""); setResults(null); setResumeText(""); setResumeName("");
    setJobDescription(""); setShowContinueOptions(false);
    setListening(false); setSpeaking(false); setAiStatus(""); setTimeLeft(0);
    setTimeExpired(false); setQuestionNum(0); setStage("setup");
  };

  const fullReset = () => { restart(); setSessionHistory([]); };
  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const scoreColor = (s) => s >= 7 ? COLORS.success : s >= 4 ? COLORS.warning : COLORS.danger;
  const scoreGlow = (s) => s >= 7 ? COLORS.successGlow : s >= 4 ? "rgba(255,179,71,0.2)" : "rgba(255,71,87,0.2)";
  const pct = (s, m) => Math.round((s / m) * 100);
  const scoreLabel = (s) => s >= 7 ? "Excellent" : s >= 4 ? "Good" : "Needs Work";

  const timerColor = timeExpired ? COLORS.danger : timeLeft <= 60 ? COLORS.warning : COLORS.success;
  const timerPct = (timeLeft / (duration * 60)) * 100;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.05) 0%, transparent 50%), ${COLORS.bg}`, padding: "24px 20px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "40px", animation: "fadeSlideUp 0.5s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${COLORS.primary}, #8B5CF6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: `0 4px 20px ${COLORS.primaryGlow}` }}>🎙️</div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: "700", background: `linear-gradient(135deg, ${COLORS.text}, ${COLORS.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Interview Coach
              </h1>
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: "14px", letterSpacing: "0.05em" }}>AI-POWERED VOICE INTERVIEW SIMULATOR</p>
          </div>

          {/* SESSION HISTORY */}
          {sessionHistory.length > 0 && (
  <div className="card fade-up" style={{ marginBottom: "20px", overflow: "hidden" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
      <span style={{ fontSize: "12px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em" }}>SESSION HISTORY</span>
      <button onClick={fullReset} className="btn-ghost" style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px" }}>Clear</button>
    </div>

    {/* Table header */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 60px 60px", padding: "10px 20px", borderBottom: `1px solid ${COLORS.border}`, gap: "8px" }}>
      {["ROLE", "TYPE", "LEVEL", "TIME", "SCORE"].map(h => (
        <span key={h} style={{ fontSize: "10px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em" }}>{h}</span>
      ))}
    </div>

    {/* Table rows */}
    {sessionHistory.map((s, i) => {
      const p = pct(s.total, s.max);
      const sc = scoreColor(p / 10);
      return (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 60px 60px", padding: "12px 20px", borderBottom: i < sessionHistory.length - 1 ? `1px solid ${COLORS.border}` : "none", gap: "8px", alignItems: "center", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.surface}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.text, marginBottom: "2px" }}>{s.role}</div>
            <div style={{ fontSize: "11px", color: COLORS.textMuted }}>{s.questions} questions</div>
          </div>
          <span style={{ fontSize: "12px", color: COLORS.textSub }}>{s.type}</span>
          <span style={{ fontSize: "12px", color: diffColor(s.difficulty) }}>{s.difficulty}</span>
          <span style={{ fontSize: "12px", color: COLORS.textSub }}>{s.duration}m</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: sc }}>{p}%</span>
          </div>
        </div>
      );
    })}
  </div>
)}

          {/* ── SETUP ── */}
          {stage === "setup" && (
            <div className="fade-up">
              <div className="card" style={{ padding: "32px" }}>

                {/* Job Role */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "10px" }}>TARGET ROLE</label>
                  <input
                    placeholder="e.g. AI Engineer, Software Engineer, Product Manager"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startInterview()}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", fontSize: "15px" }}
                  />
                </div>

                {/* Interview Type */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "10px" }}>INTERVIEW TYPE</label>
                  <div className="toggle-group">
                    {interviewTypes.map(t => (
                      <button key={t} onClick={() => setInterviewType(t)} className={`toggle-btn ${interviewType === t ? "active" : ""}`}
                        style={interviewType === t ? { color: COLORS.primary } : {}}>
                        {t === "Technical" ? "💻 Technical" : t === "HR" ? "🤝 HR" : "🎯 Mixed"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "10px" }}>DIFFICULTY</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {difficulties.map(d => (
                      <button key={d} onClick={() => setDifficulty(d)}
                        style={{ flex: 1, padding: "12px", borderRadius: "12px", border: `1px solid ${difficulty === d ? diffColor(d) : COLORS.border}`, background: difficulty === d ? `rgba(${d === "Easy" ? "0,229,160" : d === "Medium" ? "255,179,71" : "255,71,87"},0.1)` : COLORS.surface, color: difficulty === d ? diffColor(d) : COLORS.textSub, fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s", boxShadow: difficulty === d ? `0 0 16px ${diffGlow(d)}` : "none" }}>
                        {d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "10px" }}>DURATION</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {durations.map(d => (
                      <button key={d} onClick={() => setDuration(d)}
                        style={{ flex: 1, padding: "12px", borderRadius: "12px", border: `1px solid ${duration === d ? COLORS.primary : COLORS.border}`, background: duration === d ? `rgba(108,99,255,0.15)` : COLORS.surface, color: duration === d ? COLORS.primary : COLORS.textSub, fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s", boxShadow: duration === d ? `0 0 16px ${COLORS.primaryGlow}` : "none" }}>
                        {d}<span style={{ fontSize: "11px", opacity: 0.7 }}>m</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resume Upload */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "10px" }}>RESUME <span style={{ color: COLORS.textMuted, fontWeight: "400" }}>— optional</span></label>
                  <div
                    onClick={() => fileRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && uploadResume(e.dataTransfer.files[0]); }}
                    style={{ border: `2px dashed ${resumeText ? COLORS.success : dragOver ? COLORS.primary : COLORS.border}`, borderRadius: "14px", padding: "24px", textAlign: "center", cursor: "pointer", background: resumeText ? "rgba(0,229,160,0.05)" : dragOver ? COLORS.primaryGlow : "transparent", transition: "all 0.2s" }}>
                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files[0] && uploadResume(e.target.files[0])} />
                    {resumeText ? (
                      <div>
                        <div style={{ fontSize: "24px", marginBottom: "6px" }}>✅</div>
                        <div style={{ color: COLORS.success, fontWeight: "600", fontSize: "14px" }}>{resumeName}</div>
                        <div style={{ color: COLORS.textMuted, fontSize: "12px", marginTop: "4px" }}>Resume loaded — questions will be personalized</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>📄</div>
                        <div style={{ color: COLORS.textSub, fontSize: "14px" }}>Drop your PDF here or click to browse</div>
                        <div style={{ color: COLORS.textMuted, fontSize: "12px", marginTop: "4px" }}>Enables personalized questions from your background</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div style={{ marginBottom: "28px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "10px" }}>JOB DESCRIPTION <span style={{ color: COLORS.textMuted, fontWeight: "400" }}>— optional</span></label>
                  <textarea
                    placeholder="Paste the JD here — AI will generate questions targeting exactly what this company wants..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", fontSize: "14px", resize: "vertical", borderColor: jobDescription ? COLORS.primary : COLORS.border }}
                  />
                  {jobDescription && <div style={{ color: COLORS.primary, fontSize: "12px", marginTop: "6px" }}>✦ JD active — questions will target this role specifically</div>}
                </div>

                {/* Start Button */}
                <button onClick={() => startInterview()} disabled={!jobRole || loading} className="btn-primary"
                  style={{ width: "100%", padding: "16px", borderRadius: "14px", fontSize: "16px", letterSpacing: "0.02em", boxShadow: jobRole ? `0 8px 32px ${COLORS.primaryGlow}` : "none" }}>
                  {loading ? "Preparing your interview..." : `Start ${duration}-Minute Interview →`}
                </button>

              </div>
            </div>
          )}

          {/* ── INTERVIEW ── */}
          {stage === "interview" && (
            <div className="fade-up">

              {/* Top bar */}
              <div className="card" style={{ padding: "14px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="chip" style={{ background: `rgba(108,99,255,0.15)`, color: COLORS.primary }}>{interviewType}</span>
                  <span className="chip" style={{ background: `rgba(${difficulty === "Easy" ? "0,229,160" : difficulty === "Medium" ? "255,179,71" : "255,71,87"},0.1)`, color: diffColor(difficulty) }}>{difficulty}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {timeExpired && <span style={{ fontSize: "11px", color: COLORS.danger, fontWeight: "600", animation: "timerWarning 1s ease infinite" }}>FINISH ANSWER</span>}
                  <span style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: "800", color: timerColor, textShadow: `0 0 20px ${timerColor}` }}>
                    {fmt(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Timer bar */}
              <div className="progress-bar" style={{ marginBottom: "20px" }}>
                <div className="progress-fill" style={{ width: `${timerPct}%`, background: `linear-gradient(90deg, ${timerColor}, ${timerColor}88)` }} />
              </div>

              {/* AI Avatar */}
              <div className="card" style={{ padding: "48px 24px", textAlign: "center", marginBottom: "16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: speaking ? `radial-gradient(ellipse at center, rgba(108,99,255,0.08) 0%, transparent 70%)` : listening ? `radial-gradient(ellipse at center, rgba(0,229,160,0.06) 0%, transparent 70%)` : "none", transition: "all 0.5s ease" }} />

                {/* Avatar rings */}
                <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 24px" }}>
                  {(speaking || listening) && (
                    <>
                      <div style={{ position: "absolute", inset: "-16px", borderRadius: "50%", border: `2px solid ${speaking ? COLORS.primary : COLORS.success}`, opacity: 0.3, animation: "pulse-ring 2s ease-in-out infinite" }} />
                      <div style={{ position: "absolute", inset: "-32px", borderRadius: "50%", border: `1px solid ${speaking ? COLORS.primary : COLORS.success}`, opacity: 0.15, animation: "pulse-ring2 2s ease-in-out infinite 0.3s" }} />
                    </>
                  )}
                  <div style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: speaking ? `linear-gradient(135deg, ${COLORS.primary}, #8B5CF6)` : listening ? `linear-gradient(135deg, ${COLORS.success}, #00B894)` : `linear-gradient(135deg, #1E2D4A, #141B2D)`,
                    border: `2px solid ${speaking ? COLORS.primary : listening ? COLORS.success : COLORS.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "44px",
                    boxShadow: speaking ? `0 0 40px ${COLORS.primaryGlow}` : listening ? `0 0 40px ${COLORS.successGlow}` : "none",
                    transition: "all 0.4s ease",
                    animation: speaking || listening ? "float 3s ease-in-out infinite" : "none"
                  }}>
                    {speaking ? "🎙️" : listening ? "👂" : "🤖"}
                  </div>
                </div>

                {/* Sound bars when listening */}
                {listening && (
                  <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "16px" }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                      <div key={i} className="sound-bar" style={{ animationDelay: `${i * 0.1}s`, animationDuration: `${0.6 + i * 0.1}s` }} />
                    ))}
                  </div>
                )}

                <div style={{ fontSize: "16px", fontWeight: "600", color: speaking ? COLORS.primary : listening ? COLORS.success : COLORS.textSub, marginBottom: "6px", transition: "color 0.3s" }}>
                  {speaking ? "AI Interviewer is speaking..." : listening ? "Listening to your answer..." : aiStatus}
                </div>
                {questionNum > 0 && (
                  <div style={{ fontSize: "12px", color: COLORS.textMuted }}>
                    Question {questionNum} · {allQA.length} answered
                  </div>
                )}
              </div>

              {/* Transcript */}
              {(listening || currentTranscript) && (
                <div className="card" style={{ padding: "16px 20px", marginBottom: "16px", borderColor: COLORS.success + "44" }}>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: COLORS.success, letterSpacing: "0.08em", marginBottom: "8px" }}>YOUR ANSWER</div>
                  <p style={{ color: COLORS.text, fontSize: "14px", lineHeight: "1.7", minHeight: "36px" }}>
                    {currentTranscript || <span style={{ color: COLORS.textMuted, fontStyle: "italic" }}>Start speaking...</span>}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                {!listening ? (
                  <button onClick={startListening} disabled={speaking || loading} className="btn-primary"
                    style={{ flex: 1, padding: "18px", borderRadius: "14px", fontSize: "16px", boxShadow: !speaking && !loading ? `0 8px 32px ${COLORS.primaryGlow}` : "none" }}>
                    🎤 Speak Answer
                  </button>
                ) : (
                  <button onClick={endAnswer} className="btn-success"
                    style={{ flex: 1, padding: "18px", borderRadius: "14px", fontSize: "16px", boxShadow: `0 8px 32px ${COLORS.successGlow}` }}>
                    ✅ End Answer
                  </button>
                )}
                <button onClick={restart} className="btn-ghost" style={{ padding: "18px 20px", borderRadius: "14px", fontSize: "14px" }}>Exit</button>
              </div>
            </div>
          )}

          {/* ── EVALUATING ── */}
          {stage === "evaluating" && (
            <div className="card fade-up" style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>Evaluating your performance</h2>
              <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>Analysing {allQA.length} answers with AI — this takes a moment</p>
            </div>
          )}

          {/* ── RESULTS ── */}
          {stage === "results" && results && (
            <div className="fade-up">

              {/* Score card */}
              <div className="card" style={{ padding: "36px", textAlign: "center", marginBottom: "20px", background: `linear-gradient(135deg, ${COLORS.card}, rgba(${results.total_score / results.max_score >= 0.7 ? "0,229,160" : results.total_score / results.max_score >= 0.5 ? "255,179,71" : "255,71,87"},0.05))`, borderColor: scoreColor((results.total_score / results.max_score) * 10) + "44" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.1em", marginBottom: "16px" }}>INTERVIEW COMPLETE · {duration} MIN · {results.results.length} QUESTIONS</div>
                <div style={{ fontSize: "72px", fontWeight: "900", fontFamily: "'Space Grotesk', sans-serif", color: scoreColor((results.total_score / results.max_score) * 10), textShadow: `0 0 40px ${scoreGlow((results.total_score / results.max_score) * 10)}`, lineHeight: 1, marginBottom: "8px" }}>
                  {results.total_score}<span style={{ fontSize: "32px", color: COLORS.textMuted }}>/{results.max_score}</span>
                </div>
                <div style={{ fontSize: "14px", color: COLORS.textSub, marginBottom: "16px" }}>{pct(results.total_score, results.max_score)}% · {interviewType} · {difficulty}</div>
                <div className="chip" style={{ background: scoreGlow((results.total_score / results.max_score) * 10), color: scoreColor((results.total_score / results.max_score) * 10), fontSize: "13px", padding: "6px 16px" }}>
                  {results.total_score >= results.max_score * 0.7 ? "🏆 Interview Ready!" : results.total_score >= results.max_score * 0.5 ? "📈 Keep Practicing" : "💪 You'll Get There"}
                </div>
              </div>

              {/* Continue options */}
              {showContinueOptions && (
                <div className="card" style={{ padding: "24px", marginBottom: "20px", borderColor: COLORS.primary + "44" }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px" }}>Continue Interview</div>
                  <div style={{ fontSize: "13px", color: COLORS.textMuted, marginBottom: "20px" }}>Same role, resume & JD · Adjust difficulty or duration</div>

                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "8px" }}>DIFFICULTY</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    {difficulties.map(d => (
                      <button key={d} onClick={() => setContinueDifficulty(d)}
                        style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `1px solid ${continueDifficulty === d ? diffColor(d) : COLORS.border}`, background: continueDifficulty === d ? `rgba(${d === "Easy" ? "0,229,160" : d === "Medium" ? "255,179,71" : "255,71,87"},0.1)` : COLORS.surface, color: continueDifficulty === d ? diffColor(d) : COLORS.textSub, fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>
                        {d}
                      </button>
                    ))}
                  </div>

                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "8px" }}>DURATION</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                    {durations.map(d => (
                      <button key={d} onClick={() => setContinueDuration(d)}
                        style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `1px solid ${continueDuration === d ? COLORS.primary : COLORS.border}`, background: continueDuration === d ? "rgba(108,99,255,0.15)" : COLORS.surface, color: continueDuration === d ? COLORS.primary : COLORS.textSub, fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>
                        {d}m
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => { setDifficulty(continueDifficulty); setDuration(continueDuration); startInterview(continueDifficulty, continueDuration); }}
                      disabled={!continueDifficulty || !continueDuration} className="btn-primary"
                      style={{ flex: 1, padding: "13px", borderRadius: "12px", fontSize: "14px" }}>
                      🚀 Launch Interview
                    </button>
                    <button onClick={() => setShowContinueOptions(false)} className="btn-ghost" style={{ padding: "13px 16px", borderRadius: "12px", fontSize: "14px" }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Per question feedback */}
              {results.results.map((r, i) => (
                <div key={i} className="card" style={{ padding: "24px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                      <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: `linear-gradient(135deg, ${COLORS.primary}, #8B5CF6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0, color: "white" }}>{i + 1}</span>
                      <p style={{ color: COLORS.text, fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{r.question}</p>
                    </div>
                    <div style={{ textAlign: "center", marginLeft: "16px", flexShrink: 0 }}>
                      <div style={{ fontSize: "26px", fontWeight: "800", fontFamily: "'Space Grotesk', sans-serif", color: scoreColor(r.score), textShadow: `0 0 16px ${scoreGlow(r.score)}` }}>{r.score}/10</div>
                      <div style={{ fontSize: "10px", fontWeight: "600", color: scoreColor(r.score), letterSpacing: "0.05em" }}>{scoreLabel(r.score).toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ background: COLORS.surface, borderRadius: "10px", padding: "12px 14px", marginBottom: "10px", borderLeft: `3px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: "10px", fontWeight: "600", color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: "6px" }}>YOUR ANSWER</div>
                    <p style={{ color: COLORS.textSub, fontSize: "13px", margin: 0, lineHeight: "1.6" }}>{r.answer}</p>
                  </div>
                  <pre style={{ whiteSpace: "pre-wrap", color: COLORS.textSub, fontSize: "13px", lineHeight: "1.8", margin: 0, background: COLORS.surface, padding: "14px", borderRadius: "10px", fontFamily: "'Inter', sans-serif" }}>{r.feedback}</pre>
                </div>
              ))}

              {/* Bottom action buttons */}
              {!showContinueOptions && (
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button onClick={() => { setContinueDifficulty(difficulty); setContinueDuration(duration); setShowContinueOptions(true); }}
                    className="btn-success" style={{ flex: 1, padding: "15px", borderRadius: "14px", fontSize: "15px" }}>
                    ▶ Continue Interview
                  </button>
                  <button onClick={restart} className="btn-ghost" style={{ flex: 1, padding: "15px", borderRadius: "14px", fontSize: "15px" }}>
                    Start New
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}