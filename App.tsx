import "./index.css";
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConfirmModal from './components/ConfirmModal';
import { StudentProfile, PredictionRecord } from './types';

// Route code-splitting for performance and smaller initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PredictPage = lazy(() => import('./pages/PredictPage'));
const Insights = lazy(() => import('./pages/Insights'));
const Coach = lazy(() => import('./pages/Coach'));
const Login = lazy(() => import('./pages/Login'));
const Account = lazy(() => import('./pages/Account'));
const Settings = lazy(() => import('./pages/Settings'));
const ResourceHub = lazy(() => import('./pages/ResourceHub'));

const PageFallback: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <div className="w-10 h-10 rounded-full border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 animate-spin"></div>
    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Command Center...</span>
  </div>
);

const DB_KEY = 'placement_pro_user_db';
const AUTH_EMAIL_KEY = 'placement_pro_current_user';
const THEME_KEY = 'placement_pro_theme';

// Helper: Safely validates and hydrates a raw student profile
const sanitizeProfile = (raw: any, fallbackName: string, fallbackEmail: string): StudentProfile => {
  return {
    user: {
      name: String(raw?.user?.name || fallbackName || 'Student'),
      email: String(raw?.user?.email || fallbackEmail || 'student@university.edu'),
      university: String(raw?.user?.university || 'Institute of Technology'),
      careerGoal: String(raw?.user?.careerGoal || 'Software Engineer'),
      avatar: raw?.user?.avatar,
    },
    year: String(raw?.year || '4th Year'),
    branch: String(raw?.branch || 'B.Tech (CSE)'),
    cgpa: typeof raw?.cgpa === 'number' && !isNaN(raw.cgpa) ? Math.min(Math.max(raw.cgpa, 0), 10) : 8.1,
    internships: typeof raw?.internships === 'number' && !isNaN(raw.internships) ? Math.max(0, raw.internships) : 1,
    internshipRelevance: typeof raw?.internshipRelevance === 'number' ? Math.min(Math.max(raw.internshipRelevance, 0), 10) : 8,
    projects: typeof raw?.projects === 'number' && !isNaN(raw.projects) ? Math.max(0, raw.projects) : 3,
    projectComplexity: typeof raw?.projectComplexity === 'number' ? Math.min(Math.max(raw.projectComplexity, 0), 10) : 8,
    projectDocumentation: typeof raw?.projectDocumentation === 'number' ? Math.min(Math.max(raw.projectDocumentation, 0), 10) : 7,
    backlogs: typeof raw?.backlogs === 'number' && !isNaN(raw.backlogs) ? Math.max(0, raw.backlogs) : 0,
    aptitudeScore: typeof raw?.aptitudeScore === 'number' ? Math.min(Math.max(raw.aptitudeScore, 0), 100) : 75,
    communicationScore: typeof raw?.communicationScore === 'number' ? Math.min(Math.max(raw.communicationScore, 0), 10) : 8,
    codingDSA: typeof raw?.codingDSA === 'number' ? Math.min(Math.max(raw.codingDSA, 0), 100) : 78,
    codingDev: typeof raw?.codingDev === 'number' ? Math.min(Math.max(raw.codingDev, 0), 100) : 82,
    predictionHistory: Array.isArray(raw?.predictionHistory) ? raw.predictionHistory : []
  };
};

const DEFAULT_DEMO_EMAIL = 'alex.student@university.edu';
const DEFAULT_DEMO_PROFILE: StudentProfile = {
  user: {
    name: 'Alex Mercer',
    email: DEFAULT_DEMO_EMAIL,
    university: 'Apex Institute of Technology',
    careerGoal: 'Software Engineer'
  },
  year: '4th Year',
  branch: 'B.Tech (CSE)',
  cgpa: 8.35,
  internships: 1,
  internshipRelevance: 8,
  projects: 3,
  projectComplexity: 8,
  projectDocumentation: 8,
  backlogs: 0,
  aptitudeScore: 78,
  communicationScore: 8,
  codingDSA: 82,
  codingDev: 85,
  predictionHistory: [
    { timestamp: Date.now() - 14 * 86400 * 1000, probability: 0.68 },
    { timestamp: Date.now() - 7 * 86400 * 1000, probability: 0.76 },
    { timestamp: Date.now() - 2 * 86400 * 1000, probability: 0.84 }
  ]
};

const loadSafeUserDb = (): Record<string, StudentProfile> => {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (!saved) {
      // Pre-seed demo user so fresh installations are immediately usable
      const initialDb = { [DEFAULT_DEMO_EMAIL]: DEFAULT_DEMO_PROFILE };
      localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
      return initialDb;
    }
    const parsed = JSON.parse(saved);
    if (typeof parsed !== 'object' || parsed === null) return {};

    const sanitizedDb: Record<string, StudentProfile> = {};
    for (const [email, prof] of Object.entries(parsed)) {
      sanitizedDb[email] = sanitizeProfile(prof, (prof as any)?.user?.name, email);
    }
    return sanitizedDb;
  } catch (err) {
    console.error("Local storage load error:", err);
    return { [DEFAULT_DEMO_EMAIL]: DEFAULT_DEMO_PROFILE };
  }
};

