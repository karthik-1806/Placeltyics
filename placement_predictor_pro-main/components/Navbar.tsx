
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StudentProfile } from '../types';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  profile: StudentProfile;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, profile, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Predictor', path: '/predict' },
    { name: 'Insights', path: '/insights' },
    { name: 'AI Coach', path: '/coach' }
  ];

  return (
    <nav className="sticky top-4 z-50 px-6 mb-6">
      <div className="max-w-7xl mx-auto glass rounded-[24px] border border-slate-200 dark:border-white/20 shadow-xl shadow-indigo-100/10 dark:shadow-black/20 px-6">
        <div className="flex justify-between items-center h-20 py-3">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 group-hover:rotate-6 transition-transform">P</div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:inline">
                Placement<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    location.pathname === item.path
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-700 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Neural Validated
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              >
                <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-xs border-2 border-white dark:border-slate-900">
                  {profile.user.name.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none uppercase tracking-wider">{profile.user.name || 'User'}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Free Tier</p>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{profile.user.email}</p>
                  </div>
                  <Link 
                    to="/account" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    👤 Profile Account
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    ⚙️ Settings & Privacy
                  </Link>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
