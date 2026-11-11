import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  HelpCircle,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';
import { adaptiveApi, topicsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MasteryBadge } from '../components/MasteryBadge';

const defaultAdaptiveQuestion = {
  id: 'rec_1',
  topicSlug: 'recursion',
  topicName: 'Recursion',
  difficulty: 'easy',
  questionText: 'What is the absolute prerequisite condition that every recursive function must have to prevent a Stack Overflow error?',
  options: [
    'At least two recursive branch calls',
    'A base case that terminates recursion without further calls',
    'A global static variable counter',
    'Tail call optimization compiler flag'
  ],
  correctAnswer: 1,
  explanation: 'A base case defines the termination condition where the function returns a concrete answer directly, halting infinite call stack expansion.',
  misconceptionTip: 'Without a reachable base case, recursive stack frames continuously consume memory until Call Stack limit is exceeded.'
};

export const AdaptivePracticePage = ({ initialTopic = 'recursion', onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [currentQuestion, setCurrentQuestion] = useState(defaultAdaptiveQuestion);
  const [currentProgress, setCurrentProgress] = useState({ masteryScore: 35 });
  const [initialReason, setInitialReason] = useState('Starting with foundational recursion base cases.');
  const [loading, setLoading] = useState(false);

  // Answering state
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [adaptation, setAdaptation] = useState(null);
  const [pendingNextQuestion, setPendingNextQuestion] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  // Load topics list
  useEffect(() => {
    topicsApi.getTopics()
      .then(res => setTopics(res.topics || []))
      .catch(console.error);
  }, []);

  // Fetch initial question when topic changes
  const loadQuestionForTopic = (slug) => {
    setLoading(true);
    setEvaluation(null);
    setAdaptation(null);
    setSelectedOption(null);
    setPendingNextQuestion(null);

    adaptiveApi.getQuestion(slug)
      .then(res => {
        setCurrentQuestion(res.question);
        setCurrentProgress(res.currentProgress);
        setInitialReason(res.initialReason);
        setStartTime(Date.now());
        setLoading(false);
      })
      .catch(err => {
        console.warn('Adaptive question API fallback:', err);
        setCurrentQuestion({
          ...defaultAdaptiveQuestion,
          topicSlug: slug,
          topicName: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    loadQuestionForTopic(selectedTopic);
  }, [selectedTopic]);

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || submitting) return;

    setSubmitting(true);
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    try {
      const res = await adaptiveApi.submitAnswer({
        topicSlug: selectedTopic,
        questionId: currentQuestion.id,
        selectedOption,
        responseTimeSeconds: timeSpent
      });

      setEvaluation(res.evaluation);
      setAdaptation(res.adaptation);
      setPendingNextQuestion(res.nextQuestion);
      setCurrentProgress(res.currentTopicProgress);
    } catch (err) {
      console.warn('Backend submission fallback:', err);
      const isCorrect = Number(selectedOption) === Number(currentQuestion.correctAnswer);
      const nextDiff = isCorrect ? (currentQuestion.difficulty === 'easy' ? 'medium' : 'hard') : 'easy';
      setEvaluation({
        isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        masteryResult: {
          newMastery: isCorrect ? Math.min(100, (currentProgress?.masteryScore || 35) + 12) : Math.max(0, (currentProgress?.masteryScore || 35) - 8),
          delta: isCorrect ? 12 : -8,
          formulaExplanation: isCorrect 
            ? `+12 base (${currentQuestion.difficulty || 'easy'}) × 1.0x streak = +12 pts`
            : `-8 base (${currentQuestion.difficulty || 'easy'}) × 1.0x mistake = -8 pts`
        }
      });
      setAdaptation({
        previousDifficulty: currentQuestion.difficulty || 'easy',
        nextDifficulty: nextDiff,
        adaptationReason: isCorrect
          ? 'Mastered foundational concept. Stepping up to next calibrated difficulty.'
          : 'Encountered difficulty. Stepping down to reinforce base cases.'
      });
      setPendingNextQuestion({
        ...defaultAdaptiveQuestion,
        id: `q_next_${Date.now()}`,
        difficulty: nextDiff,
        questionText: isCorrect
          ? 'Consider Fibonacci recursion T(n) = T(n-1) + T(n-2) + O(1). What is its maximum call stack depth?'
          : 'What does a recursive base case return when reversing an empty string?'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedToNext = () => {
    if (pendingNextQuestion) {
      setCurrentQuestion(pendingNextQuestion);
      setEvaluation(null);
      setAdaptation(null);
      setSelectedOption(null);
      setPendingNextQuestion(null);
      setStartTime(Date.now());
    } else {
      loadQuestionForTopic(selectedTopic);
    }
  };

  const difficultyColors = {
    easy: 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20',
    medium: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    hard: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Guest Notice Banner */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
            <span className="text-navy-700">
              <strong>Guest Session:</strong> Practicing anonymously. Questions adapt in real-time. Create an account to permanently save your mastery & streak.
            </span>
          </div>
          <button
            onClick={() => onNavigate('auth')}
            className="px-3.5 py-1.5 rounded-lg bg-brand-purple text-white font-bold hover:bg-brand-purple-dark shrink-0 transition-all"
          >
            Sign In / Register
          </button>
        </div>
      )}
      
      {/* Header Strip with Topic Selector */}
      <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Real-Time Adaptive Quiz Engine</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-navy-900 mt-1">
            Dynamic Cognitive Practice
          </h2>
          <p className="text-xs text-navy-500">
            Difficulty dynamically scales up on success and drops down to foundational concepts on error.
          </p>
        </div>

        {/* Topic Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-semibold text-navy-400 uppercase">Selected Topic</p>
            <MasteryBadge score={currentProgress?.masteryScore || 0} size="sm" />
          </div>

          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="appearance-none bg-navy-50 border border-navy-200/80 text-navy-900 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-brand-purple cursor-pointer shadow-soft-xs"
            >
              {topics.map(t => (
                <option key={t.slug} value={t.slug}>
                  {t.name} ({t.masteryScore}%)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-navy-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 bg-white rounded-3xl border border-navy-200/80 text-center">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-3 animate-spin">
            <RefreshCw className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-navy-600">Calibrating question matching current cognitive level...</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Engine Calibration Notice Banner */}
          {initialReason && !evaluation && (
            <div className="px-4 py-2.5 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl flex items-center justify-between text-xs text-brand-purple-dark">
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span>{initialReason}</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-brand-purple/10 px-2 py-0.5 rounded font-bold">
                Dynamic Baseline
              </span>
            </div>
          )}

          {/* Question Card */}
          <motion.div 
            key={currentQuestion?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-6"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md font-mono font-bold uppercase border ${
                  difficultyColors[currentQuestion?.difficulty] || difficultyColors.medium
                }`}>
                  {currentQuestion?.difficulty} Tier
                </span>
                <span className="text-navy-400">· {currentQuestion?.topicName}</span>
              </div>

              <div className="flex items-center gap-2 text-navy-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Real-Time Pacing</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-navy-900 leading-snug">
              {currentQuestion?.questionText}
            </h3>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion?.options?.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isEvaluated = Boolean(evaluation);
                const isCorrectAnswer = isEvaluated && optIdx === evaluation.correctAnswer;
                const isWrongSelection = isEvaluated && isSelected && !evaluation.isCorrect;

                let cardStyle = 'border-navy-200 hover:border-navy-300 hover:bg-navy-50/50 text-navy-700';

                if (isEvaluated) {
                  if (isCorrectAnswer) {
                    cardStyle = 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald font-semibold ring-2 ring-brand-emerald/30';
                  } else if (isWrongSelection) {
                    cardStyle = 'border-brand-rose bg-brand-rose/10 text-brand-rose font-semibold ring-2 ring-brand-rose/30';
                  } else {
                    cardStyle = 'border-navy-200 text-navy-400 opacity-50';
                  }
                } else if (isSelected) {
                  cardStyle = 'border-brand-purple bg-brand-purple/5 text-navy-900 font-semibold shadow-soft-xs ring-2 ring-brand-purple/20';
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isEvaluated}
                    onClick={() => setSelectedOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start justify-between gap-3 ${cardStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-purple text-white' : 'bg-navy-100 text-navy-600'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="pt-0.5">{option}</span>
                    </div>

                    {isEvaluated && (
                      <div>
                        {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0" />}
                        {isWrongSelection && <XCircle className="w-5 h-5 text-brand-rose shrink-0" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Submit Button */}
            {!evaluation && (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null || submitting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-soft-xs transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Processing Adaptation...</span>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Real-Time Adaptation Trace Card (Appears after answer) */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-md space-y-5"
              >
                {/* Result Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-navy-100">
                  <div className="flex items-center gap-2">
                    {evaluation.isCorrect ? (
                      <div className="flex items-center gap-1.5 text-brand-emerald font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Correct! Difficulty Scaling Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-brand-rose font-bold text-sm">
                        <XCircle className="w-5 h-5" />
                        <span>Incorrect. Calibrating Difficulty</span>
                      </div>
                    )}
                  </div>

                  {/* Formula Calculation Pill */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-navy-100 px-2.5 py-1 rounded-lg text-navy-800">
                      Mastery Update: {evaluation.masteryResult?.formulaExplanation}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                      evaluation.isCorrect ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-rose/10 text-brand-rose'
                    }`}>
                      {evaluation.masteryResult?.delta > 0 ? `+${evaluation.masteryResult.delta}` : evaluation.masteryResult?.delta} pts
                    </span>
                  </div>
                </div>

                {/* Dynamic Adaptation Trace */}
                <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-brand-purple-dark font-bold">
                    <BrainCircuit className="w-4 h-4 text-brand-purple" />
                    <span>Engine Adaptation Decision:</span>
                  </div>
                  <p className="text-navy-700 leading-relaxed font-medium">
                    {adaptation?.adaptationReason}
                  </p>
                  <div className="flex items-center gap-4 pt-1 text-[11px] text-navy-500 font-mono">
                    <span>Previous Tier: <strong>{adaptation?.previousDifficulty.toUpperCase()}</strong></span>
                    <span>→</span>
                    <span>Next Calibrated Tier: <strong>{adaptation?.nextDifficulty.toUpperCase()}</strong></span>
                  </div>
                </div>

                {/* Misconception Alert if flagged */}
                {adaptation?.misconceptionDetected && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center gap-2 text-amber-800 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Cognitive Misconception Flagged</span>
                    </div>
                    <p className="text-amber-900">
                      {adaptation.misconceptionNote || 'Multiple errors detected on foundational steps. The system has calibrated back to reinforce core definitions.'}
                    </p>
                  </div>
                )}

                {/* Explanation */}
                <div className="p-4 rounded-2xl bg-navy-50/70 border border-navy-200/50 text-xs text-navy-800 space-y-1">
                  <p className="font-bold text-navy-900">Concept Explanation:</p>
                  <p className="leading-relaxed text-navy-700">{evaluation.explanation}</p>
                </div>

                {/* Bottom Action Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('tutor', { topicContext: currentQuestion?.topicName })}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/15 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor to Explain Further</span>
                  </button>

                  <button
                    onClick={handleProceedToNext}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-purple hover:bg-brand-purple-dark shadow-soft-sm transition-all flex items-center gap-2"
                  >
                    <span>Load Next Adaptive Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
};

