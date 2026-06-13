import { useState } from "react";

function App() {
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("setup");
  const [sessionHistory, setSessionHistory] = useState([]);
  const [allPreviousQuestions, setAllPreviousQuestions] = useState([]);

  const difficulties = ["Easy", "Medium", "Hard"];

  const startInterview = async () => {
    if (!jobRole) return;
    setLoading(true);
    const previousStr = allPreviousQuestions.join(" | ");
    const res = await fetch(`http://127.0.0.1:8000/start-interview?job_role=${encodeURIComponent(jobRole)}&difficulty=${difficulty}&previous=${encodeURIComponent(previousStr)}`);
    const data = await res.json();
    setQuestions(data.questions);
    setAllPreviousQuestions(prev => [...prev, ...data.questions]);
    setAnswers({});
    setResults(null);
    setStage("interview");
    setLoading(false);
  };

  const submitInterview = async () => {
    const unanswered = questions.filter((_, i) => !answers[i] || answers[i].trim() === "");
    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting!");
      return;
    }
    setLoading(true);
    const qa_pairs = questions.map((q, i) => ({ question: q, answer: answers[i] }));
    const res = await fetch("http://127.0.0.1:8000/evaluate-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_role: jobRole, qa_pairs, difficulty }),
    });
    const data = await res.json();
    setResults(data);
    setSessionHistory(prev => [...prev, {
      role: jobRole,
      difficulty,
      total: data.total_score,
      max: data.max_score,
      time: new Date().toLocaleTimeString()
    }]);
    setStage("results");
    setLoading(false);
  };

  const restart = () => {
    setJobRole("");
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setStage("setup");
  };

  const fullReset = () => {
    restart();
    setAllPreviousQuestions([]);
    setSessionHistory([]);
  };

  const scoreColor = (s) => s >= 7 ? "#10b981" : s >= 4 ? "#f59e0b" : "#ef4444";
  const scoreLabel = (s) => s >= 7 ? "Great!" : s >= 4 ? "Okay" : "Needs work";
  const pct = (s, m) => Math.round((s / m) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "Inter, sans-serif", padding: "30px 20px" }}>
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#6366f1", margin: 0 }}>AI Interview Coach</h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Practice. Improve. Get hired.</p>
        </div>

        {/* Progress Graph */}
        {sessionHistory.length > 0 && (
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ color: "#e2e8f0", margin: 0, fontSize: "15px" }}>Session Progress</h3>
              <button onClick={fullReset}
                style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: "12px", cursor: "pointer" }}>
                Reset All
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
              {sessionHistory.map((s, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>{pct(s.total, s.max)}%</span>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    height: `${pct(s.total, s.max) * 0.6}px`,
                    background: pct(s.total, s.max) >= 70 ? "#10b981" : pct(s.total, s.max) >= 50 ? "#f59e0b" : "#ef4444",
                    minHeight: "4px"
                  }} />
                  <span style={{ fontSize: "9px", color: "#64748b" }}>#{i + 1}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
              {sessionHistory.map((s, i) => (
                <span key={i} style={{ fontSize: "11px", color: "#64748b" }}>
                  #{i + 1} {s.role} ({s.difficulty}) — {s.total}/{s.max}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SETUP */}
        {stage === "setup" && (
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px" }}>
            <h2 style={{ color: "#e2e8f0", margin: "0 0 20px", fontSize: "18px" }}>Start your mock interview</h2>
            <input
              placeholder="Enter job role (e.g. AI Engineer, Python Developer)"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startInterview()}
              style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: "15px", marginBottom: "20px", boxSizing: "border-box" }}
            />

            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 10px" }}>Difficulty</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {difficulties.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600",
                    background: difficulty === d ? (d === "Easy" ? "#10b981" : d === "Medium" ? "#f59e0b" : "#ef4444") : "#334155",
                    color: difficulty === d ? "white" : "#94a3b8"
                  }}>
                  {d}
                </button>
              ))}
            </div>

            <button onClick={startInterview} disabled={!jobRole || loading}
              style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: !jobRole ? "#334155" : "#6366f1", color: "white", fontSize: "15px", fontWeight: "600", cursor: !jobRole ? "not-allowed" : "pointer" }}>
              {loading ? "Loading questions..." : "Start Interview →"}
            </button>

            {allPreviousQuestions.length > 0 && (
              <p style={{ color: "#64748b", fontSize: "12px", textAlign: "center", marginTop: "12px", marginBottom: 0 }}>
                {allPreviousQuestions.length} questions already practiced — new ones will be different!
              </p>
            )}
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center", marginTop: "8px", marginBottom: 0 }}>
              5 questions · {difficulty} level
            </p>
          </div>
        )}

        {/* INTERVIEW */}
        {stage === "interview" && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                Role: <span style={{ color: "#6366f1", fontWeight: "600" }}>{jobRole}</span>
                <span style={{ marginLeft: "10px", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: "600",
                  background: difficulty === "Easy" ? "#064e3b" : difficulty === "Medium" ? "#451a03" : "#450a0a",
                  color: difficulty === "Easy" ? "#10b981" : difficulty === "Medium" ? "#f59e0b" : "#ef4444"
                }}>{difficulty}</span>
              </span>
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>{Object.keys(answers).filter(k => answers[k]?.trim()).length} / {questions.length} answered</span>
            </div>

            {questions.map((q, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px" }}>
                  <span style={{ background: "#6366f1", color: "white", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</span>
                  <p style={{ color: "#e2e8f0", margin: 0, lineHeight: "1.6", fontSize: "15px" }}>{q}</p>
                </div>
                <textarea
                  placeholder={`Your answer for Q${i + 1}...`}
                  value={answers[i] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                  rows={4}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: answers[i]?.trim() ? "1px solid #10b981" : "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <button onClick={submitInterview} disabled={loading}
              style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "none", background: loading ? "#334155" : "#10b981", color: "white", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px" }}>
              {loading ? "Evaluating your answers..." : "Submit & Get Feedback →"}
            </button>
          </div>
        )}

        {/* RESULTS */}
        {stage === "results" && results && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", textAlign: "center", marginBottom: "24px" }}>
              <p style={{ color: "#94a3b8", margin: "0 0 8px", fontSize: "14px" }}>Total Score</p>
              <div style={{ fontSize: "56px", fontWeight: "700", color: scoreColor((results.total_score / results.max_score) * 10) }}>
                {results.total_score}/{results.max_score}
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#94a3b8" }}>
                {pct(results.total_score, results.max_score)}% · {difficulty} level
              </div>
              <p style={{ color: "#94a3b8", margin: "8px 0 0", fontSize: "14px" }}>
                {results.total_score >= 35 ? "Excellent! You're interview ready!" :
                  results.total_score >= 25 ? "Good performance. Keep practicing!" :
                    "Keep practicing. You'll get there!"}
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
              Next Interview (New Questions)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;