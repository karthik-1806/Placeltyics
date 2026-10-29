import React, { useState } from "react";
import { Link } from "react-router-dom";

interface SettingsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onReset: () => void;
  onExport: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  isDarkMode,
  toggleDarkMode,
  onReset,
  onExport,
}) => {
  const [prefRecommendations, setPrefRecommendations] = useState(true);
  const [prefAlerts, setPrefAlerts] = useState(true);
  const [prefCompanyInsights, setPrefCompanyInsights] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleConfirmReset = () => {
    setShowConfirmReset(false);
    onReset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
        <span className="badge-indigo">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          Application Preferences & Data
        </span>
      </div>

      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Privacy Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize interface appearance, export your student data records, or manage local storage privacy.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <section className="bento-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🌓</span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Interface Appearance</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Theme preference persisted in browser session</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Dark Intelligence Mode</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Reduces eye strain during late-night practice and interview review sessions
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isDarkMode}
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                isDarkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Signals & Notifications */}
        <section className="bento-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🔔</span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Advisory Preferences</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Configure client guidance and analytical signals</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">AI Strategic Recommendations</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Allow AI Coach to prioritize relevant coding and internship gaps</span>
              </div>
              <input
                type="checkbox"
                checked={prefRecommendations}
                onChange={(e) => setPrefRecommendations(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Eligibility Threshold Warnings</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Highlight active backlog and CGPA warnings in prediction breakdowns</span>
              </div>
              <input
                type="checkbox"
                checked={prefAlerts}
                onChange={(e) => setPrefAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Company Recruitment Tier Benchmarks</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Compare profile scores against Super Dream, Specialist, and Mass recruit standards</span>
              </div>
              <input
                type="checkbox"
                checked={prefCompanyInsights}
                onChange={(e) => setPrefCompanyInsights(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </section>

        {/* Data Portability: Export */}
        <section className="bento-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📦</span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Data Portability & Export</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Download your profile and prediction history as a structured JSON file</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Export all your academic scores, skill ratings, and historical placement records for backup or offline review.
            </p>
            <button
              type="button"
              onClick={onExport}
              className="btn-secondary text-xs py-2.5 px-5 shrink-0"
            >
              📥 Export Profile JSON
            </button>
          </div>
        </section>

        {/* Danger Zone: Reset Profile */}
        <section className="bento-card border-rose-200/80 dark:border-rose-950/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950/60">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">⚠️</span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Account Management & Data Reset</h2>
                <p className="text-[11px] text-rose-500/80">Permanent operations on local student data</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
            <div>
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">Delete Account & Evaluation History</span>
              <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 block mt-0.5">
                Permanently removes your profile and all saved prediction records from this browser.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="btn-danger text-xs py-2.5 px-5 shrink-0"
            >
              Reset All Data
            </button>
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bento-card max-w-md w-full space-y-4 shadow-2xl border-rose-300 dark:border-rose-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Data Reset
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete your profile data and historical evaluation records? All locally stored information will be wiped immediately.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="btn-danger text-xs py-2 px-4"
              >
                Yes, Permanently Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
