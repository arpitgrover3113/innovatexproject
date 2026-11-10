import express from 'express';
import { dbStore } from '../services/storage.js';
import { calculateMasteryUpdate } from '../services/masteryEngine.js';
import { generatePersonalizedRoadmap } from '../services/roadmapEngine.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Submit Diagnostic or Practice Assessment
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { answers, title = 'DSA Diagnostic Assessment' } = req.body;
    const userId = req.user._id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Assessment must contain at least one answer.' });
    }

    let correctCount = 0;
    const detailedAnswers = [];
    const topicAggregates = new Map();

    for (const ans of answers) {
      const q = await dbStore.getQuestionById(ans.questionId);
      if (!q) continue;

      const isCorrect = Number(ans.selectedOption) === Number(q.correctAnswer);
      if (isCorrect) correctCount++;

      const responseTime = Number(ans.responseTimeSeconds) || 25;

      // Update topic aggregate
      if (!topicAggregates.has(q.topicSlug)) {
        topicAggregates.set(q.topicSlug, {
          topicSlug: q.topicSlug,
          topicName: q.topicName,
          total: 0,
          correct: 0,
          items: []
        });
      }
      const agg = topicAggregates.get(q.topicSlug);
      agg.total += 1;
      if (isCorrect) agg.correct += 1;
      agg.items.push({ q, isCorrect, responseTime });

      detailedAnswers.push({
        questionId: q.id,
        questionText: q.questionText,
        topicSlug: q.topicSlug,
        topicName: q.topicName,
        difficulty: q.difficulty,
        selectedOption: Number(ans.selectedOption),
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        misconceptionTip: q.misconceptionTip,
        responseTimeSeconds: responseTime
      });
    }

    // Apply mastery update for each topic tested
    const topicResults = [];

    for (const [slug, data] of topicAggregates.entries()) {
      const currentProgress = await dbStore.getTopicProgress(userId, slug);
      let runningMastery = currentProgress.masteryScore;
      let consecutiveMistakes = currentProgress.consecutiveMistakes;
      let consecutiveSuccesses = currentProgress.consecutiveSuccesses;

      // Update per item
      for (const item of data.items) {
        const update = calculateMasteryUpdate({
          currentMastery: runningMastery,
          isCorrect: item.isCorrect,
          difficulty: item.q.difficulty,
          totalAttempts: currentProgress.totalAttempts,
          correctAttempts: currentProgress.correctAttempts,
          recentAccuracy: currentProgress.recentAccuracy,
          consecutiveMistakes,
          consecutiveSuccesses,
          responseTimeSeconds: item.responseTime
        });
        runningMastery = update.newMastery;
        consecutiveMistakes = update.consecutiveMistakes;
        consecutiveSuccesses = update.consecutiveSuccesses;
      }

      const updatedTopicProgress = await dbStore.updateTopicProgress(userId, slug, {
        masteryScore: runningMastery,
        totalAttempts: currentProgress.totalAttempts + data.total,
        correctAttempts: currentProgress.correctAttempts + data.correct,
        recentAccuracy: Math.round((data.correct / data.total) * 100),
        consecutiveMistakes,
        consecutiveSuccesses
      });

      topicResults.push({
        topicSlug: slug,
        topicName: data.topicName,
        total: data.total,
        correct: data.correct,
        initialMastery: currentProgress.masteryScore,
        newMastery: runningMastery,
        masteryDelta: runningMastery - currentProgress.masteryScore
      });
    }

    const overallScore = Math.round((correctCount / detailedAnswers.length) * 100);

    // Save Assessment record
    const savedAssessment = await dbStore.saveAssessment({
      userId,
      title,
      totalQuestions: detailedAnswers.length,
      score: overallScore,
      correctCount,
      topicResults,
      answers: detailedAnswers
    });

    // Automatically recalculate updated dynamic roadmap
    const updatedRoadmap = await generatePersonalizedRoadmap(userId);

    res.json({
      message: 'Assessment submitted and knowledge profile updated successfully.',
      assessmentId: savedAssessment._id,
      score: overallScore,
      correctCount,
      totalQuestions: detailedAnswers.length,
      topicResults,
      answersReview: detailedAnswers,
      nextFocusTopic: updatedRoadmap.nextFocusTopic
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user assessment history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const assessments = await dbStore.getUserAssessments(req.user._id);
    res.json({ assessments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

