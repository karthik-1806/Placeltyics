
import React from 'react';
import { Link } from 'react-router-dom';
import { StudentProfile } from '../types';

interface DashboardProps {
  profile: StudentProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const latestPrediction = profile.predictionHistory[profile.predictionHistory.length - 1];
  const prob = latestPrediction ? Math.round(latestPrediction.probability * 100) : null;

  const resources = [
    { title: 'DSA Roadmap 2025', icon: '📓', path: '/resources#dsa' },
    { title: 'System Design Basics', icon: '🏗️', path: '/resources#sys-design' },
    { title: 'Mock HR Interview', icon: '🗣️', path: '/resources#interview' },
    { title: 'Resume Templates', icon: '📄', path: '/resources#resume' }
  ];

  const cardBase = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300";
  const lightShadow = "shadow-xl shadow-slate-200/70 dark:shadow-none";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Personalized Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800 mb-4">
            Status: Executive Profile Active
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome back, <span className="text-gradient">{profile.user.name.split(' ')[0]}.</span>
          </h1>
          <p className="text-slate-800 dark:text-slate-400 font-semibold text-lg mt-2">
            Your career trajectory is currently being monitored by Neural Engine v4.2.
          </p>
        </div>
        <div className="flex gap-4">
           <Link to="/predict" className="px-8 py-4 bg-indigo-600 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200/40 dark:shadow-none hover:-translate-y-1 transition-all">
             New Prediction
           </Link>
           <Link to="/coach" className="px-8 py-4 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-all shadow-md">
             Talk to Coach
           </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`col-span-1 md:col-span-2 ${cardBase} ${lightShadow} p-10 rounded-[40px] relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-8">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform border border-indigo-200 dark:border-transparent">📊</div>
          </div>
          <h3 className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-2">Latest Placement Score</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{prob ?? '--'}</span>
            <span className="text-xl font-black text-slate-500 dark:text-slate-600">%</span>
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-400 mt-6 flex items-center gap-2">
            {prob && prob > 70 ? '🟢 Competitive Profile' : prob ? '🟡 Optimization Needed' : '⚪ Run analysis to calculate'}
          </p>
        </div>

        <div className={`${cardBase} ${lightShadow} p-8 rounded-[40px]`}>
           <h3 className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-6">Profile Assets</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Projects</span>
                 <span className="text-sm font-black text-slate-900 dark:text-white">{profile.projects}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Internships</span>
                 <span className="text-sm font-black text-slate-900 dark:text-white">{profile.internships}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-400">CGPA</span>
                 <span className="text-sm font-black text-slate-900 dark:text-white">{profile.cgpa}</span>
              </div>
           </div>
        </div>

        <div className={`${cardBase} ${lightShadow} p-8 rounded-[40px]`}>
           <h3 className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-6">Next Goal</h3>
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 flex items-center justify-center text-xs border border-emerald-200 dark:border-transparent">🚀</div>
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{profile.user.careerGoal}</span>
           </div>
           <Link to="/account" className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest hover:underline">Edit Focus →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={`lg:col-span-2 ${cardBase} ${lightShadow} p-12 rounded-[50px] relative overflow-hidden`}>
  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>

  <h3 className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-8">
    Actionable Checklist
  </h3>

  <div className="space-y-6">
    {[
      { label: "Clear all active backlogs", done: profile.backlogs === 0 },
      { label: "Optimize technical score to 80%+", done: (profile.codingDSA + profile.codingDev) / 2 > 80 },
      { label: "Upload professional project documentation", done: profile.projectDocumentation > 7 },
      { label: "Achieve 2+ Relevant Internships", done: profile.internships >= 2 },
    ].map((task, i) => (
      <div
        key={i}
        className={`flex items-center gap-4 p-5 rounded-3xl border transition-all
          ${task.done
            ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-100"
            : "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200"
          }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black
            ${task.done
              ? "bg-emerald-600 text-white"
              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
            }`}
        >
          {task.done ? "✓" : i + 1}
        </div>

        <span className="text-sm font-bold">{task.label}</span>
      </div>
    ))}
  </div>
</div>


        <div className={`${cardBase} ${lightShadow} p-10 rounded-[50px]`}>
           <h3 className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-10">Resources for you</h3>
           <div className="space-y-4">
              {resources.map(res => (
                <Link 
                  key={res.title} 
                  to={res.path}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all text-left border border-slate-200 dark:border-transparent"
                >
                   <div className="flex items-center gap-3">
                      <span className="text-xl">{res.icon}</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{res.title}</span>
                   </div>
                   <span className="text-slate-400">→</span>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
