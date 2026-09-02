
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

    if (isSignup) {
      if (!name || !email) return setError('All fields required');
      const success = onSignup(name, email);
      if (!success) setError('Account with this email already exists');
    } else {
      if (!email) return setError('Email required');
      const success = onLogin(email);
      if (!success) setError('Account not found. Please create a new account.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Animated Neural Background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-xl glass rounded-[48px] p-12 border border-slate-200 dark:border-white/10 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mb-8 shadow-2xl rotate-3">P</div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            {isSignup 
              ? 'Initialize your professional profile to begin analysis.' 
              : 'Sign in to access your placement metrics.'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Full Legal Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl px-8 py-5 text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Institutional Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@university.edu"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl px-8 py-5 text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-[0.2em] rounded-3xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 mt-8"
          >
            {isSignup ? 'Register Profile' : 'Sign In Now'}
            <span>→</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {isSignup ? 'Already have an account? Login here' : 'Need a new profile? Create account here'}
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-8 border-t border-slate-100 dark:border-white/5 pt-12">
          <div className="text-center">
            <p className="text-2xl font-black text-slate-900 dark:text-white">99.8%</p>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-slate-900 dark:text-white">Secure</p>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Storage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
