import express from 'express';
import { generatePersonalizedRoadmap } from '../services/roadmapEngine.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get personalized dynamic roadmap
router.get('/', requireAuth, async (req, res) => {
  try {
    const roadmap = await generatePersonalizedRoadmap(req.user._id);
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

