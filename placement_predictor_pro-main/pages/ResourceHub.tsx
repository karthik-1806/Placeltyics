
import React from 'react';
import { Link } from 'react-router-dom';

const ResourceHub: React.FC = () => {
  const sections = [
    {
      id: 'dsa',
      title: 'DSA Roadmap 2025',
      emoji: '📓',
      items: [
        { name: 'Striver A2Z DSA Course', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', desc: 'Most comprehensive sheet for interviews.' },
        { name: 'NeetCode 150', link: 'https://neetcode.io/practice', desc: 'Curated list of 150 essential LeetCode problems.' },
        { name: 'CSES Problem Set', link: 'https://cses.fi/problemset/', desc: 'Advanced algorithmic challenges.' }
      ]
    },
    {
      id: 'sys-design',
      title: 'System Design Basics',
      emoji: '🏗️',
      items: [
        { name: 'Grokking System Design', link: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers', desc: 'Industry standard for HLD/LLD.' },
        { name: 'ByteByteGo', link: 'https://bytebytego.com/', desc: 'Visual guides to complex systems.' },
        { name: 'System Design Primer', link: 'https://github.com/donnemartin/system-design-primer', desc: 'Free open source HLD guide.' }
      ]
    },
    {
      id: 'interview',
      title: 'Mock HR Interview',
      emoji: '🗣️',
      items: [
        { name: 'Pramp', link: 'https://www.pramp.com/', desc: 'Free peer-to-peer mock interviews.' },
        { name: 'Top 50 HR Questions', link: 'https://www.indiabix.com/hr-interview/questions-and-answers/', desc: 'Preparation for behavioral rounds.' },
        { name: 'Big Tech Resume Keywords', link: 'https://careercup.com/', desc: 'Interview questions from top firms.' }
      ]
    },
    {
      id: 'resume',
      title: 'Resume Templates',
      emoji: '📄',
      items: [
        { name: 'Jake’s Resume (LaTeX)', link: 'https://www.overleaf.com/latex/templates/jakes-resume/syzyrnzhfshf', desc: 'Gold standard for SWE resumes.' },
        { name: 'Canva Professional Tech', link: 'https://www.canva.com/resumes/templates/technology/', desc: 'Modern visual designs.' },
        { name: 'Resume Worded', link: 'https://resumeworded.com/', desc: 'AI-powered resume score tool.' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Button explicitly to Dashboard */}
      <Link 
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Resource <span className="text-gradient">Hub.</span></h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-lg mt-2">Curated high-signal assets for your placement journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map(section => (
          <div key={section.id} id={section.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{section.emoji}</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{section.title}</h3>
            </div>

            <div className="space-y-4">
              {section.items.map(item => (
                <a 
                  key={item.name} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-lg transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{item.name}</span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">↗</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceHub;
