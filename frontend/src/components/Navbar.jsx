import React from 'react';
import { Sparkles, Flame, LogOut, Compass, BrainCircuit, Activity, BarChart3, Layers, Award, Code2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AIStatusBadge } from './AIStatusBadge';

export const Navbar = ({ activeTab, onTabChange, onShowAchievements }) => {
  const { user, logout, isAuthenticated } = useAuth();

  // LeetCode pill: scroll to anchor if on dashboard, else navigate there first
  const handleLCPillClick = () => {
    if (activeTab === 'dashboard') {
      const el = document.getElementById('leetcode-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onTabChange('dashboard');
      // After navigation, give the page a moment to render then scroll
      setTimeout(() => {
        const el = document.getElementById('leetcode-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'diagnostic', label: 'Diagnostic', icon: Activity },
    { id: 'adaptive', label: 'Adaptive Quiz', icon: BrainCircuit },
    { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'interview', label: 'Mock Interview', icon: Award, badge: 'FAANG' },
    { id: 'visualizer', label: 'Visualizer Lab', icon: Code2 },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-navy-200/80 transition-all">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2 min-w-0">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            title={isAuthenticated ? 'Go to Dashboard' : 'Return to Home Landing Page'}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-navy-900 group-hover:text-brand-purple transition-colors">
                LearnLoop<span className="text-brand-purple">.ai</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-navy-400 bg-navy-100 px-1.5 py-0.5 rounded">
                PS 03 · EdTech
              </span>
            </div>
          </div>

          {/* Desktop Navigation — scrollable so it never squeezes the right cluster */}
          {(isAuthenticated || activeTab !== 'landing') && (
            <nav className="hidden md:flex items-center gap-0.5 bg-navy-50/70 p-1 rounded-xl border border-navy-200/50 overflow-x-auto scrollbar-none flex-1 min-w-0 mx-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white text-brand-purple-dark shadow-soft-xs font-bold'
                        : 'text-navy-600 hover:text-navy-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3 h-3 shrink-0 ${isActive ? 'text-brand-purple' : 'text-navy-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-rose-500 text-white font-black px-1 rounded leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Cluster — always visible, never clipped */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <AIStatusBadge />

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* LeetCode Quick-Jump Pill */}
                <button
                  onClick={handleLCPillClick}
                  title="Jump to your LeetCode heatmap"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-300/70 hover:bg-amber-500/20 transition-all shadow-soft-xs shrink-0"
                >
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="font-mono">LC</span>
                  <span className="text-amber-600/80">·</span>
                  <span>@{user?.leetcodeUsername || user?.leetcodeHandle || (typeof window !== 'undefined' && localStorage.getItem('learnloop_lc_handle')) || 'ganga_kaurr'}</span>
                </button>

                {/* Level / XP Pill — opens modal lifted to App root */}
                <button
                  onClick={onShowAchievements}
                  title="View Achievements & XP Progression"
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 hover:bg-brand-purple/15 transition-all shadow-soft-xs shrink-0"
                >
                  <Award className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Lv.{user?.level || 3}</span>
                </button>

                {/* Streak Counter */}
                <div 
                  title="Consecutive Learning Streak"
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-soft-xs shrink-0"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
                  <span>{user?.streakDays || 1}d</span>
                </div>

                {/* User Avatar & Bright Sign Out Button */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-navy-200 shrink-0">
                  {/* Avatar + Name + Role */}
                  <div className="flex items-center gap-1.5 cursor-default">
                    <div 
                      className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 border ${
                        user?.email?.includes('@guest')
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
                      }`}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div className="hidden sm:flex flex-col leading-none">
                      <span className="text-xs font-bold text-navy-800 whitespace-nowrap">
                        {user?.name || 'Student'}
                      </span>
                      <span className={`text-[10px] font-semibold whitespace-nowrap ${
                        user?.email?.includes('@guest')
                          ? 'text-amber-600'
                          : 'text-brand-purple'
                      }`}>
                        {user?.email?.includes('@guest') ? 'Guest' : 'Student'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out of LearnLoop"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-soft-xs shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onTabChange('auth')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-all shadow-soft-xs"
                >
                  Sign In / Register
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
