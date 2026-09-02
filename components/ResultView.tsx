import React from "react";
import { PredictionResult } from "../types";

interface ResultViewProps {
  result: PredictionResult;
}

const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const getProgressColor = (val: number) => {
    if (val >= 75) return "bg-emerald-500";
    if (val >= 50) return "bg-indigo-500";
    return "bg-rose-500";
  };

  const getStatusBadge = () => {
    switch (result.eligibilityStatus) {
      case "EL_HIGH":
        return (
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
            Platinum Tier
          </span>
        );
      case "EL_MEDIUM":
        return (
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800">
            Elite Tier
          </span>
        );
      case "EL_LOW":
        return (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">
            Growth Tier
          </span>
        );
      case "INELIGIBLE":
        return (
          <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800">
            Action Required
          </span>
        );
    }
  };

  const size = 260;
  const center = size / 2;
  const strokeWidth = 20;
  const radius = size / 2 - strokeWidth * 1.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - result.probability);

  const percent = (result.probability * 100).toFixed(0);

  return (
    <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] shadow-2xl shadow-indigo-100/30 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 h-full flex flex-col relative overflow-hidden group">
      
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-full blur-[80px] -z-10 transition-colors"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-14">
        <div>
          <h2 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tight leading-none">
            Analysis Verdict
          </h2>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-2.5 uppercase tracking-[0.2em]">
            Neural Engine v3.0 Validated
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center py-4 space-y-10">
        
        {/* Circular Progress */}
        <div className="flex flex-col items-center justify-center">

          <div className="relative w-64 h-64 flex items-center justify-center">

            {/* Glow behind ring */}
            <div
              className={`absolute inset-0 rounded-full blur-[40px] opacity-20 transition-all duration-1000 ${
                result.probability >= 0.5
                  ? "bg-indigo-500"
                  : "bg-rose-500"
              }`}
            />

            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 drop-shadow-xl"
            >
              {/* Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth={strokeWidth}
              />

              {/* Gradient defs */}
              <defs>
                <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Progress */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={
                  result.probability >= 0.5
                    ? "url(#resultGradient)"
                    : "url(#dangerGradient)"
                }
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={
                  result.probability >= 0.5
                    ? "drop-shadow-[0_0_10px_rgba(99,102,241,0.45)]"
                    : "drop-shadow-[0_0_10px_rgba(244,63,94,0.45)]"
                }
                style={{
                  transition:
                    "stroke-dashoffset 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </svg>

            {/* Center Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-baseline justify-center">
                <span className="text-7xl font-[900] text-slate-900 dark:text-white tracking-tighter tabular-nums">
                  {percent}
                </span>
                <span className="text-3xl font-black text-slate-400 dark:text-slate-500 ml-1">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Label BELOW circle */}
          <p className="mt-6 text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] text-center">
            Calibrated Probability
          </p>

        </div>

        {/* Placement Status */}
        <div className="w-full text-center space-y-4 px-6">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
              result.isPlaced
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800"
            }`}
          >
            <span className="text-lg">{result.isPlaced ? "✓" : "!"}</span>
            <span>{result.isPlaced ? "Likely Placed" : "Action Required"}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-bold italic text-base px-4">
            "{result.message}"
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-4 pt-12 border-t border-slate-100 dark:border-slate-800">
        {(Object.entries(result.scoreBreakdown) as [string, number][]).map(
          ([key, val]) => (
            <div
              key={key}
              className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em] leading-none">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {Math.round(val)}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(
                    val
                  )} transition-all duration-[2000ms] ease-out`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ResultView;
