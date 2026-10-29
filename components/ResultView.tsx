import React from "react";
import { Link } from "react-router-dom";
import { PredictionResult } from "../types";

interface ResultViewProps {
  result: PredictionResult;
}

const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const percent = Math.round(result.probability * 100);

  const size = 160;
  const center = size / 2;
  const strokeWidth = 12;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - result.probability);

  const getStatusBadge = () => {
    switch (result.eligibilityStatus) {
      case "EL_HIGH":
        return <span className="badge-emerald font-bold">Platinum Readiness</span>;
      case "EL_MEDIUM":
        return <span className="badge-indigo font-bold">Elite Candidate</span>;
      case "EL_LOW":
        return <span className="badge-amber font-bold">Growth Potential</span>;
      case "INELIGIBLE":
        return <span className="badge-rose font-bold">Action Required</span>;
    }
  };

  const getGaugeColor = () => {
    if (result.probability >= 0.75) return "#10b981"; // emerald
    if (result.probability >= 0.55) return "#6366f1"; // indigo
    if (result.probability >= 0.40) return "#f59e0b"; // amber
    return "#ef4444"; // rose
  };

  return (
    <div className="bento-card-hero space-y-6 animate-in fade-in duration-300">
      {/* Verdict Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Assessment Outcome
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight">
            {result.readinessLabel || "Placement Readiness"}
          </h2>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Circular Progress & Key Metric */}
      <div className="flex flex-col sm:flex-row items-center gap-6 py-1">
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-white/10"
              strokeWidth={strokeWidth}
            />
            {/* Animated Progress Stroke */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getGaugeColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {percent}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Readiness Score
            </span>
          </div>
        </div>

        {/* Diagnostic Feedback */}
        <div className="flex-1 space-y-2.5 text-center sm:text-left">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Executive Diagnostic Summary
          </h3>
          <p className="text-xs font-normal text-slate-700 dark:text-slate-300 leading-relaxed">
            {result.message}
          </p>
          <div className="pt-1.5 flex flex-wrap gap-2 justify-center sm:justify-start">
            <Link to="/coach" className="btn-primary text-xs py-2 px-3.5">
              Launch AI Coach →
            </Link>
            <Link to="/insights" className="btn-secondary text-xs py-2 px-3.5">
              View Analytics DNA
            </Link>
          </div>
        </div>
      </div>

      {/* Multi-Vector Score Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Competency Breakdown
          </h3>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">Normalized Scale (0 – 100)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Academics</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {result.scoreBreakdown.academic}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(result.scoreBreakdown.academic, 100)}%` }}></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Technical Skills</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {result.scoreBreakdown.technical}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(result.scoreBreakdown.technical, 100)}%` }}></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Practical Portfolio</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {result.scoreBreakdown.profile}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(result.scoreBreakdown.profile, 100)}%` }}></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Communication</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {result.scoreBreakdown.softSkills}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(result.scoreBreakdown.softSkills, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Eligibility Tiers */}
      {result.companyEligibility && result.companyEligibility.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Corporate Recruitment Criteria
            </h3>
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">Tier Benchmarks</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {result.companyEligibility.map((comp) => {
              const statusBadge =
                comp.status === "ELIGIBLE" ? (
                  <span className="badge-emerald text-[11px] py-0.5">Eligible</span>
                ) : comp.status === "NEAR_THRESHOLD" ? (
                  <span className="badge-amber text-[11px] py-0.5">Near Cutoff</span>
                ) : (
                  <span className="badge-rose text-[11px] py-0.5">Ineligible</span>
                );

              return (
                <div
                  key={comp.name}
                  className="p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{comp.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">({comp.category})</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{comp.reason}</p>
                  </div>
                  <div className="shrink-0">{statusBadge}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Honest Scientific Caveat */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5">
        <span className="text-amber-600 dark:text-amber-400 text-sm leading-none mt-0.5">ℹ️</span>
        <p className="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
          <strong className="font-semibold">Placement Evaluation Notice:</strong> This score represents an algorithmic heuristic readiness assessment based on academic records, algorithmic skills, and project complexity rather than an assurance of corporate employment or contractual placement. Individual recruitment outcomes depend on specific corporate selection rounds, campus test difficulty, and real-time vacancy quotas.
        </p>
      </div>
    </div>
  );
};

export default ResultView;
