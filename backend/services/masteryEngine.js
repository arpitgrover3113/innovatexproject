/**
 * LearnLoop AI - Deterministic Knowledge Mapping Engine
 * 
 * Transparent, deterministic mastery calculation algorithm.
 * Tracks attempts, accuracy, difficulty weighting, and repeated mistakes.
 * No arbitrary LLM hallucinated scores.
 */

export const calculateMasteryUpdate = ({
  currentMastery = 0,
  isCorrect,
  difficulty = 'medium',
  totalAttempts = 0,
  correctAttempts = 0,
  recentAccuracy = 0,
  consecutiveMistakes = 0,
  consecutiveSuccesses = 0,
  responseTimeSeconds = 30
}) => {
  // Base point adjustments based on question difficulty
  const difficultyWeights = {
    easy: { correct: 8, incorrect: -12 },   // Failing an easy question hurts more
    medium: { correct: 14, incorrect: -8 }, // Balanced reward
    hard: { correct: 20, incorrect: -5 }    // Hard question reward is higher, failure forgiven more
  };

  const weights = difficultyWeights[difficulty.toLowerCase()] || difficultyWeights.medium;

  let delta = isCorrect ? weights.correct : weights.incorrect;

  // Streak multipliers
  let streakMultiplier = 1.0;
  let newConsecutiveSuccesses = isCorrect ? consecutiveSuccesses + 1 : 0;
  let newConsecutiveMistakes = isCorrect ? 0 : consecutiveMistakes + 1;

  if (isCorrect) {
    if (newConsecutiveSuccesses >= 3) streakMultiplier = 1.25;
    else if (newConsecutiveSuccesses >= 2) streakMultiplier = 1.15;
  } else {
    // Repeated mistakes penalty
    if (newConsecutiveMistakes >= 3) streakMultiplier = 1.35;
    else if (newConsecutiveMistakes >= 2) streakMultiplier = 1.2;
  }

  // Response time pacing factor (bonus if solved quickly and correctly, no harsh penalty if thought through)
  let pacingFactor = 1.0;
  if (isCorrect && responseTimeSeconds < 25) {
    pacingFactor = 1.1; // Confident quick mastery
  }

  // Calculate adjusted delta
  const rawDelta = delta * streakMultiplier * (isCorrect ? pacingFactor : 1.0);
  const roundedDelta = Math.round(rawDelta);

  // New mastery clamped between 0 and 100
  const newMastery = Math.max(0, Math.min(100, currentMastery + roundedDelta));

  // Update cumulative counters
  const newTotalAttempts = totalAttempts + 1;
  const newCorrectAttempts = isCorrect ? correctAttempts + 1 : correctAttempts;

  // Exponential moving average for recent accuracy (alpha = 0.3)
  const currentAnswerScore = isCorrect ? 100 : 0;
  const newRecentAccuracy = totalAttempts === 0
    ? currentAnswerScore
    : Math.round(recentAccuracy * 0.7 + currentAnswerScore * 0.3);

  // Misconception detection
  const isMisconception = !isCorrect && newConsecutiveMistakes >= 2;

  return {
    previousMastery: currentMastery,
    newMastery,
    delta: roundedDelta,
    isCorrect,
    difficulty,
    totalAttempts: newTotalAttempts,
    correctAttempts: newCorrectAttempts,
    recentAccuracy: newRecentAccuracy,
    consecutiveSuccesses: newConsecutiveSuccesses,
    consecutiveMistakes: newConsecutiveMistakes,
    isMisconception,
    formulaExplanation: isCorrect
      ? `+${weights.correct} base (${difficulty}) × ${streakMultiplier}x streak = +${roundedDelta} pts`
      : `${weights.incorrect} base (${difficulty}) × ${streakMultiplier}x mistake factor = ${roundedDelta} pts`
  };
};

