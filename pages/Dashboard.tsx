import React from 'react';
import { Link } from 'react-router-dom';
import { StudentProfile } from '../types';
import { calculatePlacementProb } from '../services/predictionEngine';

interface DashboardProps {
  profile: StudentProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const latestPrediction =
    profile.predictionHistory && profile.predictionHistory.length > 0
      ? profile.predictionHistory[profile.predictionHistory.length - 1]
      : null;

  // Evaluate current profile live if no stored prediction exists
  const calculatedReadiness = latestPrediction
    ? Math.round(latestPrediction.probability * 100)
    : Math.round(calculatePlacementProb(profile).probability * 100);

  // Profile completion calculation based on filled fields
  const completionCriteria = [
    Boolean(profile.user?.name),
    Boolean(profile.user?.university),
    Boolean(profile.user?.careerGoal),
    Boolean(profile.branch),
    profile.cgpa > 0,
    profile.projects > 0,
    profile.codingDSA > 0 || profile.codingDev > 0,
    profile.predictionHistory && profile.predictionHistory.length > 0
  ];
  const completedCount = completionCriteria.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / completionCriteria.length) * 100);

  // Four-Pillar Preparation Milestones with explicit status
  const milestones = [
    {
      title: "Active Academic Backlogs",
      desc: profile.backlogs === 0
        ? "Zero active backlogs. Clean record satisfies all tier-1 campus criteria."
        : `${profile.backlogs} active backlog(s) detected. Strictly blocks tier-1 company shortlists.`,
      status: profile.backlogs === 0 ? 'RESOLVED' : 'ATTENTION REQUIRED',
      statusClass: profile.backlogs === 0 ? 'badge-emerald' : 'badge-rose',
      metric: profile.backlogs === 0 ? '0 Backlogs' : `${profile.backlogs} Pending`,
      category: "Academic Gate"
    },
    {
      title: "DSA & Problem Solving",
      desc: profile.codingDSA >= 75
        ? "Solid technical foundation. Ready for Super-Dream screening rounds."
        : profile.codingDSA >= 60
        ? "Moderate readiness. Reinforce Trees, Graphs & Dynamic Programming patterns."
        : "Primary screening hurdle. Online assessment tests require intensive timed drills.",
      status: profile.codingDSA >= 75 ? 'RESOLVED' : profile.codingDSA >= 60 ? 'ON TRACK' : 'ATTENTION REQUIRED',
      statusClass: profile.codingDSA >= 75 ? 'badge-emerald' : profile.codingDSA >= 60 ? 'badge-indigo' : 'badge-amber',
      metric: `${profile.codingDSA}% Proficiency`,
      category: "Technical Screening"
    },
    {
      title: "Portfolio & Deployed Projects",
      desc: profile.projects >= 2 && profile.projectDocumentation >= 6
        ? "Strong practical assets. Portfolio demonstrates architecture & delivery."
        : "Target at least 2 full-stack projects featuring live demos & GitHub repos.",
      status: profile.projects >= 2 && profile.projectDocumentation >= 6 ? 'RESOLVED' : 'ON TRACK',
      statusClass: profile.projects >= 2 && profile.projectDocumentation >= 6 ? 'badge-emerald' : 'badge-indigo',
      metric: `${profile.projects} Project(s)`,
      category: "Engineering Portfolio"
    },
    {
      title: "Industry Internship Experience",
      desc: profile.internships >= 1
        ? "Real-world engineering experience substantially elevates shortlist odds."
        : "No internship recorded. Compensate with high-impact open-source contributions.",
      status: profile.internships >= 1 ? 'RESOLVED' : 'ON TRACK',
      statusClass: profile.internships >= 1 ? 'badge-emerald' : 'badge-amber',
      metric: profile.internships >= 1 ? `${profile.internships} Completed` : 'None Documented',
      category: "Experience Asset"
    }
  ];

  // Competency breakdown metrics for horizontal snapshot
  const competencySnapshot = [
    { label: "Core Academics (CGPA)", val: Math.round(profile.cgpa * 10), max: 100, display: `${profile.cgpa}/10` },
    { label: "Data Structures (DSA)", val: profile.codingDSA, max: 100, display: `${profile.codingDSA}%` },
    { label: "System Dev & Frameworks", val: profile.codingDev, max: 100, display: `${profile.codingDev}%` },
    { label: "Cognitive Aptitude", val: profile.aptitudeScore, max: 100, display: `${profile.aptitudeScore}%` },
    { label: "Communication / Soft Skills", val: profile.communicationScore * 10, max: 100, display: `${profile.communicationScore}/10` }
  ];

  // Recommended next action based on lowest scoring vector
  const getRecommendedAction = () => {
    if (profile.backlogs > 0) {
      return {
        title: "Prioritize Academic Clearance",
        desc: "Active backlogs are a non-negotiable gate for campus recruitment. Register for upcoming remedial exams immediately.",
        cta: "Review Backlog Impact",
        link: "/predict"
      };
    }
    if (profile.codingDSA < 70) {
      return {
        title: "Intensive DSA Patterns Practice",
        desc: "Coding assessments filter out 80% of applicants. Work through Striver's A2Z Sheet and NeetCode 150 patterns.",
        cta: "Access DSA Roadmaps",
        link: "/resources"
      };
    }
    if (profile.projects < 2) {
      return {
        title: "Deploy 2 Production Projects",
        desc: "Product interviewers require live deployments and defensible system architectures. Add READMEs and automated tests.",
        cta: "Explore Project Ideas",
        link: "/resources"
      };
    }
    return {
      title: "Simulate Technical Mock Interviews",
      desc: "Your foundational metrics are competitive. Schedule peer mock interviews and refine behavioral STAR stories.",
      cta: "Consult AI Coach Strategy",
      link: "/coach"
    };
  };

  const nextAction = getRecommendedAction();

  // Readiness classification badge & styling
  const readinessTier =
    calculatedReadiness >= 82
      ? { label: 'Optimal Readiness', badge: 'badge-emerald', desc: 'Satisfies standard screening thresholds for Tier-1 & Product recruitment drives.' }
      : calculatedReadiness >= 68
      ? { label: 'Competitive Candidate', badge: 'badge-indigo', desc: 'Solid technical and academic baseline. Fine-tuning DSA drills will maximize high-tier placement odds.' }
      : calculatedReadiness >= 50
      ? { label: 'Developing Foundation', badge: 'badge-amber', desc: 'Core eligibility met for Mass recruiters; technical screening rounds require focused preparation.' }
      : { label: 'Intervention Required', badge: 'badge-rose', desc: 'Active backlogs or low technical screening scores require immediate remedial intervention.' };

  // Gauge parameters for hero card
  const gaugeSize = 130;
  const strokeWidth = 11;
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - calculatedReadiness / 100);

  const initials = profile.user?.name
    ? profile.user.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Command Identity Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-2 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {profile.user?.name || 'Student Candidate'}
              </h1>
              <span className="badge-indigo text-[11px]">
                {profile.branch} • {profile.year}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span>{profile.user?.university || 'Engineering Institute'}</span>
              <span>•</span>
              <span>Target: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{profile.user?.careerGoal || 'Software Engineer'}</strong></span>
            </p>
          </div>
        </div>

        {/* Primary Command Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/predict"
            className="btn-primary text-xs py-2.5 px-4 shadow-xs"
          >
            <span>⚡</span> Run Assessment
          </Link>
          <Link
            to="/coach"
            className="btn-secondary text-xs py-2.5 px-4"
          >
            <span>🤖</span> Consult AI Coach
          </Link>
        </div>
      </div>

      {/* 2. Hero Bento Grid: Hero Score Card (7 cols) + Profile Health (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Readiness Hero Card */}
        <div className="lg:col-span-7 bento-card-hero flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Placement Readiness Evaluation
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Multi-vector algorithmic assessment
                </span>
              </div>
              <span className={readinessTier.badge}>
                {readinessTier.label}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
              {/* Circular Readiness Gauge */}
              <div className="relative shrink-0 flex items-center justify-center">
                <svg width={gaugeSize} height={gaugeSize} className="transform -rotate-90">
                  <circle
                    cx={gaugeSize / 2}
                    cy={gaugeSize / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx={gaugeSize / 2}
                    cy={gaugeSize / 2}
                    r={radius}
                    fill="none"
                    stroke={calculatedReadiness >= 75 ? '#10b981' : calculatedReadiness >= 50 ? '#4f46e5' : '#f43f5e'}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                    {calculatedReadiness}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>

              {/* Diagnostic Interpretation */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Readiness Score Overview
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {readinessTier.desc}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Link
                    to="/predict"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    Inspect Factor Breakdown →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/10 mt-6 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Evaluated against tier-1 campus criteria</span>
            <span className="tabular-nums">Updated from active profile</span>
          </div>
        </div>

        {/* Profile Health & Competency Snapshot */}
        <div className="lg:col-span-5 bento-card flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Profile Competency Snapshot</h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Preparation status across 5 pillars</span>
              </div>
              <span className="badge-neutral text-[10px]">{completionPercent}% Documented</span>
            </div>

            {/* Horizontal Competency Progress Bars */}
            <div className="space-y-3 pt-2">
              {competencySnapshot.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">{item.display}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(item.val, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <Link to="/account" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Update Student Records →
            </Link>
            <span className="text-[11px] text-slate-400">Account Management</span>
          </div>
        </div>
      </div>

      {/* 3. Four-Pillar Preparation Priority Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recruitment Readiness Priorities</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Key milestones evaluated by campus hiring partners</p>
          </div>
          <span className="badge-neutral text-[11px]">
            {milestones.filter((m) => m.status === 'RESOLVED').length} of {milestones.length} Cleared
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div
              key={m.title}
              className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-white/10 flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {m.category}
                  </span>
                  <span className={m.statusClass}>
                    {m.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="text-[11px] text-slate-400">Benchmark:</span>
                <span className="tabular-nums">{m.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Recommendation + History Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Next Strategic Action Card (7 cols) */}
        <div className="lg:col-span-7 bento-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-indigo">Highest-Impact Preparation Action</span>
              <span className="text-[11px] text-slate-400">Diagnostic insight</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {nextAction.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {nextAction.desc}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <Link
              to={nextAction.link}
              className="btn-primary text-xs py-2 px-4 shadow-xs"
            >
              {nextAction.cta} →
            </Link>
            <span className="text-[11px] text-slate-400">Recommended Next Step</span>
          </div>
        </div>

        {/* Compact History Trend (5 cols) */}
        <div className="lg:col-span-5 bento-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assessment History</h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Past evaluation sessions</span>
              </div>
              <Link to="/insights" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View Full Chart →
              </Link>
            </div>

            <div className="space-y-2">
              {profile.predictionHistory && profile.predictionHistory.length > 0 ? (
                profile.predictionHistory.slice(-3).reverse().map((rec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {new Date(rec.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-slate-400">Assessment Run</span>
                    </div>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums text-sm">
                      {Math.round(rec.probability * 100)}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                  No historical sessions recorded yet. Run your first assessment in the Predictor.
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Stored in local database</span>
            <Link to="/predict" className="font-semibold text-slate-700 dark:text-slate-300 hover:underline">
              New Run +
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
