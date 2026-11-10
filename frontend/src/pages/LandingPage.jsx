import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Zap, 
  Compass, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  BarChart3, 
  RotateCcw,
  Shield,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MasteryBadge } from '../components/MasteryBadge';

export const LandingPage = ({ onNavigate }) => {
  const { demoLogin, isAuthenticated } = useAuth();
  const [activePreviewTab, setActivePreviewTab] = useState('roadmap');

  const handleStartLearning = async () => {
    if (!isAuthenticated) {
      try {
        await demoLogin();
      } catch (e) {
        console.warn('Demo auto-session:', e);
      }
    }
    onNavigate('diagnostic');
  };

  const handleExploreFeatures = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-24 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Top Announcement Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-purple/10 text-brand-purple-dark border border-brand-purple/20 shadow-soft-xs mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-brand-purple animate-pulse" />
          <span>LearnLoop AI · Adaptive Cognitive Learning Engine</span>
          <ChevronRight className="w-3.5 h-3.5 text-brand-purple" />
        </motion.div>

        {/* Hero Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-900 tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Stop studying everything.{' '}
          <span className="bg-gradient-to-r from-brand-purple via-brand-purple-dark to-brand-blue bg-clip-text text-transparent">
            Start mastering what matters.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-navy-600 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Your personal AI learning companion that understands your strengths, identifies your weaknesses, and builds a dynamic learning path around you.
        </motion.p>

        {/* Call To Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={handleStartLearning}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-purple-dark to-brand-blue hover:from-brand-purple hover:to-brand-blue-dark shadow-soft-md hover:shadow-soft-lg hover:-translate-y-0.5 transition-all"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={demoLogin}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-navy-800 bg-white hover:bg-navy-50 border border-navy-200/80 shadow-soft-sm hover:shadow-soft-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span>Launch Live Demo</span>
          </button>

          <button
            onClick={handleExploreFeatures}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-navy-600 hover:text-navy-900 hover:bg-navy-100/50 transition-colors"
          >
            <span>Explore Features</span>
          </button>
        </motion.div>

        {/* Live Interactive Product Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white border border-navy-200/80 shadow-soft-xl overflow-hidden text-left"
        >
          {/* Top Mock Window Bar */}
          <div className="bg-navy-950 px-5 py-3.5 flex items-center justify-between border-b border-navy-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 text-xs font-mono text-navy-400">learnloop.ai/app/telemetry</span>
            </div>
            
            {/* Tab switchers in mockup */}
            <div className="flex items-center gap-1 bg-navy-900/80 p-1 rounded-lg border border-navy-800">
              <button 
                onClick={() => setActivePreviewTab('roadmap')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activePreviewTab === 'roadmap' ? 'bg-brand-purple text-white' : 'text-navy-400 hover:text-white'
                }`}
              >
                Dynamic Roadmap
              </button>
              <button 
                onClick={() => setActivePreviewTab('adaptive')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activePreviewTab === 'adaptive' ? 'bg-brand-purple text-white' : 'text-navy-400 hover:text-white'
                }`}
              >
                Adaptive Engine
              </button>
              <button 
                onClick={() => setActivePreviewTab('tutor')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activePreviewTab === 'tutor' ? 'bg-brand-purple text-white' : 'text-navy-400 hover:text-white'
                }`}
              >
                AI Socratic Tutor
              </button>
            </div>
          </div>

          {/* Mock Window Body */}
          <div className="p-6 sm:p-8 bg-background-subtle/50">
            {activePreviewTab === 'roadmap' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Dynamic Prerequisite Sequence</span>
                    <h3 className="text-xl font-bold text-navy-900">Personalized Knowledge Frontier</h3>
                    <p className="text-xs text-navy-500">Recalculated in real-time using topological mastery sorting</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-full">
                    ⚠️ 1 Critical Gateway Identified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1: Bottleneck */}
                  <div className="p-4 bg-white rounded-2xl border-2 border-brand-purple/30 shadow-soft-sm relative">
                    <span className="absolute -top-2.5 right-3 bg-brand-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      FOCUS NOW
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-navy-400">Step 01</span>
                      <MasteryBadge score={35} />
                    </div>
                    <h4 className="text-base font-bold text-navy-900 mt-2">Recursion Fundamentals</h4>
                    <p className="text-xs text-navy-500 mt-1">
                      Critical Bottleneck: Blocks downstream advancement into Trees (60%) and Dynamic Programming (15%).
                    </p>
                    <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between text-xs">
                      <span className="text-brand-purple font-semibold">Priority: Critical</span>
                      <span className="text-navy-400">4 Subproblems</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-white rounded-2xl border border-navy-200/80 shadow-soft-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-navy-400">Step 02</span>
                      <MasteryBadge score={60} />
                    </div>
                    <h4 className="text-base font-bold text-navy-900 mt-2">Tree Traversals</h4>
                    <p className="text-xs text-navy-500 mt-1">
                      Ready: In-order BST and post-order height calculations awaiting recursion base-case reinforcement.
                    </p>
                    <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between text-xs">
                      <span className="text-brand-blue font-semibold">Priority: High</span>
                      <span className="text-navy-400">Unlocked</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 bg-navy-50/70 rounded-2xl border border-dashed border-navy-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-navy-400">Step 03</span>
                      <span className="text-xs text-navy-400 font-mono font-medium">Locked 🔒</span>
                    </div>
                    <h4 className="text-base font-bold text-navy-600 mt-2">Dynamic Programming</h4>
                    <p className="text-xs text-navy-400 mt-1">
                      Requires Recursion mastery ≥ 60%. Memorization state transitions unlock automatically.
                    </p>
                    <div className="mt-4 pt-3 border-t border-navy-200/60 flex items-center justify-between text-xs text-navy-400">
                      <span>Prerequisites pending</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'adaptive' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-brand-blue/10 text-brand-blue font-mono font-bold text-xs rounded-md">
                      DIFFICULTY: MEDIUM
                    </span>
                    <span className="text-xs text-navy-500">Topic: Binary Search · Iterative vs Recursive</span>
                  </div>
                  <span className="text-xs text-navy-400 font-mono">Response Time: 14s</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-navy-200">
                  <p className="font-semibold text-navy-900 text-sm">
                    Why does binary search use <code className="bg-navy-100 px-1.5 py-0.5 rounded text-xs font-mono">mid = low + (high - low) / 2</code> instead of <code className="bg-navy-100 px-1.5 py-0.5 rounded text-xs font-mono">(low + high) / 2</code>?
                  </p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg border border-brand-emerald bg-brand-emerald/5 text-navy-900 font-medium flex items-center justify-between">
                      <span>Prevents 32-bit signed integer overflow</span>
                      <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                    </div>
                    <div className="p-2.5 rounded-lg border border-navy-200 text-navy-500 opacity-60">
                      <span>Executes in fewer clock cycles</span>
                    </div>
                  </div>
                </div>

                {/* Live Trace */}
                <div className="p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-purple-dark font-medium">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    <span><strong>Engine Adaptation:</strong> Correct answer on Medium. Escalating next question to <strong>Hard</strong> tier.</span>
                  </div>
                  <span className="font-mono font-bold text-brand-emerald">+14 Mastery</span>
                </div>
              </div>
            )}

            {activePreviewTab === 'tutor' && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple text-white flex items-center justify-center text-xs font-bold shrink-0">
                    AI
                  </div>
                  <div className="p-3.5 bg-white rounded-2xl rounded-tl-none border border-navy-200 shadow-soft-xs text-xs text-navy-800 max-w-xl space-y-2">
                    <p className="font-semibold text-brand-purple">LearnLoop Socratic Tutor</p>
                    <p>
                      I noticed you aced <strong>Binary Search (90%)</strong>, but your diagnostic showed friction in <strong>Recursion (35%)</strong>.
                    </p>
                    <p className="text-navy-600">
                      When tracing recursive calls, remember: write your <strong>Base Case at Line 1</strong> before doing anything else. Would you like to dry-run a call stack together?
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[11px] font-bold text-navy-400 uppercase">Suggested Prompts:</span>
                  <span className="text-xs bg-white border border-navy-200 text-navy-700 px-2.5 py-1 rounded-full cursor-pointer hover:border-brand-purple">
                    Dry-run factorial call stack
                  </span>
                  <span className="text-xs bg-white border border-navy-200 text-navy-700 px-2.5 py-1 rounded-full cursor-pointer hover:border-brand-purple">
                    Why did I get question 3 wrong?
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-navy-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">The Intelligent Learning Loop</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-2 tracking-tight">
              Four steps from knowledge gaps to total mastery.
            </h2>
            <p className="text-navy-600 mt-3 text-base">
              Traditional platforms present rigid linear video playlists. LearnLoop continuously adapts to your cognitive velocity.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-background border border-navy-200/80 hover:shadow-soft-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-navy-900">Diagnostic Assessment</h3>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                A rapid 10-topic survey that calculates your baseline mastery across Arrays, Recursion, Trees, Graphs, and DP.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-background border border-navy-200/80 hover:shadow-soft-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-navy-900">Knowledge Graph Mapping</h3>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                Deterministic mathematical scoring tracks attempts, recent accuracy, mistake frequency, and response times.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-background border border-navy-200/80 hover:shadow-soft-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-navy-900">Adaptive Question Selection</h3>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                Answer correctly? Step up to harder challenges. Repeated mistakes? The backend steps down to prerequisite foundations.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-background border border-navy-200/80 hover:shadow-soft-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-amber/10 text-brand-amber flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-lg font-bold text-navy-900">Socratic AI Tutor</h3>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                Powered by Gemini API with resilient fallbacks. Explains concepts calibrated precisely to your active mastery frontier.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Engineered for Competitive Learning</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-2 tracking-tight">
            Built for learners who refuse to waste hours on fluff.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-navy-200/80 shadow-soft-xs hover:shadow-soft-sm transition-all">
            <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-xl w-fit mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Transparent Mastery Algorithm</h3>
            <p className="text-xs text-navy-600 mt-2 leading-relaxed">
              No black-box hallucinated ratings. Mastery delta calculations are fully deterministic: tracking difficulty weights, consecutive streaks, and mistake penalties.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-navy-200/80 shadow-soft-xs hover:shadow-soft-sm transition-all">
            <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl w-fit mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Topological Prerequisite Ordering</h3>
            <p className="text-xs text-navy-600 mt-2 leading-relaxed">
              If Recursion is weak, LearnLoop locks advanced Dynamic Programming and prioritizes call-stack mastery first, preventing cognitive overload.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-navy-200/80 shadow-soft-xs hover:shadow-soft-sm transition-all">
            <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl w-fit mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Graceful Local Fallback Mode</h3>
            <p className="text-xs text-navy-600 mt-2 leading-relaxed">
              Seamlessly integrates Google Gemini API for interactive tutoring, with an intelligent pedagogical rule engine if offline or API keys are unconfigured.
            </p>
          </div>

        </div>

        {/* Big Bottom CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-soft-xl">
          <div className="max-w-xl text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to experience true adaptive learning?
            </h3>
            <p className="text-navy-300 text-sm mt-2">
              Launch the live local demo with preloaded DSA benchmarks, or test your skills on the diagnostic assessment right now.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartLearning}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-brand-purple hover:bg-brand-purple-dark shadow-soft-md transition-all"
            >
              Take 5-Min Diagnostic
            </button>
            <button
              onClick={demoLogin}
              className="px-6 py-3 rounded-xl font-bold text-xs text-navy-900 bg-white hover:bg-navy-100 transition-all"
            >
              Open Demo Dashboard
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};

