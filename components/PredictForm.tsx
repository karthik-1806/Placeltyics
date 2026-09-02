
import React, { useMemo, useEffect } from 'react';
import { StudentProfile } from '../types';
import { BRANCH_OPTIONS, COURSE_CONFIG } from '../constants';

interface PredictFormProps {
  data: StudentProfile;
  onChange: (data: StudentProfile) => void;
  onSubmit: () => void;
}

const PredictForm: React.FC<PredictFormProps> = ({ data, onChange, onSubmit }) => {
  const dynamicYearOptions = useMemo(() => {
    const config = COURSE_CONFIG[data.branch] || { duration: 4 };
    return Array.from({ length: config.duration }, (_, i) => `${i + 1}${getOrdinal(i + 1)} Year`);
  }, [data.branch]);

  function getOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  useEffect(() => {
    if (!dynamicYearOptions.includes(data.year)) {
      onChange({ ...data, year: dynamicYearOptions[dynamicYearOptions.length - 1] });
    }
  }, [dynamicYearOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number = value;

    if (type === 'number' || type === 'range') {
      const inputElement = e.target as HTMLInputElement;
      const num = parseFloat(value);
      const min = parseFloat(inputElement.min || "0");
      const max = parseFloat(inputElement.max || "100");
      
      finalValue = isNaN(num) ? min : Math.min(Math.max(num, min), max);
    }

    onChange({
      ...data,
      [name]: finalValue
    });
  };

  const inputClasses = "w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all py-3 px-4 shadow-sm placeholder-slate-400 dark:placeholder-slate-500";
  const labelClasses = "block text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1";
  const sectionClasses = "bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none space-y-6 mb-8";
  const subLabelClasses = "text-[11px] font-extrabold text-slate-800 dark:text-slate-300 mb-1 block";

  return (
    <div className="space-y-0">
      {/* 1. Academic DNA */}
      <div className={sectionClasses}>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl shadow-inner border border-indigo-200 dark:border-transparent">🎓</div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">Academic DNA</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-500 mt-1 uppercase tracking-widest">Base Credentials</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClasses}>Course</label>
            <select name="branch" value={data.branch} onChange={handleChange} className={inputClasses}>
              {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Year</label>
            <select name="year" value={data.year} onChange={handleChange} className={inputClasses}>
              {dynamicYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className={labelClasses}>Current CGPA</label>
            <div className="relative">
              <input type="number" name="cgpa" step="0.01" min="0" max="10" value={data.cgpa} onChange={handleChange} className={inputClasses} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 dark:text-slate-600">/ 10</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Active Backlogs</label>
            <input type="number" name="backlogs" min="0" max="10" value={data.backlogs} onChange={handleChange} 
              className={`${inputClasses} ${data.backlogs > 0 ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-400 font-bold' : ''}`} 
            />
          </div>
        </div>
      </div>

      {/* 2. Core Tech */}
      <div className={sectionClasses}>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl shadow-inner border border-emerald-200 dark:border-transparent">💻</div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">Core Tech</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-500 mt-1 uppercase tracking-widest">Skill Assessment</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={subLabelClasses}>Coding: DSA</label>
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">{data.codingDSA}%</span>
            </div>
            <input type="range" name="codingDSA" min="0" max="100" value={data.codingDSA} onChange={handleChange} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={subLabelClasses}>Coding: Development</label>
              <span className="text-xs font-black text-violet-700 dark:text-violet-400">{data.codingDev}%</span>
            </div>
            <input type="range" name="codingDev" min="0" max="100" value={data.codingDev} onChange={handleChange} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-600" />
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between mb-1">
                <label className={labelClasses}>Aptitude Score</label>
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">{data.aptitudeScore}/100</span>
              </div>
              <input type="range" name="aptitudeScore" min="0" max="100" value={data.aptitudeScore} onChange={handleChange} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className={labelClasses}>Soft Skills</label>
                <span className="text-xs font-black text-slate-900 dark:text-white">{data.communicationScore}/10</span>
              </div>
              <input type="range" name="communicationScore" min="0" max="10" value={data.communicationScore} onChange={handleChange} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Practical Experience */}
      <div className={sectionClasses}>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl shadow-inner border border-amber-200 dark:border-transparent">📋</div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">Practical Experience</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-500 mt-1 uppercase tracking-widest">Portfolio Metrics</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-emerald-600 rounded-full"></span>
              Project Metrics
            </h4>
            <div className="grid grid-cols-1 gap-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className={subLabelClasses}>Count</label>
                <input type="number" name="projects" min="0" max="20" value={data.projects} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className={subLabelClasses}>Complexity</label>
                    <span className="text-[10px] font-black text-emerald-700">{data.projectComplexity}/10</span>
                  </div>
                  <input type="range" name="projectComplexity" min="0" max="10" value={data.projectComplexity} onChange={handleChange} className="w-full h-1.5 bg-white dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className={subLabelClasses}>Documentation</label>
                    <span className="text-[10px] font-black text-emerald-700">{data.projectDocumentation}/10</span>
                  </div>
                  <input type="range" name="projectDocumentation" min="0" max="10" value={data.projectDocumentation} onChange={handleChange} className="w-full h-1.5 bg-white dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
              Internship Metrics
            </h4>
            <div className="grid grid-cols-1 gap-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className={subLabelClasses}>Count</label>
                <input type="number" name="internships" min="0" max="10" value={data.internships} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className={subLabelClasses}>Relevance</label>
                  <span className="text-[10px] font-black text-amber-700">{data.internshipRelevance}/10</span>
                </div>
                <input type="range" name="internshipRelevance" min="0" max="10" value={data.internshipRelevance} onChange={handleChange} className="w-full h-1.5 bg-white dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onSubmit}
        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-900/20 transition-all hover:-translate-y-1 active:scale-[0.98] group"
      >
        <span className="flex items-center justify-center gap-3">
          Launch Analysis
          <span className="group-hover:translate-x-1.5 transition-transform">→</span>
        </span>
      </button>
    </div>
  );
};

export default PredictForm;
