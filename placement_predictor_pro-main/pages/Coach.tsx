import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StudentProfile } from "../types";
import { calculatePlacementProb } from "../services/predictionEngine";
import { getSmartRecommendations } from "../services/geminiService";

interface CoachProps {
  profile: StudentProfile;
}

const PERSONAS = [
  { id: "strategist", name: "Strategist", emoji: "♟️", desc: "Focuses on long-term career growth" },
  { id: "interviewer", name: "Interviewer", emoji: "🎙️", desc: "Practical, round-by-round tactical advice" },
  { id: "mentor", name: "Mentor", emoji: "🧘", desc: "Holistic growth and work-life balance" },
];

const Coach: React.FC<CoachProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0].id);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) Calculate placement probability from your local engine
      const result = calculatePlacementProb(profile);

      // 2) Get Gemini recommendations (from your backend)
      const rec = await getSmartRecommendations(profile, result);

      if (!rec) {
        setError("Failed to get recommendations. Please try again.");
        setReport(null);
        return;
      }

      // ✅ IMPORTANT: set report from "rec" directly (not from state)
      setReport(rec);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Something went wrong while generating the strategy.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Button explicitly to Dashboard */}
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Command Center */}
        <aside className="w-full lg:w-[360px] lg:sticky lg:top-24 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
                🤖
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none">AI Coach</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Neural v4.2</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">
                  Choose Advisor
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPersona(p.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                        selectedPersona === p.id
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100/50 dark:shadow-none"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:border-indigo-300"
                      }`}
                    >
                      <span className="text-2xl">{p.emoji}</span>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider leading-none">{p.name}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            selectedPersona === p.id ? "text-indigo-100" : "text-slate-500"
                          }`}
                        >
                          {p.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {!report && !loading && (
                <button
                  onClick={generateReport}
                  className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-black dark:hover:bg-indigo-700 transition-all hover:-translate-y-1"
                >
                  Generate Strategy
                </button>
              )}

              {report && (
                <button
                  onClick={() => {
                    setReport(null);
                    setError(null);
                  }}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl border border-slate-200 dark:border-slate-700 hover:text-rose-600 transition-all"
                >
                  Clear Analysis
                </button>
              )}
            </div>
          </div>

          <div className="p-8 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[40px] border border-indigo-200/50 dark:border-indigo-900/30">
            <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
              Current Profile
            </h4>
            <div className="space-y-3">
              {[
                { label: "Academic Score", val: `${profile.cgpa}/10` },
                { label: "Tech Proficiency", val: `${Math.round((profile.codingDSA + profile.codingDev) / 2)}%` },
                { label: "Portfolio Units", val: profile.projects + profile.internships },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{stat.label}</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Insights Feed */}
        <main className="flex-1 w-full min-h-[600px]">
          {loading ? (
            <div className="bg-white dark:bg-slate-900 p-20 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center h-full">
              <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 border-8 border-slate-100 dark:border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🧩</div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Drafting Masterplan</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto text-lg leading-relaxed">
                Gemini is analyzing market benchmarks and your specific growth vectors...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[48px] border border-rose-200 dark:border-rose-900 shadow-xl text-center">
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mb-3">Something went wrong</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{error}</p>
              <button
                onClick={generateReport}
                className="mt-8 px-6 py-3 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-700 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : report ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
              {/* Analysis Hero */}
              <section className="bg-slate-900 dark:bg-indigo-950 p-12 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">
                  Foundational Analysis
                </h3>
                <p className="text-3xl font-bold leading-tight tracking-tight italic">"{report.analysis}"</p>
              </section>

              {/* Roadmap Grid */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center text-xl">
                    🚀
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Growth Roadmap</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.tips?.map((tip: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-900 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black rounded-lg uppercase tracking-widest">
                          {tip.category}
                        </span>
                        <div
                          className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                            tip.priority === "High" ? "text-rose-600" : "text-amber-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              tip.priority === "High" ? "bg-rose-600 animate-pulse" : "bg-amber-600"
                            }`}
                          ></span>
                          {tip.priority}
                        </div>
                      </div>
                      <p className="text-slate-800 dark:text-slate-300 text-lg leading-relaxed font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tip.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Companies */}
              <section className="bg-white dark:bg-slate-900 p-12 rounded-[48px] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Target Ecosystems</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {report.idealCompanies?.map((comp: string, idx: number) => (
                    <div
                      key={idx}
                      className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 rounded-[20px] text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-indigo-500 transition-all cursor-default"
                    >
                      {comp}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-24 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center h-full min-h-[600px] group">
              <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-6xl mb-10 group-hover:scale-110 transition-all">
                ✨
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Strategy Terminal</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
                Select a coaching persona and trigger the neural analysis to build your professional placement roadmap.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Coach;
