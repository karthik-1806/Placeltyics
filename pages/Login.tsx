import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => boolean;
  onSignup: (name: string, email: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return setError('Please enter a valid email address');
    }

    if (isSignup) {
      if (!cleanName) return setError('Please enter your full legal name');
      const success = onSignup(cleanName, cleanEmail);
      if (!success) setError('An account with this email already exists. Please log in.');
    } else {
      const success = onLogin(cleanEmail);
      if (!success) {
        setError('No account found for this email. Switch to "Create Account" below.');
      }
    }
  };

  const handleDemoLogin = () => {
    setError('');
    // Use pre-configured demo account or create it
    const demoEmail = 'alex.student@university.edu';
    const demoName = 'Alex Mercer';
    const loggedIn = onLogin(demoEmail);
    if (!loggedIn) {
      onSignup(demoName, demoEmail);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bento-card p-8 sm:p-10 space-y-6 shadow-lg border border-slate-200/80 dark:border-slate-800">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-md">
            P
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-2">
            {isSignup ? 'Create Student Profile' : 'Student Access Portal'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isSignup
              ? 'Initialize your campus placement analytics profile.'
              : 'Sign in to access your placement readiness dashboard.'}
          </p>
        </div>

        {/* Demo Fast Access Pill */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-indigo-950 dark:text-indigo-200 block">Evaluate Demo Student</span>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400">Pre-populated CSE 4th Year metrics</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 shadow-sm transition-all"
          >
            Launch Demo →
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="field-label">Student Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="field-input"
              />
            </div>
          )}

          <div>
            <label className="field-label">Institutional / Student Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@college.edu"
              className="field-input"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-xs font-bold tracking-wide uppercase shadow-sm"
            >
              {isSignup ? 'Create Profile & Enter Dashboard' : 'Sign In with Email →'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isSignup
              ? 'Already registered? Return to Sign In'
              : "Don't have a profile? Create Account here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
