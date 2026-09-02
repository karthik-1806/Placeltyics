import React from "react";
import { Link } from "react-router-dom";
import { StudentProfile } from "../types";

interface AccountProps {
  profile: StudentProfile;
  onUpdate: (data: StudentProfile) => void;
}

const Account: React.FC<AccountProps> = ({ profile, onUpdate }) => {
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

  const inputClasses =
    "w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder-slate-400";

  const labelClasses =
    "block text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Button explicitly to Dashboard */}
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>{" "}
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-8">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Account Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium mt-2">
              Manage your institutional identity and career objectives.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>Full Name</label>
                <input
                  name="name"
                  value={profile.user.name}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}>Email Address</label>
                <input
                  disabled
                  name="email"
                  value={profile.user.email}
                  className={`${inputClasses} opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>University / Institution</label>
                <input
                  name="university"
                  value={profile.user.university}
                  onChange={handleChange}
                  placeholder="e.g. Stanford University"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}>Career Objective</label>
                <select
                  name="careerGoal"
                  value={profile.user.careerGoal}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option>Software Engineer</option>
                  <option>Data Scientist</option>
                  <option>Product Manager</option>
                  <option>UX Designer</option>
                  <option>DevOps Specialist</option>
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button className="px-10 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">
                Synchronize Profile
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-8">
          {/* ✅ Fixed Profile Card (Light + Dark) */}
          <div className="bg-white dark:bg-indigo-950 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none relative overflow-hidden text-center">
            <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black border-4 border-indigo-200/60 dark:border-white/20 text-white">
              {profile.user.name?.charAt(0) || "U"}
            </div>

            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {profile.user.name}
            </h3>

            <p className="text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mt-2">
              {profile.user.careerGoal}
            </p>

            <div className="mt-10 pt-10 border-t border-slate-200 dark:border-white/10 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-600 dark:text-indigo-300 uppercase tracking-widest">
                  Completeness
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {Math.round(completeness)}%
                </span>
              </div>

              <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-[40px] border border-emerald-200 dark:border-emerald-900/40">
            <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4">
              Verification Status
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black">
                ✓
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Identity Verified
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                  Via Institutional Auth
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
