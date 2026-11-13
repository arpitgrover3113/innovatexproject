import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, Trophy, ArrowRight, Zap, CheckCircle2, X } from 'lucide-react';

// Celebratory Web Audio Chime (zero dependencies, completely safe)
const playCelebratoryChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major ascending arpeggio)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
    });
  } catch (e) {
    // Audio autoplay restrictions or headless environment - gracefully silent
  }
};

export const LevelUpModal = ({ isOpen, onClose, levelData, onOpenAchievements }) => {
  useEffect(() => {
    if (isOpen) {
      playCelebratoryChime();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !levelData) return null;

  const { level, oldLevel, title, xpGained, totalXp, reason } = levelData;
  const currentProgress = totalXp % 600;
  const progressPercent = Math.min(100, Math.round((currentProgress / 600) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
        {/* Ambient Celebration Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-96 h-96 bg-brand-purple/30 rounded-full blur-3xl animate-pulse" />
          <div className="w-80 h-80 bg-amber-400/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-300 shadow-2xl overflow-hidden text-center space-y-5 z-10"
        >
          {/* Confetti sparkle accents */}
          <div className="absolute top-3 left-4 text-amber-400 text-lg select-none pointer-events-none animate-bounce">
            ✦
          </div>
          <div className="absolute top-8 right-6 text-brand-purple text-base select-none pointer-events-none animate-pulse">
            ★
          </div>
          <div className="absolute bottom-6 left-6 text-purple-400 text-sm select-none pointer-events-none">
            ✦
          </div>
          <div className="absolute bottom-8 right-8 text-amber-500 text-xl select-none pointer-events-none animate-bounce">
            ✨
          </div>

          {/* Close X */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-navy-100 text-navy-400 hover:text-navy-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Golden Trophy Icon Badge */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-3xl blur-md opacity-70 animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-white flex items-center justify-center shadow-soft-xl border-2 border-yellow-200">
              <Trophy className="w-10 h-10 drop-shadow-md animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-black border-2 border-white shadow-soft-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Headline & Level Badge */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-300/60 px-3 py-1 rounded-full inline-block">
              🎉 Level Up Reached!
            </span>
            <h3 className="text-2xl font-black text-navy-900 tracking-tight">
              Congratulations!
            </h3>
            <p className="text-xs text-navy-500 font-medium">
              You've officially advanced from Level {oldLevel} to
            </p>
            <div className="pt-1">
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                Level {level} · {title}
              </span>
            </div>
          </div>

          {/* XP Reward Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-purple/10 to-amber-400/10 border border-brand-purple/20 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-navy-900">
              <span className="flex items-center gap-1.5 text-brand-purple">
                <Zap className="w-4 h-4 fill-brand-purple" />
                <span>{reason || 'Problem Mastery'}</span>
              </span>
              <span className="font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                +{xpGained} XP
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-navy-500">
                <span>Total XP: <strong>{totalXp} XP</strong></span>
                <span>Next: Level {level + 1} ({600 - currentProgress} XP to go)</span>
              </div>
              <div className="w-full bg-navy-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-purple to-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Motivational Tag */}
          <p className="text-[11px] text-navy-600 italic">
            "Your problem-solving fluency and speed are ascending. Keep practicing to reach FAANG Candidate status!"
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white font-extrabold text-xs shadow-soft-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Keep Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenAchievements && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAchievements();
                }}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-navy-200 hover:bg-navy-50 text-navy-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <span>View Ranks</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
