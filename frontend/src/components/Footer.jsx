import React from 'react';
import { Sparkles, Terminal, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-navy-200/80 bg-white/70 backdrop-blur-sm py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-navy-900">
                LearnLoop<span className="text-brand-purple">.ai</span>
              </span>
              <p className="text-xs text-navy-400">Intelligent Adaptive Learning Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-navy-500">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-brand-purple" />
              <span>Full-Stack Local Architecture</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Deterministic Knowledge Mapping Engine</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>Gemini API & Fallback Resilience</span>
            </span>
          </div>

          <p className="text-xs text-navy-400">
            Built for Problem Statement 03 · Local Sandbox Ready
          </p>
        </div>
      </div>
    </footer>
  );
};

