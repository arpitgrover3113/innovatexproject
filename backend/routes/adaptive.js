import express from 'express';
import { getInitialAdaptiveQuestion, processAdaptiveAnswer } from '../services/adaptiveEngine.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Fetch initial adaptive question for a topic
router.get('/question', optionalAuth, async (req, res) => {
  try {
    const topicSlug = req.query.topic || 'recursion';
    const userId = req.user ? req.user._id : 'guest_preview';
    const result = await getInitialAdaptiveQuestion({
      userId,
      topicSlug
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process adaptive answer & return next calibrated question
router.post('/answer', optionalAuth, async (req, res) => {
  try {
    const { topicSlug, questionId, selectedOption, responseTimeSeconds } = req.body;

    if (!topicSlug || !questionId || selectedOption === undefined) {
      return res.status(400).json({ error: 'topicSlug, questionId, and selectedOption are required.' });
    }

    const userId = req.user ? req.user._id : 'guest_preview';
    const result = await processAdaptiveAnswer({
      userId,
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

