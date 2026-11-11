import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, Search, Zap, RotateCcw, GitFork, X, CheckCircle2, Lock, Sparkles } from 'lucide-react';

const iconMap = {
  Award,
  Flame,
  Search,
  Zap,
  RotateCcw,
  GitFork
};

export const AchievementsModal = ({ isOpen, onClose, user }) => {
  // Close on Escape key (hook must always run before any return)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const xp = user?.xp || 1450;
  const level = user?.level || 3;
  const levelTitle = user?.levelTitle || 'Algorithmic Explorer';
  const nextLevelXp = level * 600;
  const currentLevelProgress = xp % 600;
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / 600) * 100));

  const achievements = user?.achievements || [
    { id: 'first_diagnostic', title: 'Diagnostic Trailblazer', description: 'Completed initial 10-topic diagnostic survey', icon: 'Award', unlocked: true, unlockedAt: '2 days ago' },
    { id: 'streak_4', title: 'Consistency Champion', description: 'Maintained 4-day active learning streak', icon: 'Flame', unlocked: true, unlockedAt: 'Yesterday' },
    { id: 'binary_master', title: 'Binary Search Ace', description: 'Reached 90% mastery on logarithmic search', icon: 'Search', unlocked: true, unlockedAt: '3 days ago' },
    { id: 'speed_demon', title: 'Speed Demon', description: 'Solved an adaptive challenge in under 15 seconds', icon: 'Zap', unlocked: true, unlockedAt: 'Yesterday' },
    { id: 'recursion_conqueror', title: 'Recursion Demystifier', description: 'Reach ≥ 50% mastery on Recursion base cases', icon: 'RotateCcw', unlocked: false },
    { id: 'tree_climber', title: 'Tree Climber', description: 'Reach 75% on hierarchical tree traversals', icon: 'GitFork', unlocked: false }
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
      >
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-3xl border border-navy-200/80 shadow-soft-xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900">Cognitive Achievements</h3>
                <p className="text-xs text-navy-500">Milestones unlocked through verified problem-solving</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-navy-400 hover:text-navy-700 hover:bg-navy-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Level & XP Progression Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 to-navy-900 text-white space-y-3 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple-light">
                  Student Rank
                </span>
                <h4 className="text-lg font-bold">Level {level} · {levelTitle}</h4>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-brand-purple/30 text-brand-purple-light rounded-lg border border-brand-purple/40">
                {xp} Total XP
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-navy-300">
                <span>Next Rank: Level {level + 1}</span>
                <span>{currentLevelProgress} / 600 XP</span>
              </div>
              <div className="w-full bg-navy-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-purple to-brand-blue h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {achievements.map((ach) => {
              const Icon = iconMap[ach.icon] || Award;
              const isUnlocked = ach.unlocked;

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-white border-brand-purple/30 shadow-soft-xs'
                      : 'bg-navy-50/50 border-dashed border-navy-200 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked 
                      ? 'bg-brand-purple/10 text-brand-purple' 
                      : 'bg-navy-200 text-navy-400'
                  }`}>
                    {isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-navy-900">{ach.title}</h5>
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />}
                    </div>
                    <p className="text-[11px] text-navy-500 leading-snug">{ach.description}</p>
                    {isUnlocked && ach.unlockedAt && (
                      <span className="text-[10px] text-brand-purple font-medium block pt-0.5">
                        Unlocked {ach.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

