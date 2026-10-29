import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StudentProfile } from "../types";

interface AccountProps {
  profile: StudentProfile;
  onUpdate: (data: StudentProfile) => void;
}

const Account: React.FC<AccountProps> = ({ profile, onUpdate }) => {
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({
      ...profile,
      user: {
        ...profile.user,
        [name]: value,
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const completeness =
    ([
      profile.user.name,
      profile.user.email,
      profile.user.university,
      profile.user.careerGoal,
      profile.branch,
      profile.year,
    ].filter(Boolean).length /
      6) *
    100;

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
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          Student Identity & Profile
        </span>
      </div>

      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Manage your institutional identity, academic credentials, and target corporate recruitment objectives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Profile Fields */}
        <form onSubmit={handleSave} className="lg:col-span-8 bento-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Profile Credentials</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Institutional records referenced during placement evaluation</p>
            </div>
            {saveFeedback && (
              <span className="badge-emerald animate-in fade-in text-xs font-bold font-mono">
                ✓ Saved to Local Storage
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Student Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.user.name}
                onChange={handleChange}
                className="field-input font-medium"
                required
              />
            </div>

            <div>
              <label className="field-label">Registered Institutional Email</label>
              <input
                type="email"
                disabled
                name="email"
                value={profile.user.email}
                className="field-input opacity-60 cursor-not-allowed bg-slate-100 dark:bg-white/5 font-mono text-xs"
              />
              <p className="field-hint">Primary identity key linked to local records.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">University / College Institution</label>
              <input
                type="text"
                name="university"
                value={profile.user.university}
                onChange={handleChange}
                placeholder="e.g. National Institute of Technology"
                className="field-input font-medium"
              />
            </div>

            <div>
              <label className="field-label">Target Career Objective</label>
              <select
                name="careerGoal"
                value={profile.user.careerGoal}
                onChange={handleChange}
                className="field-input font-medium"
              >
                <option>Software Engineer</option>
                <option>Full-Stack Developer</option>
                <option>Data Scientist</option>
                <option>Machine Learning Engineer</option>
                <option>Cloud / DevOps Specialist</option>
                <option>Product Manager</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary text-xs py-3 px-6 shadow-sm uppercase tracking-wider font-bold"
            >
              Synchronize Profile Changes
            </button>
          </div>
        </form>

        {/* Right Sidebar: Profile Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bento-card text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center text-2xl font-bold shadow-sm border-2 border-indigo-500/40">
              {profile.user.name?.charAt(0) || "U"}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {profile.user.name || "Student"}
              </h3>
              <span className="badge-indigo text-[11px]">
                {profile.user.careerGoal}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Profile Completeness</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">{Math.round(completeness)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>

          {/* Prototype Storage Disclosure */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <span>💾</span> Client Persistence
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Your profile is preserved securely in your browser's private local storage. Export a JSON backup anytime from Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
