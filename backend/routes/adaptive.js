import express from 'express';
import { getInitialAdaptiveQuestion, processAdaptiveAnswer } from '../services/adaptiveEngine.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Fetch initial adaptive question for a topic
router.get('/question', requireAuth, async (req, res) => {
  try {
    const topicSlug = req.query.topic || 'recursion';
    const result = await getInitialAdaptiveQuestion({
      userId: req.user._id,
      topicSlug
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process adaptive answer & return next calibrated question
router.post('/answer', requireAuth, async (req, res) => {
  try {
    const { topicSlug, questionId, selectedOption, responseTimeSeconds } = req.body;

    if (!topicSlug || !questionId || selectedOption === undefined) {
      return res.status(400).json({ error: 'topicSlug, questionId, and selectedOption are required.' });
    }

    const result = await processAdaptiveAnswer({
      userId: req.user._id,
      topicSlug,
      questionId,
      selectedOption,
      responseTimeSeconds: Number(responseTimeSeconds) || 20
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

