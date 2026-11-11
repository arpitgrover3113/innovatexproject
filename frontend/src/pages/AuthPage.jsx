import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, Compass, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ onAuthSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    learningGoals: 'Master DSA & Ace Tech Interviews',
    skillLevel: 'Intermediate',
    selectedSubjects: ['Data Structures & Algorithms']
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl border border-navy-200/80 shadow-soft-xl p-8"
      >
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white mx-auto shadow-soft-sm mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            {isRegister ? 'Create your LearnLoop account' : 'Welcome back to LearnLoop'}
          </h2>
          <p className="text-xs text-navy-500 mt-1">
            {isRegister 
              ? 'Join thousands mastering technical domains with adaptive AI'
              : 'Sign in to continue your learning journey'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-navy-200 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-navy-200 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-navy-200 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Primary Subject Track</label>
                <select
                  name="selectedSubjects"
                  value={formData.selectedSubjects[0]}
                  onChange={(e) => setFormData(p => ({ ...p, selectedSubjects: [e.target.value] }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-navy-200 focus:outline-none focus:border-brand-purple bg-white"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms (DSA Track)</option>
                  <option value="System Design">System Design & Distributed Systems</option>
                  <option value="Computer Systems">Computer Architecture & OS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Initial Skill Assessment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setFormData(p => ({ ...p, skillLevel: lvl }))}
                      className={`py-1.5 text-xs rounded-lg border font-medium transition-all ${
                        formData.skillLevel === lvl
                          ? 'border-brand-purple bg-brand-purple/10 text-brand-purple-dark font-bold'
                          : 'border-navy-200 text-navy-600 hover:bg-navy-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Primary Learning Goal</label>
                <input
                  type="text"
                  name="learningGoals"
                  value={formData.learningGoals}
                  onChange={handleChange}
                  placeholder="e.g. Master interview questions"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-navy-200 focus:outline-none focus:border-brand-purple"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold shadow-soft-xs hover:shadow-soft-sm transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account & Begin' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-6 text-center text-xs text-navy-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-brand-purple font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to LearnLoop?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-brand-purple font-bold hover:underline"
              >
                Create an Account
              </button>
            </p>
          )}
        </div>

      </motion.div>
    </div>
  );
};

