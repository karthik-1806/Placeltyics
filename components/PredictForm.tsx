import React, { useMemo, useEffect } from 'react';
import { StudentProfile } from '../types';
import { BRANCH_OPTIONS, COURSE_CONFIG } from '../constants';

interface PredictFormProps {
  data: StudentProfile;
  onChange: (data: StudentProfile) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const PredictForm: React.FC<PredictFormProps> = ({ data, onChange, onSubmit, isLoading = false }) => {
  const dynamicYearOptions = useMemo(() => {
    const config = COURSE_CONFIG[data.branch] || { duration: 4 };
    return Array.from({ length: config.duration }, (_, i) => {
      const n = i + 1;
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      const ord = s[(v - 20) % 10] || s[v] || s[0];
      return `${n}${ord} Year`;
    });
  }, [data.branch]);

  useEffect(() => {
    if (!dynamicYearOptions.includes(data.year)) {
      onChange({ ...data, year: dynamicYearOptions[dynamicYearOptions.length - 1] });
    }
  }, [dynamicYearOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number = value;

    if (type === 'number' || type === 'range') {
      const num = parseFloat(value);
      const min = parseFloat(e.target.getAttribute('min') || "0");
      const max = parseFloat(e.target.getAttribute('max') || "100");
      finalValue = isNaN(num) ? min : Math.min(Math.max(num, min), max);
    }

    onChange({
      ...data,
      [name]: finalValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Academic Credentials */}
      <section className="bento-card space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              01
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Academic Foundation
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Core Eligibility</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Branch / Program</label>
            <select name="branch" value={data.branch} onChange={handleChange} className="field-input">
              {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="field-label">Year of Study</label>
            <select name="year" value={data.year} onChange={handleChange} className="field-input">
              {dynamicYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Cumulative CGPA</label>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Scale: 0.00 – 10.00</span>
            </div>
            <div className="relative">
              <input
                type="number"
                name="cgpa"
                step="0.01"
                min="0"
                max="10"
                value={data.cgpa}
                onChange={handleChange}
                className="field-input pr-12 font-semibold"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">/ 10</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Active Backlogs</label>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Range: 0 – 20</span>
            </div>
            <input
              type="number"
              name="backlogs"
              min="0"
              max="20"
              value={data.backlogs}
              onChange={handleChange}
              className={`field-input font-semibold ${
                data.backlogs > 0
                  ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  : ''
              }`}
              required
            />
            {data.backlogs > 0 && (
              <p className="field-hint text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1.5">
                <span>⚠️</span> Active backlogs trigger strict disqualification filters across major campus recruiters.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Technical Competencies */}
      <section className="bento-card space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
              02
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Technical Competencies
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Evaluation Vectors</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Data Structures & Algorithms</span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{data.codingDSA}%</span>
            </div>
            <input
              type="range"
              name="codingDSA"
              min="0"
              max="100"
              value={data.codingDSA}
              onChange={handleChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
              <span>0% (Foundational)</span>
              <span>100% (Advanced)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Software Development & Frameworks</span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{data.codingDev}%</span>
            </div>
            <input
              type="range"
              name="codingDev"
              min="0"
              max="100"
              value={data.codingDev}
              onChange={handleChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
              <span>0% (Foundational)</span>
              <span>100% (Advanced)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantitative & Logical Aptitude</span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{data.aptitudeScore}%</span>
            </div>
            <input
              type="range"
              name="aptitudeScore"
              min="0"
              max="100"
              value={data.aptitudeScore}
              onChange={handleChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
              <span>0% (Foundational)</span>
              <span>100% (Advanced)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Communication & Interview Presentation</span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{data.communicationScore} / 10</span>
            </div>
            <input
              type="range"
              name="communicationScore"
              min="0"
              max="10"
              value={data.communicationScore}
              onChange={handleChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
              <span>0 / 10 (Introductory)</span>
              <span>10 / 10 (Proficient)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Practical Experience */}
      <section className="bento-card space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50">
              03
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Engineering Portfolio
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Applied Experience</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Internship Count</label>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Range: 0 – 10</span>
            </div>
            <input
              type="number"
              name="internships"
              min="0"
              max="10"
              value={data.internships}
              onChange={handleChange}
              className="field-input font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Internship Relevance</label>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Scale: 0 – 10</span>
            </div>
            <input
              type="number"
              name="internshipRelevance"
              min="0"
              max="10"
              value={data.internshipRelevance}
              onChange={handleChange}
              className="field-input font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Completed Projects</label>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Range: 0 – 20</span>
            </div>
            <input
              type="number"
              name="projects"
              min="0"
              max="20"
              value={data.projects}
              onChange={handleChange}
              className="field-input font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Complexity Rating</label>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Scale: 0 – 10</span>
            </div>
            <input
              type="number"
              name="projectComplexity"
              min="0"
              max="10"
              value={data.projectComplexity}
              onChange={handleChange}
              className="field-input font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Documentation</label>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Scale: 0 – 10</span>
            </div>
            <input
              type="number"
              name="projectDocumentation"
              min="0"
              max="10"
              value={data.projectDocumentation}
              onChange={handleChange}
              className="field-input font-semibold"
            />
          </div>
        </div>
      </section>

      {/* Predict Trigger Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3.5 text-sm font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Evaluating Profile Metrics...
            </>
          ) : (
            <>
              Run Placement Readiness Assessment →
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PredictForm;
