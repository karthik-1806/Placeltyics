import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  // Pre-seed result from current profile if already calculated
  const [result, setResult] = useState<PredictionResult | null>(() => {
    return calculatePlacementProb(profile);
  });
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
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
        <span className="badge-indigo">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          Readiness Evaluation Engine
        </span>
      </div>

      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Placement Readiness Predictor
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Adjust your academic, algorithmic, and project profile inputs below to calculate your multi-vector placement readiness score.
        </p>
      </div>

      {/* Main Grid: Form Left, Verdict Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          <PredictForm
            data={profile}
            onChange={onUpdate}
            onSubmit={handlePredict}
            isLoading={loading}
          />
        </div>

        {/* Right Column: Verdict View */}
        <div id="results-section" className="lg:col-span-6 lg:sticky lg:top-24">
          {loading ? (
            <div className="bento-card flex flex-col items-center justify-center text-center p-12 min-h-[420px] space-y-6">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 animate-spin"></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Calculating Placement Readiness</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  Normalizing academic features, assessing technical vectors, and verifying company eligibility cutoffs...
                </p>
              </div>
            </div>
          ) : result ? (
            <ResultView result={result} />
          ) : (
            <div className="bento-card flex flex-col items-center justify-center text-center p-12 min-h-[420px] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready for Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Submit the profile form to generate your calibrated placement score and company-tier criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictPage;
