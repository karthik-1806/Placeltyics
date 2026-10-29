import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StudentProfile } from "../types";
import { calculatePlacementProb } from "../services/predictionEngine";
import { getSmartRecommendations, RecommendationResponse } from "../services/geminiService";

interface CoachProps {
  profile: StudentProfile;
}

const PERSONAS = [
  {
    id: "strategist",
    name: "Strategic Advisor",
    role: "Placement Strategist",
    emoji: "♟️",
    focus: "Corporate Targeting & Market Positioning",
    desc: "Evaluates tier eligibility, compensation bracket differentiation, and institutional campus hiring trends."
  },
  {
    id: "interviewer",
    name: "Technical Interviewer",
    role: "Senior Engineering Assessor",
    emoji: "🎙️",
    focus: "Technical Rigor & Code Defense",
    desc: "Simulates engineering test hurdles, system design scrutiny, and algorithmic problem-solving defense."
  },
  {
    id: "mentor",
    name: "Academic Mentor",
    role: "Developmental Counselor",
    emoji: "🧘",
    focus: "Study Architecture & Cognitive Balance",
    desc: "Structures sustainable study cadence, core CS foundation building, and test anxiety containment."
  },
];

const Coach: React.FC<CoachProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RecommendationResponse | null>(null);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0].id);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activePersonaObj = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      // 1) Calculate baseline placement readiness
      const result = calculatePlacementProb(profile);

      // 2) Request personalized guidance from backend with active persona
      const rec = await getSmartRecommendations(profile, result, selectedPersona);

      if (!rec || !rec.analysis) {
        throw new Error("Unable to retrieve recommendations from the service. Please verify server connection and try again.");
      }

      setReport(rec);
    } catch (e: any) {
      console.error("Coach Generation Error:", e);
      setError(e?.message || "Failed to generate coaching strategy. Please try again.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyActionItems = () => {
    if (!report || !report.tips) return;
    const text = [
      `Placeltyics AI Advisory Plan — ${activePersonaObj.name}`,
      `Generated for ${profile.name || "Student"} | Branch: ${profile.branch} | Year: ${profile.year}`,
      "",
      `Executive Summary:`,
      `"${report.analysis}"`,
      "",
      `Priority Milestones:`,
      ...report.tips.map((t, i) => `${i + 1}. [${t.priority.toUpperCase()}] (${t.category}): ${t.tip}`),
      "",
      `Target Ecosystems: ${report.idealCompanies ? report.idealCompanies.join(", ") : "N/A"}`
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
        <span className="badge-indigo">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          AI Career Intelligence Coach
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Placement Intelligence Advisory Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Synthesize personalized preparation roadmaps, priority milestones, and corporate targeting tactics configured to your profile.
        </p>
      </div>

      {/* Main Grid: Control Panel Left, Feedback Feed Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Persona Configuration */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bento-card space-y-5">
            <div className="border-b border-slate-200/80 dark:border-white/10 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Perspective Selection
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mt-0.5">
                Choose Advisory Lens
              </h2>
            </div>

            <div className="space-y-3">
              {PERSONAS.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPersona(p.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-500/30"
                        : "bg-slate-50/60 dark:bg-white/5 border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.emoji}</span>
                        <div>
                          <span className={`text-xs font-bold block ${isSelected ? "text-indigo-900 dark:text-indigo-200" : "text-slate-900 dark:text-white"}`}>
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                            {p.role}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="badge-indigo text-[10px] py-0.5 px-2">Active</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Select</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={generateReport}
                disabled={loading}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Synthesizing Strategy...
                  </>
                ) : report ? (
                  `Regenerate Plan (${activePersonaObj.name}) →`
                ) : (
                  `Generate Strategy (${activePersonaObj.name}) →`
                )}
              </button>
            </div>
          </div>

          {/* Profile Metrics Snapshot */}
          <div className="bento-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Evaluation Snapshot
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live Inputs</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-600 dark:text-slate-400">Academic Standing</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">{profile.cgpa} / 10 CGPA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-600 dark:text-slate-400">DSA & Development</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">{profile.codingDSA}% / {profile.codingDev}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-600 dark:text-slate-400">Backlogs Status</span>
                <span className={`font-bold tabular-nums font-mono ${profile.backlogs > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {profile.backlogs === 0 ? "0 Active (Clear)" : `${profile.backlogs} Active Backlog${profile.backlogs > 1 ? 's' : ''}`}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Practical Portfolio</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">{profile.projects} Projects • {profile.internships} Internships</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Guidance Stream */}
        <main className="lg:col-span-8 min-h-[500px]">
          {loading ? (
            <div className="bento-card flex flex-col items-center justify-center text-center p-14 min-h-[460px] space-y-5">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 animate-spin"></div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Consulting {activePersonaObj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Analyzing current recruitment criteria, factorizing skill vectors, and tailoring strategic priorities...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bento-card border-rose-200 dark:border-rose-900/60 p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl mx-auto">
                ⚠️
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Advisory Service Unavailable</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">{error}</p>
              <button
                type="button"
                onClick={generateReport}
                className="btn-primary text-xs py-2 px-5"
              >
                Retry Generation
              </button>
            </div>
          ) : report ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Executive Assessment Card */}
              <div className="bento-card-hero p-6 sm:p-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="badge-indigo text-[11px]">
                      {activePersonaObj.emoji} {activePersonaObj.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Institutional Strategy
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyActionItems}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>📋</span>
                    {copied ? "Copied to Clipboard!" : "Copy Action Items"}
                  </button>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Executive Strategic Assessment
                  </span>
                  <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-800 dark:text-slate-200 italic">
                    "{report.analysis}"
                  </p>
                </div>
              </div>

              {/* Actionable Milestones */}
              <div className="bento-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Actionable Roadmap Priorities
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Target interventions calibrated for recruitment clearance</p>
                  </div>
                  <span className="badge-neutral text-[10px] font-mono">
                    {report.tips?.length || 0} Strategic Milestones
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {report.tips?.map((tip, idx) => {
                    const isHigh = tip.priority === "High" || tip.priority?.toLowerCase() === "high";
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {tip.category}
                          </span>
                          <span
                            className={isHigh ? "badge-rose text-[10px] py-0.5" : "badge-amber text-[10px] py-0.5"}
                          >
                            {tip.priority} Priority
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {tip.tip}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Target Ecosystems */}
              {report.idealCompanies && report.idealCompanies.length > 0 && (
                <div className="bento-card space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-2.5">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Target Corporate Ecosystems
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Employers aligned with your current readiness tier</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Campus Drives</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {report.idealCompanies.map((comp, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5"
                      >
                        <span>🏢</span> {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bento-card flex flex-col items-center justify-center text-center p-14 min-h-[460px] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Personalized Placement Strategy Awaiting
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Select your preferred advisory perspective on the left and click Generate Strategy to create customized guidance for your recruitment goals.
                </p>
              </div>
              <button
                type="button"
                onClick={generateReport}
                className="btn-primary text-xs py-3 px-6 mt-2"
              >
                Generate Strategy with {activePersonaObj.name} →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Coach;
