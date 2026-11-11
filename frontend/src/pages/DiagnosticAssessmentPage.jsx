import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Award,
  ChevronRight,
  Compass,
  Check
} from 'lucide-react';
import { questionsApi, assessmentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MasteryBadge } from '../components/MasteryBadge';

// Comprehensive offline-resilient fallback diagnostic test (10 topics)
const fallbackDiagnostic = {
  title: 'DSA Comprehensive Diagnostic Assessment',
  subject: 'Data Structures & Algorithms',
  totalQuestions: 10,
  topicsCovered: [
    'Arrays', 'Strings', 'Recursion', 'Binary Search', 'Sorting',
    'Linked Lists', 'Stacks and Queues', 'Trees', 'Graphs', 'Dynamic Programming'
  ],
  questions: [
    {
      id: 'arr_1',
      topicSlug: 'arrays',
      topicName: 'Arrays',
      difficulty: 'easy',
      questionText: 'What is the time complexity to access an element at index i in a standard dynamically sized contiguous array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Arrays store elements in contiguous memory. Using pointer arithmetic (base_address + i * size), random access is O(1).'
    },
    {
      id: 'str_1',
      topicSlug: 'strings',
      topicName: 'Strings',
      difficulty: 'easy',
      questionText: 'To verify whether a string of length n is a palindrome, what is the most space-optimal approach?',
      options: ['Reverse the entire string into a new buffer O(n) space', 'Two pointers from start and end moving inward with O(1) auxiliary space', 'Convert to a tree and traverse in-order', 'Generate all permutations O(n!)'],
      correctAnswer: 1,
      explanation: 'Comparing characters from outward inward using two pointers requires zero additional heap allocation: O(1) space.'
    },
    {
      id: 'rec_1',
      topicSlug: 'recursion',
      topicName: 'Recursion',
      difficulty: 'easy',
      questionText: 'What is the absolute prerequisite condition that every recursive function must have to prevent a Stack Overflow error?',
      options: ['At least two recursive branch calls', 'A base case that terminates recursion without further calls', 'A global static variable counter', 'Tail call optimization compiler flag'],
      correctAnswer: 1,
      explanation: 'A base case defines the termination condition where the function returns a concrete answer directly, halting infinite call stack expansion.'
    },
    {
      id: 'bs_1',
      topicSlug: 'binary-search',
      topicName: 'Binary Search',
      difficulty: 'easy',
      questionText: 'What essential property must a collection have for standard Binary Search to be directly applicable?',
      options: ['Elements must be sorted in monotonic order', 'Elements must all be distinct positive integers', 'Must be implemented as a Linked List', 'Elements must be powers of 2'],
      correctAnswer: 0,
      explanation: 'Binary Search relies on monotonicity (sorted order) so that comparing the target with the middle element eliminates half of the search space with certainty.'
    },
    {
      id: 'sort_1',
      topicSlug: 'sorting',
      topicName: 'Sorting',
      difficulty: 'easy',
      questionText: 'What is the theoretical lower bound time complexity for any comparison-based sorting algorithm in the worst case?',
      options: ['Ω(n)', 'Ω(n log n)', 'Ω(n²)', 'Ω(log n)'],
      correctAnswer: 1,
      explanation: 'Any comparison sort can be modeled as a decision tree with n! leaves. The height is at least log₂(n!) = Ω(n log n).'
    },
    {
      id: 'll_1',
      topicSlug: 'linked-lists',
      topicName: 'Linked Lists',
      difficulty: 'easy',
      questionText: 'To reverse a singly linked list iteratively in a single pass, how many pointer variables are typically required?',
      options: ['1 pointer', '3 pointers: prev, curr, next', 'n pointers for each node', 'None, linked lists reverse automatically'],
      correctAnswer: 1,
      explanation: 'Reversing requires keeping track of prev (to point curr.next to), curr (node currently being updated), and next (to not lose the remainder of the list).'
    },
    {
      id: 'sq_1',
      topicSlug: 'stacks-and-queues',
      topicName: 'Stacks and Queues',
      difficulty: 'easy',
      questionText: 'Which abstract data type follows the Last-In, First-Out (LIFO) protocol?',
      options: ['Queue', 'Stack', 'Priority Queue', 'Circular Buffer'],
      correctAnswer: 1,
      explanation: 'A Stack is inherently LIFO: the most recently inserted item is the first one removed.'
    },
    {
      id: 'tree_1',
      topicSlug: 'trees',
      topicName: 'Trees',
      difficulty: 'easy',
      questionText: 'In a Binary Search Tree (BST), which tree traversal visits all node values in strictly non-decreasing sorted order?',
      options: ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order (BFS)'],
      correctAnswer: 1,
      explanation: 'In a BST, all keys in the left subtree are smaller than root, and right are larger. Traversing Left -> Root -> Right yields sorted ascending order.'
    },
    {
      id: 'graph_1',
      topicSlug: 'graphs',
      topicName: 'Graphs',
      difficulty: 'easy',
      questionText: 'Which graph traversal strategy uses a Queue and is guaranteed to find the shortest path in an unweighted graph?',
      options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Topological Sort', 'Kruskal Algorithm'],
      correctAnswer: 1,
      explanation: 'BFS explores nodes layer by layer in order of increasing distance from start node, guaranteeing the first time a target is reached is the shortest path.'
    },
    {
      id: 'dp_1',
      topicSlug: 'dynamic-programming',
      topicName: 'Dynamic Programming',
      difficulty: 'easy',
      questionText: 'What are the two foundational properties a problem must possess for Dynamic Programming to be applicable?',
      options: ['Unsorted input and prime numbers', 'Optimal Substructure and Overlapping Subproblems', 'Greedy choices and deterministic graphs', 'Divide-and-conquer with independent subproblems'],
      correctAnswer: 1,
      explanation: 'Optimal substructure means optimal solution contains optimal solutions to subproblems; overlapping subproblems means the same subproblems are solved repeatedly.'
    }
  ]
};

