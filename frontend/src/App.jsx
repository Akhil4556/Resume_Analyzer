import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://re-a5f04dd6eec6467594872f0a528616a2.ecs.ap-south-1.on.aws";

function parseScore(feedback) {
  const match = feedback.match(/(\d{1,3})\s*(?:\/\s*100)?/);
  return match ? Math.min(parseInt(match[1]), 100) : 75;
}

function parseSection(feedback, heading) {
  const patterns = [
    new RegExp(`\\*\\*${heading}[:\\*]*\\*?\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`, "i"),
    new RegExp(`${heading}[:\\n]+([\\s\\S]*?)(?=\\n[A-Z*#]|$)`, "i"),
  ];
  for (const p of patterns) {
    const m = feedback.match(p);
    if (m) {
      return m[1]
        .split("\n")
        .map((l) => l.replace(/^[\s\-\*\d\.]+/, "").trim())
        .filter((l) => l.length > 4)
        .slice(0, 5);
    }
  }
  return [];
}

function ScoreCircle({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Great Job! 🎉" : score >= 60 ? "Good Work! 💪" : "Needs Work 🔧";

  return (
    <div className="score-circle-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="score-number">
        <span style={{ color }}>{score}</span>
        <small>/100</small>
      </div>
      <p className="score-label" style={{ color }}>{label}</p>
      <p className="score-sub">Your resume is strong, but there's always room to improve.</p>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
    else alert("Please upload a PDF file only.");
  };

  const uploadResume = async () => {
    if (!file) { alert("Please select a resume"); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_URL}/upload-resume/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;
      setResult(data);
      setHistory((prev) => [
        { name: file.name, date: new Date().toLocaleString(), score: parseScore(data.ai_feedback), data },
        ...prev.slice(0, 4),
      ]);
    } catch {
      alert("Error uploading resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const score = result ? parseScore(result.ai_feedback) : null;
  const strengths = result ? parseSection(result.ai_feedback, "Top Strengths") : [];
  const missing = result ? parseSection(result.ai_feedback, "Missing Skills") : [];
  const suggestions = result ? parseSection(result.ai_feedback, "Improvement Suggestions") : [];
  const careers = result ? parseSection(result.ai_feedback, "Career Recommendations") : [];

  const navItems = [
    { icon: "🏠", label: "Dashboard" },
    { icon: "📊", label: "Analyzer" },
    { icon: "🕐", label: "History" },
    { icon: "👤", label: "Profile" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className={`app-root ${darkMode ? "dark" : "light"}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">AI Resume Analyzer</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? "active" : ""}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-built">
          <p className="built-title">Built with</p>
          {["⚛️ React", "⚡ FastAPI", "☁️ AWS", "🪣 S3", "🐳 ECS", "🤗 Hugging Face", "📊 CloudWatch"].map((t) => (
            <div key={t} className="built-item">{t}</div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div />
          <div className="topbar-right">
            <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <div className="avatar">A</div>
            <span className="username">Akhileshwar ▾</span>
          </div>
        </header>

        {/* Upload Card */}
        <section className="upload-card">
          <div className="upload-icon">📄</div>
          <h2>Upload Your Resume</h2>
          <p className="upload-sub">Upload your resume in PDF format and get AI-powered insights</p>

          <div
            className={`dropzone ${dragging ? "dragging" : ""}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          >
            {file ? (
              <p className="file-chosen">✅ {file.name}</p>
            ) : (
              <>
                <p>Drag & Drop your resume here</p>
                <p className="or-text">or</p>
                <button className="choose-btn" onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>
                  Choose File
                </button>
                <p className="file-hint">PDF only • Max size 10MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf" hidden onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <button className="analyze-btn" onClick={uploadResume} disabled={loading}>
            {loading ? <span className="spinner" /> : "✨"} {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </section>

        {/* Results */}
        {result && (
          <section className="results-grid">
            {/* Score */}
            <div className="result-card score-card">
              <h3>Resume Score</h3>
              <ScoreCircle score={score} />
            </div>

            {/* Strengths */}
            <div className="result-card">
              <h3 className="card-title green">🛡️ Top Strengths</h3>
              <ul className="check-list">
                {strengths.map((s, i) => <li key={i}><span className="check">✓</span>{s}</li>)}
              </ul>
            </div>

            {/* Missing Skills */}
            <div className="result-card">
              <h3 className="card-title orange">⚠️ Missing Skills</h3>
              <ul className="dot-list">
                {missing.map((s, i) => <li key={i}><span className="dot red" />  {s}</li>)}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="result-card">
              <h3 className="card-title yellow">💡 Suggestions</h3>
              <ul className="dot-list">
                {suggestions.map((s, i) => <li key={i}><span className="dot yellow-dot" />{s}</li>)}
              </ul>
            </div>

            {/* Career Matches */}
            <div className="result-card">
              <h3 className="card-title blue">💼 Career Matches</h3>
              {careers.map((c, i) => (
                <div key={i} className="career-item">
                  <div className="career-row">
                    <span>{c.replace(/^\d+\.\s*/, "")}</span>
                    <span className="career-pct" style={{ color: ["#22c55e","#3b82f6","#f59e0b"][i % 3] }}>
                      {[90, 85, 75, 70, 65][i]}%
                    </span>
                  </div>
                  <div className="career-bar-bg">
                    <div className="career-bar" style={{
                      width: `${[90, 85, 75, 70, 65][i]}%`,
                      background: ["#22c55e","#3b82f6","#f59e0b"][i % 3]
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* History */}
        {history.length > 0 && (
          <section className="history-section">
            <div className="history-header">
              <h3>Recent Analyses</h3>
              <button className="view-all-btn">View All →</button>
            </div>
            {history.map((h, i) => (
              <div key={i} className="history-item" onClick={() => setResult(h.data)}>
                <span className="pdf-icon">📄</span>
                <div className="history-info">
                  <p className="history-name">{h.name}</p>
                  <p className="history-date">Analyzed on {h.date}</p>
                </div>
                <div className="history-score" style={{
                  borderColor: h.score >= 80 ? "#22c55e" : h.score >= 60 ? "#f59e0b" : "#ef4444",
                  color: h.score >= 80 ? "#22c55e" : h.score >= 60 ? "#f59e0b" : "#ef4444"
                }}>
                  {h.score}
                </div>
                <span className="chevron">›</span>
              </div>
            ))}
          </section>
        )}

        <footer className="footer">
          <p>© 2026 AI Resume Analyzer. All rights reserved.</p>
          <div className="footer-icons">
            <span>🐙</span><span>💼</span><span>🌐</span>
          </div>
        </footer>
      </main>
    </div>
  );
}