const App: React.FC = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Database of all student profiles
  const [userDb, setUserDb] = useState<Record<string, StudentProfile>>(loadSafeUserDb);

  // Active student email
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    const savedEmail = localStorage.getItem(AUTH_EMAIL_KEY);
    return savedEmail || DEFAULT_DEMO_EMAIL;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Verify active profile exists; prevent infinite redirect loop
  const profile = currentUserEmail && userDb[currentUserEmail] ? userDb[currentUserEmail] : null;

  useEffect(() => {
    if (currentUserEmail && !userDb[currentUserEmail]) {
      // Email in storage points to non-existent profile; safely reset
      setCurrentUserEmail(null);
      localStorage.removeItem(AUTH_EMAIL_KEY);
    }
  }, [currentUserEmail, userDb]);

  // Persist DB changes safely
  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(userDb));
    } catch (e) {
      console.error("Failed to save user database to localStorage:", e);
    }
  }, [userDb]);

  // Persist Auth changes
  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(AUTH_EMAIL_KEY, currentUserEmail);
    } else {
      localStorage.removeItem(AUTH_EMAIL_KEY);
    }
  }, [currentUserEmail]);

  // Sync theme changes with DOM
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
    setUserDb((prev) => ({
      ...prev,
      [currentUserEmail]: newProfile,
    }));
  };

  const recordPrediction = (probability: number) => {
    if (!profile || !currentUserEmail) return;
    const newRecord: PredictionRecord = {
      timestamp: Date.now(),
      probability: probability,
    };

    const updatedProfile: StudentProfile = {
      ...profile,
      predictionHistory: [...(profile.predictionHistory || []), newRecord].slice(-15),
    };
    updateProfile(updatedProfile);
  };

  const handleLogin = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (userDb[cleanEmail]) {
      setCurrentUserEmail(cleanEmail);
      return true;
    }
    return false;
  };

  const handleSignup = (name: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (userDb[cleanEmail]) return false;

    const newProfile = sanitizeProfile({}, name, cleanEmail);
    setUserDb((prev) => ({
      ...prev,
      [cleanEmail]: newProfile,
    }));
    setCurrentUserEmail(cleanEmail);
    return true;
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
  };

  const handleReset = () => {
    if (!currentUserEmail) return;
    setIsConfirmModalOpen(true);
  };

  const confirmReset = () => {
    setIsConfirmModalOpen(false);
    const emailToRemove = currentUserEmail;
    if (!emailToRemove) return;

    localStorage.removeItem(AUTH_EMAIL_KEY);
    setUserDb((prev) => {
      const next = { ...prev };
      delete next[emailToRemove];
      localStorage.setItem(DB_KEY, JSON.stringify(next));
      return next;
    });

    setCurrentUserEmail(null);
  };

  const handleExport = () => {
    if (!profile) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Placeltyics_${(profile.user.name || 'Student').replace(/\s+/g, '_')}_Profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-50 transition-colors duration-200">
        {currentUserEmail && profile && (
          <Navbar
            isDarkMode={isDarkMode}
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            profile={profile}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-grow">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route
                path="/login"
                element={
                  currentUserEmail && profile ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login onLogin={handleLogin} onSignup={handleSignup} />
                  )
                }
              />

              <Route
                path="/"
                element={
                  currentUserEmail && profile ? (
                    <Dashboard profile={profile} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/predict"
                element={
                  currentUserEmail && profile ? (
                    <PredictPage
                      profile={profile}
                      onUpdate={updateProfile}
                      onPredict={recordPrediction}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/insights"
                element={
                  currentUserEmail && profile ? (
                    <Insights profile={profile} isDarkMode={isDarkMode} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/coach"
                element={
                  currentUserEmail && profile ? (
                    <Coach profile={profile} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/account"
                element={
                  currentUserEmail && profile ? (
                    <Account profile={profile} onUpdate={updateProfile} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/settings"
                element={
                  currentUserEmail && profile ? (
                    <Settings
                      isDarkMode={isDarkMode}
                      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                      onReset={handleReset}
                      onExport={handleExport}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/resources"
                element={
                  currentUserEmail && profile ? (
                    <ResourceHub />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">Placeltyics</span>
              <span>•</span>
              <span>Placement Prediction & Career Analytics Engine</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Heuristic Readiness Modeling</span>
              <span>•</span>
              <span>Local Client Persistence</span>
            </div>
          </div>
        </footer>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title="Delete Account & Profile Records?"
          message="Are you sure you want to delete your account? All historical predictions, profile metrics, and preferences will be permanently wiped from local browser storage."
          confirmText="Yes, Permanently Delete"
          cancelText="Cancel"
          onConfirm={confirmReset}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </div>
    </HashRouter>
  );
};

export default App;
