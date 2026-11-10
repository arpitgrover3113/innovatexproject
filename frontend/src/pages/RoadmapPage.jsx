import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Clock, 
  GitFork, 
  BookOpen,
  Layers,
  ChevronRight
} from 'lucide-react';
import { roadmapApi } from '../services/api';
import { MasteryBadge } from '../components/MasteryBadge';

export const RoadmapPage = ({ onNavigate }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = () => {
    setLoading(true);
    roadmapApi.getRoadmap()
      .then(data => {
        setRoadmap(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load roadmap:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-4 animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-navy-600">Generating personalized topological prerequisite path...</p>
      </div>
    );
  }

  const { recommendedSequence, masteredCount, inProgressCount, lockedCount, totalTopics, nextFocusTopic } = roadmap || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-navy-200/80 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-brand-purple" />
            <span>Topological Prerequisite Engine</span>
          </span>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Personalized DSA Learning Path
          </h1>
          <p className="text-xs text-navy-500 max-w-xl">
            Automatically sequences topics according to your live mastery, strict dependency trees, and cognitive bottlenecks.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 text-center">
            <span className="block text-lg font-bold text-brand-emerald">{masteredCount || 0}</span>
            <span className="text-[10px] font-semibold text-brand-emerald uppercase">Mastered</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-center">
            <span className="block text-lg font-bold text-brand-purple">{inProgressCount || 0}</span>
            <span className="text-[10px] font-semibold text-brand-purple uppercase">In Progress</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-navy-100 text-center">
            <span className="block text-lg font-bold text-navy-500">{lockedCount || 0}</span>
            <span className="text-[10px] font-semibold text-navy-500 uppercase">Locked</span>
          </div>
        </div>
      </div>

      {/* Critical Focus Gateway Banner */}
      {nextFocusTopic && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-purple-dark via-navy-900 to-navy-950 text-white relative overflow-hidden shadow-soft-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-purple/30 text-brand-purple-light border border-brand-purple/40">
                Current Learning Frontier
              </span>
              <h3 className="text-xl font-bold">
                Priority #1: {nextFocusTopic.topicName} ({nextFocusTopic.masteryScore}% Mastery)
              </h3>
              <p className="text-xs text-navy-300 max-w-2xl leading-relaxed">
                {nextFocusTopic.reason}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('adaptive', { topic: nextFocusTopic.topicSlug })}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-purple hover:bg-brand-purple-dark text-white shadow-soft-sm transition-all flex items-center gap-1.5"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('tutor', { topicContext: nextFocusTopic.topicName })}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-purple-light" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sequenced Path List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-navy-900">
          Recommended Sequence of Study
        </h3>

        <div className="space-y-3">
          {(recommendedSequence || []).map((step, idx) => {
            const isMastered = step.status === 'mastered';
            const isLocked = step.status === 'locked';
            const isCritical = step.priority === 'critical';

            let borderClass = 'border-navy-200/80 bg-white';
            if (isMastered) borderClass = 'border-brand-emerald/30 bg-white/80';
            else if (isCritical) borderClass = 'border-2 border-brand-purple bg-brand-purple/[0.02] shadow-soft-sm';
            else if (isLocked) borderClass = 'border-dashed border-navy-300 bg-navy-50/40 opacity-75';

            return (
              <motion.div
                key={step.topicSlug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className={`p-5 rounded-3xl border transition-all ${borderClass}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left Column */}
                  <div className="flex items-start gap-4">
                    {/* Step Number Circle */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isMastered 
                        ? 'bg-brand-emerald text-white' 
                        : isCritical
                          ? 'bg-brand-purple text-white shadow-soft-xs'
                          : isLocked
                            ? 'bg-navy-200 text-navy-500'
                            : 'bg-navy-100 text-navy-700'
                    }`}>
                      {isMastered ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-navy-900">{step.topicName}</h4>
                        <MasteryBadge score={step.masteryScore} size="sm" />
                        
                        {isCritical && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-purple text-white uppercase tracking-wider">
                            CRITICAL GATEWAY
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-200 text-navy-600 uppercase">
                            LOCKED
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-navy-600 leading-relaxed max-w-2xl">
                        {step.reason}
                      </p>

                      {step.recommendedAction && (
                        <p className="text-xs text-brand-purple font-semibold pt-1">
                          ↳ Action: {step.recommendedAction}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!isLocked ? (
                      <>
                        <button
                          onClick={() => onNavigate('adaptive', { topic: step.topicSlug })}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 transition-colors shadow-soft-xs"
                        >
                          Practice
                        </button>
                        <button
                          onClick={() => onNavigate('tutor', { topicContext: step.topicName })}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Tutor</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-navy-400 font-mono italic">
                        Prerequisites pending
                      </span>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

