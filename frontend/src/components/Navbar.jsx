import React, { useState } from 'react';
import { Sparkles, Flame, User as UserIcon, LogOut, Compass, BrainCircuit, Activity, BarChart3, BookOpen, Layers, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AIStatusBadge } from './AIStatusBadge';
import { AchievementsModal } from './AchievementsModal';

export const Navbar = ({ activeTab, onTabChange }) => {
  const { user, logout, demoLogin, isAuthenticated } = useAuth();
  const [showAchievements, setShowAchievements] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'diagnostic', label: 'Diagnostic', icon: Activity },
    { id: 'adaptive', label: 'Adaptive Quiz', icon: BrainCircuit },
    { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-navy-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
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

          {/* Desktop Navigation for Authenticated User */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-navy-50/70 p-1 rounded-xl border border-navy-200/50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-brand-purple-dark shadow-soft-xs font-bold'
                        : 'text-navy-600 hover:text-navy-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-purple' : 'text-navy-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            <AIStatusBadge />

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Level / XP Pill */}
                <button
                  onClick={() => setShowAchievements(true)}
                  title="View Achievements & XP Progression"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 hover:bg-brand-purple/15 transition-all shadow-soft-xs"
                >
                  <Award className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Lv. {user?.level || 3}</span>
                  <span className="text-[10px] text-brand-purple/70 font-mono hidden sm:inline">({user?.xp || 1450} XP)</span>
                </button>

                {/* Streak Counter */}
                <div 
                  title="Consecutive Learning Streak"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-soft-xs"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
                  <span>{user?.streakDays || 4}d</span>
                </div>

                {/* User Pill / Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-navy-200">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center text-xs border border-brand-purple/20">
                      {user?.name ? user.name.charAt(0) : 'A'}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-semibold text-navy-900 leading-tight truncate max-w-[110px]">
                        {user?.name || 'Alex Mercer'}
                      </p>
                      <p className="text-[10px] text-navy-400 font-medium">
                        {user?.isDemo ? 'Demo Student' : 'Student'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1.5 text-navy-400 hover:text-brand-rose hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={demoLogin}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-purple-dark bg-brand-purple-light hover:bg-brand-purple/15 border border-brand-purple/20 transition-all shadow-soft-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                  <span>1-Click Demo</span>
                </button>
                <button
                  onClick={() => onTabChange('auth')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-all shadow-soft-xs"
                >
                  Sign In
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Unlocked Achievements & XP Progression Modal */}
      <AchievementsModal 
        isOpen={showAchievements} 
        onClose={() => setShowAchievements(false)} 
        user={user} 
      />
    </header>
  );
};

