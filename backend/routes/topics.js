import express from 'express';
import { dbStore } from '../services/storage.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// List all topics with student's current mastery
router.get('/', optionalAuth, async (req, res) => {
  try {
    const topics = await dbStore.getTopics();
    const progressList = req.user ? await dbStore.getStudentProgress(req.user._id) : [];

    const progressMap = new Map(progressList.map(p => [p.topicSlug, p]));

    const enrichedTopics = topics.map(t => {
      const p = progressMap.get(t.slug);
      return {
        ...t,
        masteryScore: p ? p.masteryScore : 0,
        totalAttempts: p ? p.totalAttempts : 0,
        recentAccuracy: p ? p.recentAccuracy : 0,
        lastDifficulty: p ? p.lastDifficulty : 'easy',
        status: (p && p.masteryScore >= 80) ? 'mastered' : (p && p.masteryScore >= 40) ? 'in_progress' : 'needs_work'
      };
    });

    res.json({ topics: enrichedTopics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get individual topic details
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const topic = await dbStore.getTopicBySlug(req.params.slug);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const userId = req.user ? req.user._id : 'guest_preview';
    const progress = await dbStore.getTopicProgress(userId, topic.slug);
    const questions = await dbStore.getQuestions({ topicSlug: topic.slug });

    res.json({
      topic,
      progress,
      questionCount: questions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

