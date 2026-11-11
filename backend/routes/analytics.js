import express from 'express';
import { dbStore } from '../services/storage.js';
import { generatePersonalizedRoadmap } from '../services/roadmapEngine.js';
import { optionalAuth } from '../middleware/auth.js';
import { dsaTopics } from '../seed/dsaData.js';

const router = express.Router();

// Get rich dashboard analytics
router.get('/dashboard', optionalAuth, async (req, res) => {
  try {
    const user = req.user;
    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Unauthenticated preview baseline
    if (!user) {
      return res.json({
        summary: {
          overallMastery: 0,
          questionsAttempted: 0,
          accuracy: 0,
          streakDays: 0,
          skillLevel: 'Beginner'
        },
        strongestTopics: [],
        weakestTopics: [],
        recommendedNextTopic: {
          topicSlug: 'recursion',
          topicName: 'Recursion Fundamentals',
          reason: 'Take the diagnostic assessment to calibrate your personalized knowledge frontier.'
        },
        recentAssessments: [],
        charts: {
          topicMastery: dsaTopics.map(t => ({
            topic: t.name.replace(' and ', ' & '),
            score: 0,
            accuracy: 0,
            benchmark: 75
          })),
          weeklyActivity: orderedDays.map(d => ({ day: d, questions: 0, accuracy: 0, studyTimeMin: 0 })),
          accuracyTrends: []
        },
        roadmapSummary: {
          mastered: 0,
          inProgress: 0,
          locked: 10,
          total: 10
        }
      });
    }

    const userId = user._id;
    const progressList = await dbStore.getStudentProgress(userId);
    const assessments = await dbStore.getUserAssessments(userId);
    const roadmap = await generatePersonalizedRoadmap(userId);

    // Calculate overall mastery average
    const totalMastery = progressList.reduce((acc, p) => acc + (p.masteryScore || 0), 0);
    const overallMastery = progressList.length > 0 ? Math.round(totalMastery / progressList.length) : 0;

    // Calculate total questions attempted and overall accuracy from progress
    const totalAttempts = progressList.reduce((acc, p) => acc + (p.totalAttempts || 0), 0);
    const totalCorrect = progressList.reduce((acc, p) => acc + (p.correctAttempts || 0), 0);
    const calculatedAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    // Strongest & Weakest topics
    const sortedProgress = [...progressList].sort((a, b) => b.masteryScore - a.masteryScore);
    const strongestTopics = sortedProgress.slice(0, 3).map(p => ({
      name: p.topicName,
      slug: p.topicSlug,
      score: p.masteryScore,
      accuracy: p.recentAccuracy
    }));

    const weakestTopics = sortedProgress.slice(-3).reverse().map(p => ({
      name: p.topicName,
      slug: p.topicSlug,
      score: p.masteryScore,
      accuracy: p.recentAccuracy,
      misconception: p.recentMisconceptions ? p.recentMisconceptions[0] : null
    }));

    // Chart Data 1: Topic-wise Mastery (guarantee all 10 topics appear on X-axis)
    const progressMap = new Map(progressList.map(p => [p.topicSlug, p]));
    const topicMasteryChart = dsaTopics.map(t => {
      const p = progressMap.get(t.slug);
      return {
        topic: t.name.replace(' and ', ' & '),
        score: p ? p.masteryScore : 0,
        accuracy: p ? p.recentAccuracy : 0,
        benchmark: 75
      };
    });

    // Chart Data 2: Weekly Activity — built from real assessment history
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyMap = {};
    days.forEach(d => { weeklyMap[d] = { day: d, questions: 0, accuracy: 0, studyTimeMin: 0, _correct: 0, _total: 0 }; });

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const a of assessments) {
      const date = new Date(a.completedAt);
      if (date.getTime() < oneWeekAgo) continue;
      const dayLabel = days[date.getDay()];
      weeklyMap[dayLabel].questions += a.totalQuestions || 0;
      weeklyMap[dayLabel]._correct += a.correctCount || 0;
      weeklyMap[dayLabel]._total += a.totalQuestions || 0;
      weeklyMap[dayLabel].studyTimeMin += Math.round((a.totalQuestions || 0) * 2.5);
    }
    // Calculate accuracy per day
    days.forEach(d => {
      const entry = weeklyMap[d];
      entry.accuracy = entry._total > 0 ? Math.round((entry._correct / entry._total) * 100) : 0;
      delete entry._correct;
      delete entry._total;
    });

    const weeklyActivity = orderedDays.map(d => weeklyMap[d]);

    // Chart Data 3: Accuracy Trends over assessments
    let accuracyTrends = assessments.map((a, index) => ({
      session: `Test #${assessments.length - index}`,
      score: a.score,
      date: new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })).reverse();

    res.json({
      summary: {
        overallMastery,
        questionsAttempted: totalAttempts || user.totalQuestionsAnswered || 0,
        accuracy: calculatedAccuracy || user.overallAccuracy || 0,
        streakDays: totalAttempts > 0 ? (user.streakDays || 1) : 0,
        skillLevel: user.skillLevel || 'Beginner'
      },
      strongestTopics,
      weakestTopics,
      recommendedNextTopic: roadmap.nextFocusTopic,
      recentAssessments: assessments.slice(0, 3),
      charts: {
        topicMastery: topicMasteryChart,
        weeklyActivity,
        accuracyTrends
      },
      roadmapSummary: {
        mastered: roadmap.masteredCount,
        inProgress: roadmap.inProgressCount,
        locked: roadmap.lockedCount,
        total: roadmap.totalTopics
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

