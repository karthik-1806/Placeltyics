import React from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { StudentProfile } from '../types';

interface InsightsProps {
  profile: StudentProfile;
  isDarkMode: boolean;
}

const Insights: React.FC<InsightsProps> = ({ profile, isDarkMode }) => {
  const radarData = [
    { subject: 'Academic', A: Math.round(profile.cgpa * 10), fullMark: 100 },
    { subject: 'DSA', A: profile.codingDSA, fullMark: 100 },
    { subject: 'Development', A: profile.codingDev, fullMark: 100 },
    { subject: 'Aptitude', A: profile.aptitudeScore, fullMark: 100 },
    { subject: 'Communication', A: profile.communicationScore * 10, fullMark: 100 },
    {
      subject: 'Portfolio',
      A: Math.min(Math.round((profile.internships * 25 + profile.projects * 15)), 100),
      fullMark: 100
    },
  ];

  // Direct count of positive portfolio assets
  const assetBarData = [
    { name: 'Projects', count: profile.projects },
    { name: 'Internships', count: profile.internships },
  ];

  const historyRecords = Array.isArray(profile.predictionHistory)
    ? profile.predictionHistory
    : [];

  const historyData = historyRecords.map((record, index) => ({
    name: `Run #${index + 1}`,
    value: Math.round(record.probability * 100),
    timestamp: record.timestamp,
    formattedDate: new Date(record.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
  }));

  const ChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-[#0c1220] p-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-lg text-xs">
          <p className="font-semibold text-slate-500 dark:text-slate-400">
            {data.payload.formattedDate || data.payload.name}
          </p>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 tabular-nums">
            {data.value}% Readiness Score
          </p>
        </div>
      );
    }
    return null;
  };

  const AssetTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-[#0c1220] p-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-lg text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200">{data.name}</p>
          <p className="text-slate-600 dark:text-slate-400 mt-0.5">
            Recorded Count: <strong className="text-indigo-600 dark:text-indigo-400 tabular-nums">{data.count}</strong>
          </p>
        </div>
      );
    }
    return null;
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
          Placement Intelligence Analytics
        </span>
      </div>

      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profile Performance DNA
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Multi-dimensional analytics mapping your academic standing, algorithmic capability, portfolio strength, and historical readiness trajectory.
        </p>
      </div>

      {/* Historical Progression Area Chart */}
      <div className="bento-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Readiness Progression Trajectory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated readiness scores over recorded evaluation iterations
            </p>
          </div>
          <span className="badge-neutral text-[10px] font-mono">
            {historyData.length} Evaluation{historyData.length === 1 ? '' : 's'} Logged
          </span>
        </div>

        {historyData.length > 0 ? (
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: isDarkMode ? '#090d16' : '#ffffff' }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 space-y-3">
            <div className="text-3xl">📈</div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Evaluation History Recorded Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your historical progression chart updates each time you evaluate your profile in the Predictor.
            </p>
            <div className="pt-1">
              <Link to="/predict" className="btn-primary text-xs py-2 px-4">
                Run First Evaluation →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Grid: Radar Chart & Practical Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Dimensional Skill Radar */}
        <div className="bento-card space-y-4">
          <div className="border-b border-slate-200/80 dark:border-white/10 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Multi-Vector Competency Radar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Normalized scoring across 6 key recruitment criteria (0 - 100)
            </p>
          </div>

          <div className="h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: isDarkMode ? '#cbd5e1' : '#475569', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Practical Experience & Gatekeeper Clearance Split */}
        <div className="space-y-6">
          {/* Chart A: Practical Engineering Portfolio */}
          <div className="bento-card space-y-4">
            <div className="border-b border-slate-200/80 dark:border-white/10 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Practical Asset Portfolio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct count of completed production projects and industry internships
              </p>
            </div>

            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetBarData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip content={<AssetTooltip />} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section B: Gatekeeper Compliance & Backlog Audit */}
          <div className="bento-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Gatekeeper Compliance & Eligibility Filter
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pre-interview corporate screening requirement
                </p>
              </div>
              <span className={profile.backlogs === 0 ? "badge-emerald text-[10px]" : "badge-rose text-[10px]"}>
                {profile.backlogs === 0 ? "Full Clearance" : "Action Required"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 flex items-start gap-3">
              <span className="text-xl mt-0.5">{profile.backlogs === 0 ? "✅" : "⚠️"}</span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {profile.backlogs} Active Backlog{profile.backlogs === 1 ? '' : 's'}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    (Eligibility Requirement: 0)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {profile.backlogs === 0
                    ? "Your academic record meets the zero-backlog eligibility filter enforced by campus recruiting partners."
                    : "Active backlogs immediately disqualify candidates from preliminary online assessments at Tier-1 and Product companies. Clear standing should be prioritized before technical interviews."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct AI Strategy Banner */}
      <div className="bento-card-hero p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="badge-indigo text-[10px] uppercase font-mono">
            AI Advisory Next Steps
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Ready for an Actionable Strategy Plan?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Translate these multi-vector metrics into a personalized week-by-week placement roadmap with our AI Coach.
          </p>
        </div>
        <Link to="/coach" className="btn-primary text-xs py-3 px-6 shrink-0 shadow-md">
          Consult AI Coach →
        </Link>
      </div>
    </div>
  );
};

export default Insights;
