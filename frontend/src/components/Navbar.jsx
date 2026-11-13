import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, LogOut, Compass, BrainCircuit, Activity, BarChart3, Layers, Award, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AIStatusBadge } from './AIStatusBadge';

// Official Wikimedia LeetCode Logo (Black, Orange & Grey)
export const LeetCodeLogo = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="-4 -2 102 118" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M67.5068339,83.0664138 C70.0005384,80.5763786 74.0371402,80.5828822 76.5228362,83.0809398 C79.0085322,85.5789975 79.00204,89.6226456 76.5083355,92.1126808 L65.4351451,103.169577 C55.2192332,113.370744 38.5604663,113.518673 28.1722578,103.513204 C28.112217,103.455678 23.486583,98.9201326 8.22702585,83.9570195 C-1.92478479,74.0028895 -2.93614945,58.0748736 6.61697549,47.8463644 L24.4286944,28.7745461 C33.9100043,18.6218594 51.3874487,17.5122246 62.2279907,26.2789232 L78.4052912,39.3620235 C81.1448956,41.5776292 81.5728103,45.5984975 79.3610655,48.3428842 C77.1493207,51.0872709 73.1354592,51.5159327 70.3958548,49.300327 L54.2186634,36.2173149 C48.5492813,31.6325105 38.631911,32.2621597 33.7398535,37.5006265 L15.9279056,56.5726899 C11.2772073,61.552182 11.7865613,69.5740156 17.1461283,74.8292186 C28.3515339,85.8169393 36.9874071,94.2846214 36.9973988,94.294225 C42.3981571,99.4959838 51.130862,99.418438 56.43358,94.1233737 L67.5068339,83.0664138 Z"
      fill="#FFA116"
      fillRule="nonzero"
    />
    <path
      d="M40.6069914,72.0014117 C37.086019,72.0014117 34.2317068,69.142117 34.2317068,65.6149982 C34.2317068,62.0878794 37.086019,59.2285847 40.6069914,59.2285847 L87.6247154,59.2285847 C91.1456879,59.2285847 94,62.0878794 94,65.6149982 C94,69.142117 91.1456879,72.0014117 87.6247154,72.0014117 L40.6069914,72.0014117 Z"
      fill="#9E9E9E"
    />
    <path
      d="M49.4124315,2.02335002 C51.8178981,-0.552320454 55.852269,-0.686893945 58.4234511,1.72277172 C60.9946333,4.13243738 61.1289722,8.17385083 58.7235056,10.7495213 L15.9282277,56.5728697 C11.2773659,61.551984 11.7867168,69.5737689 17.1459309,74.8291832 L36.9094236,94.2091099 C39.4255514,96.6764051 39.4686234,100.719828 37.0056277,103.240348 C34.5426319,105.760868 30.5062548,105.804016 27.990127,103.33672 L8.22654289,83.9567041 C-1.92467414,74.0021005 -2.93603527,58.0741402 6.61751533,47.846311 L49.4124315,2.02335002 Z"
      fill="#1A1A1A"
    />
  </svg>
);

export const Navbar = ({ activeTab, onTabChange, onShowAchievements }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [localLCHandle, setLocalLCHandle] = useState(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('learnloop_lc_handle') : null);
  });

  // Listen to cross-component LeetCode handle updates
  useEffect(() => {
    const handleLCUpdate = (e) => {
      if (e?.detail?.handle) {
        setLocalLCHandle(e.detail.handle);
      } else if (typeof window !== 'undefined') {
        setLocalLCHandle(localStorage.getItem('learnloop_lc_handle'));
      }
    };
    window.addEventListener('learnloop:lc_updated', handleLCUpdate);
    window.addEventListener('storage', handleLCUpdate);
    return () => {
      window.removeEventListener('learnloop:lc_updated', handleLCUpdate);
      window.removeEventListener('storage', handleLCUpdate);
    };
  }, []);

  // Use user's own profile leetcodeUsername if logged in; don't leak other accounts' localStorage handles
  const displayLCHandle = user?.leetcodeUsername || (user ? null : localLCHandle);

  // LeetCode pill: scroll to anchor if on dashboard, else navigate there first
  const handleLCPillClick = () => {
    if (activeTab === 'dashboard') {
      const el = document.getElementById('leetcode-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (isAuthenticated) {
      onTabChange('dashboard');
      // After navigation, give the page a moment to render then scroll
      setTimeout(() => {
        const el = document.getElementById('leetcode-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else {
      const el = document.getElementById('leetcode-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        onTabChange('auth');
      }
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-200/60 transition-all">
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

            {/* Official LeetCode Quick-Jump Pill — always visible (logged in & logged out) */}
            <button
              onClick={handleLCPillClick}
              title={displayLCHandle ? `Jump to @${displayLCHandle}'s LeetCode heatmap` : 'Connect your LeetCode profile'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-soft-xs shrink-0 cursor-pointer ${
                displayLCHandle
                  ? 'bg-amber-500/10 text-amber-700 border border-amber-300/70 hover:bg-amber-500/20'
                  : 'bg-navy-50 text-navy-600 border border-dashed border-navy-300 hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5'
              }`}
            >
              <LeetCodeLogo className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono">LC</span>
              <span className="opacity-60">·</span>
              <span>{displayLCHandle ? `@${displayLCHandle}` : '+ Link ID'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
