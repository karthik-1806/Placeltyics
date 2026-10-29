import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ResourceItem {
  name: string;
  link: string;
  desc: string;
  tag: string;
  type: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  emoji: string;
  description: string;
  items: ResourceItem[];
}

const ResourceHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const categories: ResourceCategory[] = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      emoji: '📓',
      description: 'Structured roadmaps, topic-wise practice sheets, and contest preparation.',
      items: [
        {
          name: 'Striver A2Z DSA Course & Sheet',
          link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
          desc: 'Comprehensive step-by-step curriculum from basic recursion to dynamic programming.',
          tag: 'Curriculum',
          type: 'Curated Sheet'
        },
        {
          name: 'NeetCode 150 Essential Problems',
          link: 'https://neetcode.io/practice',
          desc: 'Curated list of 150 pattern-based LeetCode interview questions with video solutions.',
          tag: 'Interview Sheet',
          type: 'Interactive Tool'
        },
        {
          name: 'CSES Algorithmic Problem Set',
          link: 'https://cses.fi/problemset/',
          desc: 'Classic European-style algorithmic tasks for advanced competitive programming.',
          tag: 'Advanced',
          type: 'Problem Set'
        }
      ]
    },
    {
      id: 'sys-design',
      title: 'System Design & Core CS',
      emoji: '🏗️',
      description: 'High-level architecture, low-level design patterns, OS, and database indexing.',
      items: [
        {
          name: 'Donne Martin System Design Primer',
          link: 'https://github.com/donnemartin/system-design-primer',
          desc: 'Open-source guide to designing scalable distributed systems with architecture diagrams.',
          tag: 'HLD Guide',
          type: 'GitHub Repo'
        },
        {
          name: 'ByteByteGo System Design Blog',
          link: 'https://bytebytego.com/',
          desc: 'High-signal visual explainers for rate limiters, caching architectures, and CDNs.',
          tag: 'Visual Architecture',
          type: 'Technical Blog'
        },
        {
          name: 'Grokking System Design Courses',
          link: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers',
          desc: 'Industry standard for structuring answers in senior software engineering interviews.',
          tag: 'Mock Case Studies',
          type: 'Course'
        }
      ]
    },
    {
      id: 'interview',
      title: 'Interview Preparation & Behavioral',
      emoji: '🗣️',
      description: 'Mock interview platforms, STAR framework behavioral stories, and HR questions.',
      items: [
        {
          name: 'Pramp Peer Mock Interviews',
          link: 'https://www.pramp.com/',
          desc: 'Free peer-to-peer technical and behavioral mock interview platform with live coding.',
          tag: 'Live Mock',
          type: 'Mock Platform'
        },
        {
          name: 'Behavioral STAR Method Guide (IndiaBix)',
          link: 'https://www.indiabix.com/hr-interview/questions-and-answers/',
          desc: 'Top 50 standard behavioral questions for mass recruiters and product tech interviews.',
          tag: 'Behavioral',
          type: 'Question Bank'
        },
        {
          name: 'CareerCup Real Interview Experiences',
          link: 'https://careercup.com/',
          desc: 'Crowdsourced questions recently asked at Microsoft, Amazon, Google, and top startups.',
          tag: 'Recent Questions',
          type: 'Archive'
        }
      ]
    },
    {
      id: 'resume',
      title: 'Resume Templates & Review',
      emoji: '📄',
      description: 'ATS-compatible LaTeX templates and resume bullet point optimization.',
      items: [
        {
          name: "Jake's Resume Template (Overleaf LaTeX)",
          link: 'https://www.overleaf.com/latex/templates/jakes-resume/syzyrnzhfshf',
          desc: 'Single-page gold-standard tech template favored by Silicon Valley & Indian tech recruiters.',
          tag: 'LaTeX ATS',
          type: 'LaTeX Template'
        },
        {
          name: 'Resume Worded ATS Analyzer',
          link: 'https://resumeworded.com/',
          desc: 'AI-assisted feedback on keyword relevance, action verbs, and quantified achievements.',
          tag: 'ATS Optimization',
          type: 'Evaluation Tool'
        },
        {
          name: 'Canva Professional Tech Resume Layouts',
          link: 'https://www.canva.com/resumes/templates/technology/',
          desc: 'Clean visual layouts suitable for frontend, UX design, and developer relations roles.',
          tag: 'Visual Portfolio',
          type: 'Design Template'
        }
      ]
    }
  ];

  const allTags = ['All', 'Curriculum', 'Interview Sheet', 'HLD Guide', 'Live Mock', 'LaTeX ATS'];

  // Filtered categories & items
  const filteredCategories = categories.map((cat) => {
    const matchedItems = cat.items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === 'All' || item.tag === selectedTag;
      return matchesSearch && matchesTag;
    });

    return {
      ...cat,
      items: matchedItems
    };
  }).filter((cat) => cat.items.length > 0);

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
          Verified Resource Hub
        </span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curated Placement Resource Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            High-signal algorithmic roadmaps, ATS-compliant resume formats, and system design primers verified for college recruitment.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search resources, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field-input text-xs py-2 px-3"
          />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">Filter:</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Category Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} id={category.id} className="bento-card space-y-4 scroll-mt-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{category.emoji}</span>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {category.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </div>
                <span className="badge-neutral text-[10px] font-mono shrink-0">
                  {category.items.length} Resource{category.items.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-2.5">
                {category.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/[0.08] border border-slate-200/70 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all group shadow-sm hover:shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.name}
                        </span>
                        <span className="badge-indigo text-[10px] py-0 px-1.5 font-mono">
                          {item.type}
                        </span>
                        <span className="badge-neutral text-[10px] py-0 px-1.5">
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                        ↗
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bento-card text-center p-12 space-y-3">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            No resources match your current filter "{searchQuery || selectedTag}".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('All');
            }}
            className="btn-secondary text-xs py-2 px-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceHub;
