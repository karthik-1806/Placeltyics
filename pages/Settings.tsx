import React from "react";
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
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Button explicitly to Dashboard */}
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-slate-700 dark:text-slate-400 font-semibold mt-2">
          Personalize your application experience and data privacy.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xl rounded-2xl border border-indigo-200 dark:border-transparent">
              🌓
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Appearance
            </h3>
          </div>

          <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6">
            <div className="flex w-full items-center justify-between gap-6">
              {/* Left text */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Dark Intelligence Mode
                </p>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-1">
                  Easier on the eyes during late-night study
                </p>
              </div>

              {/* Right toggle */}
              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  aria-pressed={isDarkMode}
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full overflow-hidden transition ${
                    isDarkMode ? "bg-indigo-600" : "bg-slate-600/60"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                      isDarkMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Simulation */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xl rounded-2xl border border-amber-200 dark:border-transparent">
              🔔
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Signals & Notifications
            </h3>
          </div>

          <div className="space-y-2">
            {["Smart Recommendations", "Prediction Updates", "Career Signals"].map(
              (pref) => (
                <div
                  key={pref}
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
                >
                  <span className="text-xs font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest">
                    {pref}
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-indigo-600 cursor-pointer"
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-rose-200 dark:border-rose-900/20 shadow-xl shadow-rose-200/40 dark:shadow-none transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 flex items-center justify-center text-xl rounded-2xl border border-rose-200 dark:border-transparent">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Data Management
            </h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={onExport}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            >
              Export My Data (JSON)
            </button>

            <button
              onClick={onReset}
              className="flex-1 py-4 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200/40 dark:shadow-none"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
