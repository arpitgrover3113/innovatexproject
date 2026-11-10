import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, Lightbulb, Code } from 'lucide-react';

const flashcardsData = [
  {
    id: 1,
    topic: 'Recursion',
    question: 'What is the "Leap of Faith" in recursion, and how do you prevent Stack Overflow?',
    answer: 'The Leap of Faith assumes your recursive function works correctly for subproblems of size n - 1. You only need to verify two things:\n\n1. Base Case: Returns an immediate concrete answer without recursing (must be reached monotonically).\n2. Inductive Step: Correctly combines the subproblem solution with the current element.',
    tip: 'Always write the base case at Line 1 before any other code.',
    complexity: 'Call stack space is O(depth), not O(1).'
  },
  {
    id: 2,
    topic: 'Binary Search',
    question: 'Why does `mid = low + (high - low) // 2` prevent integer overflow?',
    answer: 'In languages with 32-bit signed integers (C++, Java, Go), `low + high` can exceed 2³¹ - 1 (~2.14 billion), overflowing into a negative number.\n\n`low + (high - low) / 2` calculates the offset first, mathematically guaranteeing the intermediate sum never exceeds `high`.',
    tip: 'Search space must satisfy a monotonic predicate: F F F T T T.',
    complexity: 'Time: O(log n) · Space: O(1)'
  },
  {
    id: 3,
    topic: 'Trees',
    question: 'Why does an In-Order traversal of a BST always produce sorted output?',
    answer: 'By definition of a Binary Search Tree (BST):\n- Every node in left subtree < root\n- Every node in right subtree > root\n\nIn-Order visits: [Left Subtree] -> [Root] -> [Right Subtree]. Recursively applying this order guarantees ascending numerical order.',
    tip: 'Use in-order traversal to validate if a tree is a valid BST in O(n) time.',
    complexity: 'Time: O(n) · Space: O(h) recursion stack'
  },
  {
    id: 4,
    topic: 'Dynamic Programming',
    question: 'What is the fundamental difference between Memoization and Tabulation?',
    answer: 'Memoization (Top-Down):\n- Starts from the original problem and recurses downward.\n- Caches results in a dictionary/hash map upon return.\n\nTabulation (Bottom-Up):\n- Iterative. Starts from base cases (dp[0], dp[1]).\n- Fills an array sequentially, often allowing space optimization from O(n) to O(1).',
    tip: 'If state only depends on the previous row, 2D arrays can be compressed to 1D.',
    complexity: 'Eliminates redundant subproblems from O(2ⁿ) to O(n·W)'
  },
  {
    id: 5,
    topic: 'Graphs',
    question: 'Why does BFS guarantee the shortest path in unweighted graphs, while DFS does not?',
    answer: 'BFS explores vertices in concentric layers of increasing distance (distance 0, then 1, then 2). The first time the destination node is dequeued, it is guaranteed to have been reached via the minimum possible number of edges.\n\nDFS plunges as deeply as possible along one branch, which may find a valid path that is far longer than the optimal one.',
    tip: 'Use BFS for shortest path in unweighted graphs; use Dijkstra for positive weighted graphs.',
    complexity: 'Time: O(V + E) · Space: O(V) queue'
  }
];

export const ConceptFlashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState(new Set());

  const card = flashcardsData[currentIndex];
  const isMastered = masteredCards.has(card.id);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % flashcardsData.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + flashcardsData.length) % flashcardsData.length);
  };

  const toggleMastered = (e) => {
    e.stopPropagation();
    setMasteredCards(prev => {
      const next = new Set(prev);
      if (next.has(card.id)) next.delete(card.id);
      else next.add(card.id);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Concept Revision Deck</span>
          </span>
          <h3 className="text-lg font-bold text-navy-900 mt-0.5">
            Algorithmic Invariant Flashcards
          </h3>
          <p className="text-xs text-navy-500">
            Click the card to flip between conceptual problem statements and deep mechanical insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-navy-600 bg-navy-100 px-2.5 py-1 rounded-xl">
            {masteredCards.size} / {flashcardsData.length} Mastered
          </span>
          <span className="text-xs font-mono font-bold text-navy-400">
            Card {currentIndex + 1} of {flashcardsData.length}
          </span>
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      <div 
        onClick={() => setIsFlipped(prev => !prev)}
        className="cursor-pointer perspective-[1000px] min-h-[260px] flex items-center justify-center select-none"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full min-h-[260px] rounded-3xl border-2 border-brand-purple/20 bg-gradient-to-br from-white via-background-subtle to-brand-purple/5 p-6 sm:p-8 shadow-soft-md hover:shadow-soft-lg transition-shadow relative flex flex-col justify-between"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT FACE */}
          {!isFlipped ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/10 text-brand-purple">
                  {card.topic}
                </span>
                <span className="text-xs text-navy-400 flex items-center gap-1 font-medium">
                  <RotateCw className="w-3.5 h-3.5" /> Click to reveal breakdown
                </span>
              </div>

              <div className="pt-4">
                <p className="text-xs text-brand-purple font-semibold uppercase tracking-wider">Concept Query:</p>
                <h4 className="text-base sm:text-lg font-bold text-navy-900 mt-1 leading-snug">
                  {card.question}
                </h4>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-navy-400">
                <span>Think about the base invariant...</span>
                <span className="text-brand-purple font-semibold">Reveal Answer →</span>
              </div>
            </div>
          ) : (
            /* BACK FACE (Rotated) */
            <div 
              className="space-y-3"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-emerald/10 text-brand-emerald">
                  {card.topic} · Deep Insight
                </span>
                <button
                  onClick={toggleMastered}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isMastered 
                      ? 'bg-brand-emerald text-white shadow-soft-xs' 
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isMastered ? 'Mastered!' : 'Mark Mastered'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-navy-800 leading-relaxed whitespace-pre-line pt-1 font-medium">
                {card.answer}
              </p>

              <div className="pt-2 border-t border-navy-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-navy-500 font-mono">⚡ {card.complexity}</span>
                <span className="text-brand-purple font-semibold">💡 {card.tip}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-navy-700 bg-white border border-navy-200 hover:bg-navy-50 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        {/* Card Indicators */}
        <div className="flex items-center gap-1.5">
          {flashcardsData.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'w-6 bg-brand-purple' 
                  : masteredCards.has(c.id)
                    ? 'bg-brand-emerald'
                    : 'bg-navy-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-dark transition-all shadow-soft-xs"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
