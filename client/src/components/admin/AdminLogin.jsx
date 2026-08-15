import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Terminal, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to /admin/messages
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/admin/messages" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!email.trim() || !password) {
      setError('Please provide both admin credentials.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        navigate('/admin/messages', { replace: true });
      } else {
        setError(result.error || 'Authentication failed. Invalid credentials.');
      }
    } catch (err) {
      setError('Authentication failed. Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e10] text-slate-200 flex flex-col justify-between font-mono selection:bg-[#00ff9d] selection:text-black">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-[#040c0e] py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
            <Terminal className="w-4 h-4 text-[#00ff9d]" />
            <span className="text-slate-200 tracking-wider">PORTFOLIO // ADMIN_GATEWAY</span>
          </div>
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-[#00ff9d] transition-colors flex items-center gap-1 font-semibold"
          >
            <span>← Public Portfolio</span>
          </a>
        </div>
      </header>

      {/* Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-xl bg-[#0a1619] border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.7)] space-y-7">
          
          {/* Window Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
              <span className="ml-1 text-slate-300 font-bold text-xs">admin_login.sh</span>
            </div>
            <Lock className="w-4 h-4 text-[#00ff9d]" />
          </div>

          {/* Form Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Admin Sign In
            </h1>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-3.5 text-xs text-red-300 flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username Field */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  autoComplete="username"
                  required
                  className="w-full bg-[#040c0e] border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-[#040c0e] border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full pt-3 mt-4 py-3.5 px-6 rounded-xl bg-[#00ff9d] text-black font-bold text-sm hover:bg-[#00ff9d]/90 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,255,157,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#040c0e] py-4 text-center text-xs text-slate-500">
        <span>Portfolio Private Console // Rithish S</span>
      </footer>
    </div>
  );
};

export default AdminLogin;
