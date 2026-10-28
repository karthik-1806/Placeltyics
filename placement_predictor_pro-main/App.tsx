import "./index.css";
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PredictPage from './pages/PredictPage';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Coach from './pages/Coach';
import Login from './pages/Login';
import Account from './pages/Account';
import Settings from './pages/Settings';
import ResourceHub from './pages/ResourceHub';
import { StudentProfile, PredictionRecord } from './types';



const DB_KEY = 'placement_pro_user_db';
const AUTH_EMAIL_KEY = 'placement_pro_current_user';
const THEME_KEY = 'placement_pro_theme';

const DEFAULT_PROFILE_TEMPLATE = (name: string, email: string): StudentProfile => ({
  user: {
    name,
    email,
    university: '',
    careerGoal: 'Software Engineer'
  },
  year: '4th Year',
  branch: 'B.Tech (CSE)',
  cgpa: 7.5,
  internships: 0,
  internshipRelevance: 5,
  projects: 1,
  projectComplexity: 5,
  projectDocumentation: 5,
  backlogs: 0,
  aptitudeScore: 60,
  communicationScore: 7,
  codingDSA: 50,
  codingDev: 50,
  predictionHistory: []
});

const App: React.FC = () => {
  // Database of all users
  const [userDb, setUserDb] = useState<Record<string, StudentProfile>>(() => {
    const saved = localStorage.getItem(DB_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Currently logged in user email
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_EMAIL_KEY);
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Current profile derived from DB
  const profile = currentUserEmail ? userDb[currentUserEmail] : null;

  // Persist DB changes
  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(userDb));
  }, [userDb]);

  // Persist Auth changes
  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(AUTH_EMAIL_KEY, currentUserEmail);
    } else {
      localStorage.removeItem(AUTH_EMAIL_KEY);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const updateProfile = (newProfile: StudentProfile) => {
    if (!currentUserEmail) return;
    setUserDb(prev => ({
      ...prev,
      [currentUserEmail]: newProfile
    }));
  };

  const recordPrediction = (probability: number) => {
    if (!profile || !currentUserEmail) return;
    const newRecord: PredictionRecord = {
      timestamp: Date.now(),
      probability: probability
    };
    
    const updatedProfile = {
      ...profile,
      predictionHistory: [...profile.predictionHistory, newRecord].slice(-10)
    };
    updateProfile(updatedProfile);
  };

  const handleLogin = (email: string) => {
    if (userDb[email]) {
      setCurrentUserEmail(email);
      return true;
    }
    return false;
  };

  const handleSignup = (name: string, email: string) => {
    if (userDb[email]) return false;
    const newProfile = DEFAULT_PROFILE_TEMPLATE(name, email);
    setUserDb(prev => ({
      ...prev,
      [email]: newProfile
    }));
    setCurrentUserEmail(email);
    return true;
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
  };

  const handleReset = () => {
    if (!currentUserEmail) return;
    const confirmDelete = window.confirm('ARE YOU SURE? This will permanently delete your account and all associated prediction data. This cannot be undone.');
    
    if (confirmDelete) {
      const emailToRemove = currentUserEmail;
      
      // Clear local storage for auth immediately
      localStorage.removeItem(AUTH_EMAIL_KEY);
      
      // Remove from DB first to ensure state is clean
      setUserDb(prev => {
        const next = { ...prev };
        delete next[emailToRemove];
        localStorage.setItem(DB_KEY, JSON.stringify(next)); // Force synchronous save
        return next;
      });

      // Clear current user last to trigger navigation
      setCurrentUserEmail(null);
    }
  };

  const handleExport = () => {
    if (!profile) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `PlacementPro_Profile_${profile.user.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col transition-colors duration-500 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {currentUserEmail && profile && (
          <Navbar 
            isDarkMode={isDarkMode} 
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            profile={profile}
            onLogout={handleLogout}
          />
        )}
        <main className="flex-grow bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <Routes>
            <Route 
              path="/login" 
              element={currentUserEmail ? <Navigate to="/" /> : <Login onLogin={handleLogin} onSignup={handleSignup} />} 
            />
            <Route 
              path="/" 
              element={currentUserEmail && profile ? <Dashboard profile={profile} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/predict" 
              element={currentUserEmail && profile ? <PredictPage profile={profile} onUpdate={updateProfile} onPredict={recordPrediction} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/insights" 
              element={currentUserEmail && profile ? <Insights profile={profile} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/coach" 
              element={currentUserEmail && profile ? <Coach profile={profile} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/account" 
              element={currentUserEmail && profile ? <Account profile={profile} onUpdate={updateProfile} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={currentUserEmail ? (
                <Settings 
                  isDarkMode={isDarkMode} 
                  toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                  onReset={handleReset} 
                  onExport={handleExport}
                />
              ) : <Navigate to="/login" />} 
            />
            <Route 
              path="/resources" 
              element={currentUserEmail ? <ResourceHub /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              © 2025 PlacementPro System • The Global Standard for Career Intelligence
            </p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
