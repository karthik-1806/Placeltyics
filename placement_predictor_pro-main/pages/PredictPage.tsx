
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PredictForm from '../components/PredictForm';
import ResultView from '../components/ResultView';
import { StudentProfile, PredictionResult } from '../types';
import { calculatePlacementProb } from '../services/predictionEngine';

interface PredictPageProps {
  profile: StudentProfile;
  onUpdate: (data: StudentProfile) => void;
  onPredict: (probability: number) => void;
}

const PredictPage: React.FC<PredictPageProps> = ({ profile, onUpdate, onPredict }) => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        resultsEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    setTimeout(() => {
      const res = calculatePlacementProb(profile);
      setResult(res);
      onPredict(res.probability);
      setLoading(false);
    }, 1200);
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

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Column: Data Terminal */}
        <aside className="w-full lg:w-[480px] lg:sticky lg:top-24 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              Analysis Engine Ready
            </div>
            <h1 className="text-5xl font-[900] text-slate-900 dark:text-white tracking-tight leading-tight">
              Calibrate <br /><span className="text-gradient">Potential.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Fine-tune your technical and academic parameters to calculate your statistical placement likelihood.
            </p>
          </div>

          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-[32px]">
            <PredictForm 
              data={profile} 
              onChange={onUpdate} 
              onSubmit={handlePredict} 
            />
          </div>

          <div className="px-8 py-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xl">💡</div>
                <div>
                   <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Pro-Tip</h4>
                   <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">Most Tier-1 companies prioritize DSA scores above 80%.</p>
                </div>
             </div>
          </div>
        </aside>

        {/* Right Column: Dynamic Results Section */}
        <div id="results-section" className="flex-1 w-full">
          {loading ? (
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[60px] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-12 h-full min-h-[850px] animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent"></div>
              <div className="relative">
                <div className="w-40 h-40 border-[16px] border-slate-100 dark:border-slate-800 rounded-full"></div>
                <div className="w-40 h-40 border-[16px] border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                <div className="absolute inset-0 flex items-center justify-center text-5xl">🔭</div>
              </div>
              <div className="space-y-6 relative">
                <h3 className="text-4xl font-[900] text-slate-900 dark:text-white tracking-tight">Syncing Vectors</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                  Executing Platt Scaling calibration and cross-referencing eligibility guardrails...
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></span>
                  ))}
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <ResultView result={result} />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-24 rounded-[60px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center h-full min-h-[850px] group transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="w-40 h-40 bg-slate-100 dark:bg-slate-800 rounded-[48px] flex items-center justify-center text-7xl mb-12 shadow-inner group-hover:rotate-6 transition-all">📡</div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Awaiting Input</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md font-medium text-lg leading-relaxed mb-12">
                Populate your profile form to trigger our neural placement forecasting model.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm transition-all group-hover:border-indigo-400">
                  <div className="text-2xl mb-3">🛡️</div>
                  <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Eligibility Check</h4>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm transition-all group-hover:border-violet-400">
                  <div className="text-2xl mb-3">⚖️</div>
                  <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Calibrated Probability</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictPage;
