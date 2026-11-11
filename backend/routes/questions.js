import express from 'express';
import { dbStore } from '../services/storage.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get curated Diagnostic Assessment (1 question per each of the 10 DSA topics)
router.get('/diagnostic', async (req, res) => {
  try {
    const topics = await dbStore.getTopics();
    const diagnosticQuestions = [];

    for (const topic of topics) {
      // Pick an illustrative question for each topic
      const questions = await dbStore.getQuestions({ topicSlug: topic.slug });
      // Prefer easy or medium for diagnostic baseline
      const chosen = questions.find(q => q.difficulty === 'easy') || questions[0];
      if (chosen) {
        diagnosticQuestions.push({
          id: chosen.id,
          topicSlug: chosen.topicSlug,
          topicName: chosen.topicName,
          difficulty: chosen.difficulty,
          questionText: chosen.questionText,
          options: chosen.options,
          correctAnswer: chosen.correctAnswer,
          explanation: chosen.explanation,
          misconceptionTip: chosen.misconceptionTip
        });
      }
    }

    res.json({
      title: 'DSA Comprehensive Diagnostic Assessment',
      subject: 'Data Structures & Algorithms',
      totalQuestions: diagnosticQuestions.length,
      topicsCovered: topics.map(t => t.name),
      questions: diagnosticQuestions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List questions with optional filters
router.get('/', requireAuth, async (req, res) => {
  try {
    const { topicSlug, difficulty } = req.query;
    const questions = await dbStore.getQuestions({ topicSlug, difficulty });
    
    // Strip correct answer if query param sanitize is present or by default
    const sanitized = questions.map(q => ({
      id: q.id,
      topicSlug: q.topicSlug,
      topicName: q.topicName,
      difficulty: q.difficulty,
      questionText: q.questionText,
      options: q.options
    }));

    res.json({ questions: sanitized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

