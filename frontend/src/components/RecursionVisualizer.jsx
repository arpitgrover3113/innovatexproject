import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Sparkles, Layers, CheckCircle2, ArrowDown } from 'lucide-react';

const traceSteps = [
  {
    step: 0,
    title: 'Initial Call: factorial(3)',
    explanation: 'Function factorial(3) is invoked. Base case condition (n <= 1) evaluates to FALSE.',
    callStack: [
      { id: 'f3', name: 'factorial(3)', param: 'n = 3', state: 'Waiting for factorial(2)...', isBase: false, color: 'bg-brand-purple' }
    ],
    returnValue: null,
    highlightLine: 4
  },
  {
    step: 1,
    title: 'Recursive Call #1: factorial(2)',
    explanation: 'factorial(3) pauses and pushes factorial(2) onto the Call Stack. Base case (n <= 1) is FALSE.',
    callStack: [
      { id: 'f2', name: 'factorial(2)', param: 'n = 2', state: 'Waiting for factorial(1)...', isBase: false, color: 'bg-brand-blue' },
      { id: 'f3', name: 'factorial(3)', param: 'n = 3', state: 'PAUSED at 3 * factorial(2)', isBase: false, color: 'bg-brand-purple/70' }
    ],
    returnValue: null,
    highlightLine: 4
  },
  {
    step: 2,
    title: 'Recursive Call #2: factorial(1) [BASE CASE!]',
    explanation: 'factorial(2) pushes factorial(1). Base case (n <= 1) triggers TRUE! No further recursive calls are spawned.',
    callStack: [
      { id: 'f1', name: 'factorial(1)', param: 'n = 1', state: 'BASE CASE HIT! Returns 1 immediately', isBase: true, color: 'bg-brand-emerald' },
      { id: 'f2', name: 'factorial(2)', param: 'n = 2', state: 'PAUSED at 2 * factorial(1)', isBase: false, color: 'bg-brand-blue/70' },
      { id: 'f3', name: 'factorial(3)', param: 'n = 3', state: 'PAUSED at 3 * factorial(2)', isBase: false, color: 'bg-brand-purple/70' }
    ],
    returnValue: '1',
    highlightLine: 2
  },
  {
    step: 3,
    title: 'Call Stack Unwinds: factorial(1) pops',
    explanation: 'factorial(1) resolves with return value 1. Its stack frame is deallocated. factorial(2) unpauses and evaluates: 2 * 1 = 2.',
    callStack: [
      { id: 'f2', name: 'factorial(2)', param: 'n = 2', state: 'Evaluated: 2 * 1 = 2 (Ready to return)', isBase: false, color: 'bg-brand-blue' },
      { id: 'f3', name: 'factorial(3)', param: 'n = 3', state: 'PAUSED at 3 * factorial(2)', isBase: false, color: 'bg-brand-purple/70' }
    ],
    returnValue: '2',
    highlightLine: 4
  },
  {
    step: 4,
    title: 'Final Unwind: factorial(2) pops, returns to factorial(3)',
    explanation: 'factorial(2) returns 2 and pops off. factorial(3) computes: 3 * 2 = 6, pops off the stack, and returns 6 to caller.',
    callStack: [
      { id: 'f3', name: 'factorial(3)', param: 'n = 3', state: 'Evaluated: 3 * 2 = 6 (Final Result)', isBase: false, color: 'bg-brand-purple' }
    ],
    returnValue: '6',
    highlightLine: 4
  },
  {
    step: 5,
    title: 'Execution Complete · Call Stack Empty',
    explanation: 'All frames deallocated from stack memory. Final output is 6 with maximum call stack depth of O(n) = 3 frames.',
    callStack: [],
    returnValue: '6 (Complete)',
    highlightLine: null
  }
];

export const RecursionVisualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const state = traceSteps[currentStep];

  const handleNext = () => {
    if (currentStep < traceSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="bg-gray-900 rounded-3xl border border-gray-700 shadow-soft-sm overflow-hidden p-6 space-y-6">
      
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-700">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Cognitive Diagnostic Simulator</span>
          </span>
          <h3 className="text-lg font-bold text-gray-100 mt-0.5">
            Recursion Call Stack &amp; Memory Frame Tracer
          </h3>
          <p className="text-xs text-gray-400">
            Step-by-step visual inspection of stack frame allocations and return unwinding.
          </p>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
            title="Reset to Step 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:opacity-30 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-gray-300 px-2">
            {currentStep + 1} / {traceSteps.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStep === traceSteps.length - 1}
            className="px-3.5 py-1.5 bg-brand-purple hover:bg-brand-purple-dark disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-soft-xs flex items-center gap-1"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Code on left, Visual Stack on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Code Snippet with Highlighted Active Line */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-gray-500">factorial.py</span>
            <span className="text-[10px] font-bold text-brand-purple uppercase bg-brand-purple/20 px-2 py-0.5 rounded">
              Python 3.12
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-800 font-mono text-xs text-gray-300 shadow-soft-sm space-y-1 border border-gray-700">
            <div className={`px-2 py-1 rounded transition-colors ${state.highlightLine === 1 ? 'bg-brand-purple/30 text-white font-bold' : ''}`}>
              <span className="text-gray-600 mr-3">1</span>def factorial(n):
            </div>
            <div className={`px-2 py-1 rounded transition-colors ${state.highlightLine === 2 ? 'bg-brand-emerald/30 text-brand-emerald font-bold' : ''}`}>
              <span className="text-gray-600 mr-3">2</span>&nbsp;&nbsp;&nbsp;&nbsp;if n &lt;= 1:
            </div>
            <div className={`px-2 py-1 rounded transition-colors ${state.highlightLine === 3 ? 'bg-brand-emerald/30 text-brand-emerald font-bold' : ''}`}>
              <span className="text-gray-600 mr-3">3</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 1  <span className="text-brand-emerald/70"># Base Case</span>
            </div>
            <div className={`px-2 py-1 rounded transition-colors ${state.highlightLine === 4 ? 'bg-brand-blue/30 text-brand-blue font-bold' : ''}`}>
              <span className="text-gray-600 mr-3">4</span>&nbsp;&nbsp;&nbsp;&nbsp;return n * factorial(n - 1)
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-gray-800 border border-gray-700 text-xs space-y-1.5">
            <p className="font-bold text-gray-100">{state.title}</p>
            <p className="text-gray-400 leading-relaxed">{state.explanation}</p>
            {state.returnValue && (
              <p className="text-brand-emerald font-bold font-mono text-xs pt-1">
                ↳ Return Value: {state.returnValue}
              </p>
            )}
          </div>
        </div>

        {/* Right: Interactive Call Stack (Grows upward) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-gray-500">System Call Stack Memory</span>
            <span className="text-[10px] font-mono font-bold text-gray-500">
              Depth: {state.callStack.length} / 3 Frames
            </span>
          </div>

          <div className="h-64 p-4 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-600 flex flex-col-reverse justify-start gap-2.5 overflow-hidden">
            {state.callStack.length === 0 ? (
              <div className="my-auto text-center text-xs text-gray-500 italic">
                Call Stack is currently empty. All frames returned!
              </div>
            ) : (
              <AnimatePresence>
                {state.callStack.map((frame, fIdx) => (
                  <motion.div
                    key={frame.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`p-3 rounded-xl text-white shadow-soft-xs text-xs space-y-0.5 ${frame.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono">{frame.name}</span>
                      <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">
                        {frame.param}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 truncate">{frame.state}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span>Stack Base (bottom)</span>
            <span>↑ Grows toward top</span>
          </div>
        </div>

      </div>

    </div>
  );
};

