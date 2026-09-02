
import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { StudentProfile } from '../types';

interface InsightsProps {
  profile: StudentProfile;
  isDarkMode: boolean;
}

const Insights: React.FC<InsightsProps> = ({ profile, isDarkMode }) => {
  const radarData = [
    { subject: 'Academic', A: profile.cgpa * 10, fullMark: 100 },
    { subject: 'DSA', A: profile.codingDSA, fullMark: 100 },
    { subject: 'Dev', A: profile.codingDev, fullMark: 100 },
    { subject: 'Aptitude', A: profile.aptitudeScore, fullMark: 100 },
    { subject: 'Soft Skills', A: profile.communicationScore * 10, fullMark: 100 },
    { subject: 'Practical', A: Math.min((profile.internships + profile.projects) * 15, 100), fullMark: 100 },
  ];

  const barData = [
    { name: 'Internships', value: profile.internships },
    { name: 'Projects', value: profile.projects },
    { name: 'Backlogs', value: profile.backlogs },
  ];

  const historyData = profile.predictionHistory.map((record, index) => ({
    name: `Entry ${index + 1}`,
    value: Math.round(record.probability * 100),
    fullDate: new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
          <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 tracking-widest mb-1">Placement Probability</p>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{payload[0].value}%</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-1">{payload[0].payload.fullDate}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Back Button explicitly to Dashboard */}
      <Link 
        to="/"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-[900] text-slate-900 dark:text-white tracking-tight leading-tight">
            Profile <span className="text-gradient">Intelligence.</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg mt-2">Comprehensive multi-dimensional analysis of your readiness DNA.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800">
            Current Status: {profile.predictionHistory.length > 0 ? 'Analyzed' : 'Pending'}
          </div>
        </div>
      </div>

      {historyData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/10 dark:shadow-black/20 relative overflow-hidden animate-in fade-in duration-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Growth Journey</h3>
              <p className="text-sm text-slate-500 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Historical Probability Progression</p>
            </div>
            <div className="hidden sm:block text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              {historyData.length} records analyzed
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#334155', fontSize: 10, fontWeight: 800 }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#334155', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2 }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)"
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 3, stroke: isDarkMode ? '#020617' : '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-xl font-black mb-8 text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">DNA</span>
            Skill Matrix
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#94a3b8' : '#1e293b', fontSize: 11, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2"></div>
          <h3 className="text-xl font-black mb-8 text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">EXP</span>
            Activity Breakdown
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#1e293b', fontSize: 11, fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#1e293b', fontSize: 11, fontWeight: 800 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 dark:bg-indigo-950/40 rounded-[50px] p-16 text-white relative overflow-hidden border border-transparent dark:border-indigo-900/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-64 -mt-64 blur-[120px]" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="w-16 h-16 bg-white/10 dark:bg-indigo-500/20 rounded-3xl flex items-center justify-center text-3xl backdrop-blur-md border border-white/20 dark:border-indigo-500/30 shadow-2xl">🤖</div>
          <h2 className="text-4xl font-[900] tracking-tight max-w-2xl leading-tight">
            Need a professional <span className="text-gradient">Action Plan?</span>
          </h2>
          <p className="text-slate-400 dark:text-indigo-200/60 text-lg font-medium max-w-xl">
            Our AI Engine builds high-context roadmaps based on your profile history to ensure you hit the 90%+ probability bracket.
          </p>
          <div className="pt-4">
            <Link to="/coach" className="px-14 py-6 bg-white dark:bg-indigo-600 text-slate-900 dark:text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-700 transition-all shadow-2xl shadow-black/40 inline-block">
              Analyze with Career AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
