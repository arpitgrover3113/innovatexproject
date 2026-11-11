import { dbStore } from './storage.js';
import { calculateMasteryUpdate } from './masteryEngine.js';

export const processAdaptiveAnswer = async ({
  userId,
  topicSlug,
  questionId,
  selectedOption,
  responseTimeSeconds = 25
}) => {
  // 1. Fetch current question and topic progress
  const currentQuestion = await dbStore.getQuestionById(questionId);
  if (!currentQuestion) {
    throw new Error('Question not found');
  }

  const topicProgress = await dbStore.getTopicProgress(userId, topicSlug);
  const isCorrect = Number(selectedOption) === Number(currentQuestion.correctAnswer);

  // 2. Run deterministic mastery engine
  const masteryUpdate = calculateMasteryUpdate({
    currentMastery: topicProgress.masteryScore,
    isCorrect,
    difficulty: currentQuestion.difficulty,
    totalAttempts: topicProgress.totalAttempts,
    correctAttempts: topicProgress.correctAttempts,
    recentAccuracy: topicProgress.recentAccuracy,
    consecutiveMistakes: topicProgress.consecutiveMistakes,
    consecutiveSuccesses: topicProgress.consecutiveSuccesses,
    responseTimeSeconds
  });

  // 3. Persist progress in storage
  const updatedProgress = await dbStore.updateTopicProgress(userId, topicSlug, {
    masteryScore: masteryUpdate.newMastery,
    totalAttempts: masteryUpdate.totalAttempts,
    correctAttempts: masteryUpdate.correctAttempts,
    recentAccuracy: masteryUpdate.recentAccuracy,
    lastDifficulty: currentQuestion.difficulty,
    consecutiveMistakes: masteryUpdate.consecutiveMistakes,
    consecutiveSuccesses: masteryUpdate.consecutiveSuccesses,
    recentMisconceptions: masteryUpdate.isMisconception && currentQuestion.misconceptionTip
      ? Array.from(new Set([...topicProgress.recentMisconceptions, currentQuestion.misconceptionTip])).slice(-3)
      : topicProgress.recentMisconceptions
  });

  // Also update overall user statistics
  let xpGained = 0;
  if (isCorrect) {
    xpGained = currentQuestion.difficulty === 'hard' ? 180 : currentQuestion.difficulty === 'medium' ? 100 : 50;
    if (responseTimeSeconds < 15) xpGained += 25; // Speed bonus
  }

  let newUnlockedAchievement = null;
  const user = await dbStore.findUserById(userId);
  if (user) {
    user.totalQuestionsAnswered = (user.totalQuestionsAnswered || 0) + 1;
    user.overallAccuracy = Math.round(
      ((user.overallAccuracy || 70) * (user.totalQuestionsAnswered - 1) + (isCorrect ? 100 : 0)) / user.totalQuestionsAnswered
    );
    user.xp = (user.xp || 1450) + xpGained;
    user.level = Math.floor(user.xp / 600) + 1;

    // Check achievement unlock
    if (topicSlug === 'recursion' && masteryUpdate.newMastery >= 50 && user.achievements) {
      const ach = user.achievements.find(a => a.id === 'recursion_conqueror');
      if (ach && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedAt = 'Just now';
        newUnlockedAchievement = ach;
      }
    }
  }

  // 4. Adaptive Logic: Decide next question difficulty and topic
  let nextDifficulty = currentQuestion.difficulty;
  let targetTopicSlug = topicSlug;
  let adaptationReason = '';
  let misconceptionDetected = false;

  if (isCorrect) {
    if (currentQuestion.difficulty === 'easy') {
      nextDifficulty = 'medium';
      adaptationReason = 'Mastered foundational concept. Stepping up to Medium difficulty scenario.';
    } else if (currentQuestion.difficulty === 'medium') {
      nextDifficulty = 'hard';
      adaptationReason = 'Demonstrated solid algorithmic understanding. Advancing to Hard challenge.';
    } else {
      nextDifficulty = 'hard';
      if (masteryUpdate.newMastery >= 85) {
        adaptationReason = `High mastery achieved (${masteryUpdate.newMastery}%). Continuing hard-tier reinforcement.`;
      } else {
        adaptationReason = 'Correct answer on Hard problem! Consolidating upper-tier proficiency.';
      }
    }
  } else {
    // Incorrect answer handling
    if (currentQuestion.difficulty === 'hard') {
      nextDifficulty = 'medium';
      adaptationReason = 'Encountered difficulty on Hard problem. Calibrating back to Medium to verify core logic.';
    } else if (currentQuestion.difficulty === 'medium') {
      nextDifficulty = 'easy';
      adaptationReason = 'Misstep on intermediate question. Stepping down to Easy to reinforce foundational mechanics.';
    } else {
      // Failed on 'easy'
      nextDifficulty = 'easy';
      if (masteryUpdate.consecutiveMistakes >= 2) {
        misconceptionDetected = true;
        // Check for prerequisite topics
        const currentTopic = await dbStore.getTopicBySlug(topicSlug);
        if (currentTopic && currentTopic.prerequisites && currentTopic.prerequisites.length > 0) {
          const prereqSlug = currentTopic.prerequisites[0];
          targetTopicSlug = prereqSlug;
          adaptationReason = `Multiple mistakes detected on ${currentTopic.name}. Switching to prerequisite topic (${prereqSlug}) to close foundational knowledge gap.`;
        } else {
          adaptationReason = 'Repeated mistakes on basic concept. Re-introducing core definition and base cases.';
        }
      } else {
        adaptationReason = 'Incorrect answer. Serving a complementary foundational problem.';
      }
    }
  }

  // 5. Query candidate questions matching target topic & difficulty
  let candidates = await dbStore.getQuestions({
    topicSlug: targetTopicSlug,
    difficulty: nextDifficulty
  });

  // Filter out the question just answered if more options exist
  let filtered = candidates.filter(q => q.id !== questionId);
  if (filtered.length === 0) {
    // Fallback to any question in that topic not equal to current
    const allTopicQuestions = await dbStore.getQuestions({ topicSlug: targetTopicSlug });
    filtered = allTopicQuestions.filter(q => q.id !== questionId);
    if (filtered.length === 0) filtered = candidates;
  }

  const nextQuestion = filtered[Math.floor(Math.random() * filtered.length)] || currentQuestion;

  return {
    evaluation: {
      isCorrect,
      selectedOption: Number(selectedOption),
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      misconceptionTip: currentQuestion.misconceptionTip,
      masteryResult: masteryUpdate
    },
    adaptation: {
      previousDifficulty: currentQuestion.difficulty,
      nextDifficulty: nextQuestion.difficulty,
      targetTopicSlug,
      adaptationReason,
      misconceptionDetected,
      misconceptionNote: misconceptionDetected ? currentQuestion.misconceptionTip : null
    },
    nextQuestion: {
      id: nextQuestion.id,
      topicSlug: nextQuestion.topicSlug,
      topicName: nextQuestion.topicName,
      difficulty: nextQuestion.difficulty,
      questionText: nextQuestion.questionText,
      options: nextQuestion.options
    },
    currentTopicProgress: updatedProgress,
    gamification: {
      xpGained,
      totalXp: user ? user.xp : 1450,
      level: user ? user.level : 3,
      newUnlockedAchievement
    }
  };
};

export const getInitialAdaptiveQuestion = async ({ userId, topicSlug }) => {
  const progress = await dbStore.getTopicProgress(userId, topicSlug);
  
  // Decide starting difficulty based on current mastery
  let startingDifficulty = 'easy';
  if (progress.masteryScore >= 75) startingDifficulty = 'hard';
  else if (progress.masteryScore >= 40) startingDifficulty = 'medium';

  const candidates = await dbStore.getQuestions({ topicSlug, difficulty: startingDifficulty });
  const question = (candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null) || (await dbStore.getQuestions({ topicSlug }))[0];

  return {
    question: {
      id: question.id,
      topicSlug: question.topicSlug,
      topicName: question.topicName,
      difficulty: question.difficulty,
      questionText: question.questionText,
      options: question.options
    },
    initialReason: `Starting with ${startingDifficulty.toUpperCase()} based on current topic mastery of ${progress.masteryScore}%.`,
    currentProgress: progress
  };
};