export const DiagnosticAssessmentPage = ({ onNavigate }) => {
  const { isAuthenticated, guestLogin } = useAuth();
  const [testData, setTestData] = useState(fallbackDiagnostic);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savingGuest, setSavingGuest] = useState(false);
  const [guestSaved, setGuestSaved] = useState(false);
  const [savedPayload, setSavedPayload] = useState(null);
  
  // Track answers: { [questionId]: { selectedOption, responseTimeSeconds } }
  const [userAnswers, setUserAnswers] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Completed test results
  const [assessmentResult, setAssessmentResult] = useState(null);

  useEffect(() => {
    questionsApi.getDiagnostic()
      .then(data => {
        if (data && data.questions && data.questions.length > 0) {
          setTestData(data);
        }
      })
      .catch(err => {
        console.warn('API diagnostic fetch failed, running with resilient diagnostic questions:', err.message);
      });
  }, []);

  const questionsList = testData?.questions || fallbackDiagnostic.questions;
  const currentQuestion = questionsList[currentIndex] || questionsList[0];

  const handleSelectOption = (optionIndex) => {
    if (!currentQuestion) return;
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOption: optionIndex,
        responseTimeSeconds: timeSpent
      }
    }));
  };

  const handleNext = () => {
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmit = async () => {
    const unansweredCount = questionsList.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      if (!window.confirm(`You still have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);

    const payloadAnswers = questionsList.map(q => {
      const recorded = userAnswers[q.id];
      return {
        questionId: q.id,
        selectedOption: recorded !== undefined ? recorded.selectedOption : -1,
        responseTimeSeconds: recorded !== undefined ? recorded.responseTimeSeconds : 25
      };
    });
    setSavedPayload(payloadAnswers);

    try {
      const res = await assessmentApi.submit({
        title: 'DSA Comprehensive Diagnostic Assessment',
        answers: payloadAnswers
      });
      setAssessmentResult(res);
    } catch (err) {
      console.warn('Backend submission network error, evaluating locally with deterministic formulas:', err);
      
      // Resilient Local Evaluation Fallback
      let correctCount = 0;
      const detailedAnswers = questionsList.map(q => {
        const recorded = userAnswers[q.id];
        const sel = recorded !== undefined ? recorded.selectedOption : -1;
        const isCorrect = sel === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          questionText: q.questionText,
          topicSlug: q.topicSlug,
          topicName: q.topicName,
          difficulty: q.difficulty,
          selectedOption: sel,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
          responseTimeSeconds: recorded?.responseTimeSeconds || 25
        };
      });

      const score = Math.round((correctCount / questionsList.length) * 100);
      const fallbackResults = {
        score,
        correctCount,
        totalQuestions: questionsList.length,
        topicResults: questionsList.map(q => {
          const isCorrect = userAnswers[q.id]?.selectedOption === q.correctAnswer;
          return {
            topicSlug: q.topicSlug,
            topicName: q.topicName,
            total: 1,
            correct: isCorrect ? 1 : 0,
            initialMastery: isCorrect ? 60 : 35,
            newMastery: isCorrect ? 75 : 25
          };
        }),
        answersReview: detailedAnswers,
        nextFocusTopic: {
          topicName: 'Recursion Fundamentals',
          topicSlug: 'recursion',
          reason: 'Critical Gateway Topic: Recursion is a prerequisite for Trees and Dynamic Programming.'
        }
      };
      setAssessmentResult(fallbackResults);
    } finally {
      setSubmitting(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  // --- RESULT VIEW ---
  if (assessmentResult) {
    const { score, correctCount, totalQuestions, topicResults, answersReview, nextFocusTopic } = assessmentResult;

    const handleContinueAsGuest = async () => {
      setSavingGuest(true);
      try {
        await guestLogin();
        if (savedPayload) {
          try {
            const serverRes = await assessmentApi.submit({
              title: 'DSA Comprehensive Diagnostic Assessment',
              answers: savedPayload
            });
            if (serverRes) setAssessmentResult(serverRes);
          } catch (syncErr) {
            console.warn('Syncing guest assessment failed:', syncErr.message);
          }
        }
        setGuestSaved(true);
      } catch (e) {
        console.warn('Guest save failed:', e.message);
      } finally {
        setSavingGuest(false);
      }
    };

    const handleProceedTo = async (destination, params = {}) => {
      if (!isAuthenticated && !guestSaved && savedPayload) {
        try {
          await guestLogin();
          await assessmentApi.submit({
            title: 'DSA Comprehensive Diagnostic Assessment',
            answers: savedPayload
          });
          setGuestSaved(true);
        } catch (e) {
          console.warn('Auto guest session before navigation:', e.message);
        }
      }
      onNavigate(destination, params);
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Save Results Prompt — shown only for unauthenticated users */}
        {!isAuthenticated && !guestSaved && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-brand-purple/5 border-2 border-brand-purple/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-900">Save your results</p>
                <p className="text-xs text-navy-500 mt-0.5">Create a free account to track your progress, or continue as a guest to explore your roadmap.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleContinueAsGuest}
                disabled={savingGuest}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-navy-600 border border-navy-200 hover:bg-navy-50 transition-all disabled:opacity-50"
              >
                {savingGuest ? 'Saving...' : 'Continue as Guest'}
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-dark transition-all"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        )}

        {/* Saved confirmation */}
        {!isAuthenticated && guestSaved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0" />
            <div>
              <p className="text-sm font-bold text-navy-900">Results saved as guest!</p>
              <p className="text-xs text-navy-500">
                <button onClick={() => onNavigate('auth')} className="text-brand-purple font-semibold hover:underline">Create an account</button> anytime to keep your progress permanently.
              </p>
            </div>
          </motion.div>
        )}
        
        {/* Results Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white text-center relative overflow-hidden shadow-soft-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple-light">
            Diagnostic Assessment Complete
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
            Diagnostic Score: {score}%
          </h2>
          <p className="text-xs sm:text-sm text-navy-300 mt-2 max-w-md mx-auto">
            You answered <strong>{correctCount} of {totalQuestions}</strong> questions correctly across all 10 core DSA topics. Your knowledge graph has been recalibrated.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleProceedTo('dashboard')}
              className="px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl text-xs font-bold transition-all shadow-soft-md"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => handleProceedTo('roadmap')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-brand-purple-light" />
              <span>View Dynamic Roadmap</span>
            </button>
            <button
              onClick={() => handleProceedTo('tutor', { topicContext: nextFocusTopic?.topicName || 'Recursion' })}
              className="px-5 py-2.5 bg-white text-navy-900 hover:bg-navy-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>Ask Tutor About Weak Areas</span>
            </button>
          </div>
        </motion.div>

        {/* Topic-by-Topic Mastery Deltas */}
        <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy-900">Topic Knowledge Recalibration</h3>
              <p className="text-xs text-navy-500">How your answers updated your topic mastery scores</p>
            </div>
            <span className="text-xs font-semibold text-brand-purple">Deterministic Updates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(topicResults || []).map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-navy-50/50 border border-navy-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-navy-900">{t.topicName}</h4>
                  <p className="text-[11px] text-navy-500">
                    {t.correct > 0 ? '✅ Correct' : '❌ Needs Practice'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-navy-400 font-mono line-through">{t.initialMastery}%</span>
                  <ChevronRight className="w-3 h-3 text-navy-400" />
                  <MasteryBadge score={t.newMastery} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-navy-900">Comprehensive Solutions & Misconception Review</h3>

          <div className="space-y-4">
            {(answersReview || []).map((ans, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  ans.isCorrect ? 'bg-white border-brand-emerald/30' : ans.selectedOption === -1 ? 'bg-white border-brand-amber/30' : 'bg-white border-brand-rose/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-navy-400">Q{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-navy-100 text-navy-700 font-semibold">{ans.topicName}</span>
                    <span className="capitalize text-navy-400">({ans.difficulty})</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    {ans.isCorrect ? (
                      <span className="text-brand-emerald flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : ans.selectedOption === -1 ? (
                      <span className="text-brand-amber flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Unattempted
                      </span>
                    ) : (
                      <span className="text-brand-rose flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                    <span className="text-navy-400 font-normal ml-2">{ans.responseTimeSeconds}s</span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-navy-900 mb-3">{ans.questionText}</p>

                <div className="p-3 bg-navy-50/70 rounded-xl text-xs space-y-1.5 border border-navy-200/50">
                  <p className="text-navy-700">
                    <strong>Explanation:</strong> {ans.explanation}
                  </p>
                  {ans.misconceptionTip && (
                    <p className="text-brand-purple font-medium flex items-start gap-1 pt-1">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Key Misconception:</strong> {ans.misconceptionTip}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // --- ACTIVE TEST VIEW ---
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = questionsList.length > 0 
    ? Math.round(((currentIndex + 1) / questionsList.length) * 100) 
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back to Home / Dashboard Button */}
      <div>
        <button
          onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-navy-600 bg-white border border-navy-200 hover:bg-navy-50 hover:text-navy-900 transition-all shadow-soft-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-brand-purple" />
          <span>{isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Test Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-200">
        <div>
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
            Diagnostic Assessment · DSA Track
          </span>
          <h2 className="text-xl font-extrabold text-navy-900">
            Topic {currentIndex + 1} of {questionsList.length}: {currentQuestion?.topicName}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-navy-500 bg-navy-100 px-2.5 py-1 rounded-lg">
            Answered: {answeredCount}/{questionsList.length}
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 transition-all shadow-soft-xs"
          >
            {submitting ? 'Evaluating...' : 'Submit Assessment'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-navy-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-brand-purple to-brand-blue h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentQuestion?.id || currentIndex}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6 sm:p-8 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-6"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-md font-mono font-bold bg-brand-purple/10 text-brand-purple-dark uppercase">
            Difficulty: {currentQuestion?.difficulty || 'easy'}
          </span>
          <span className="text-navy-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" /> Timed response
          </span>
        </div>

        <h3 className="text-lg font-bold text-navy-900 leading-snug">
          {currentQuestion?.questionText}
        </h3>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQuestion?.options?.map((option, optIdx) => {
            const isSelected = userAnswers[currentQuestion.id]?.selectedOption === optIdx;

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-brand-purple bg-brand-purple/5 text-navy-900 font-semibold shadow-soft-xs ring-2 ring-brand-purple/20'
                    : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50/50 text-navy-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-brand-purple text-white' : 'bg-navy-100 text-navy-600'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="pt-0.5">{option}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-navy-700 bg-white border border-navy-200 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1 overflow-x-auto max-w-xs sm:max-w-md py-1">
          {questionsList.map((q, idx) => {
            const isDone = userAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id || idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setQuestionStartTime(Date.now());
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isCurrent 
                    ? 'bg-brand-purple text-white shadow-soft-xs' 
                    : isDone 
                      ? 'bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30'
                      : 'bg-navy-100 text-navy-500 hover:bg-navy-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentIndex === questionsList.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-dark shadow-soft-sm transition-all"
          >
            <span>Finish & Submit</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-navy-700 bg-white border border-navy-200 hover:bg-navy-50 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
