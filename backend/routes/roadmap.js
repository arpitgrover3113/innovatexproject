import express from 'express';
import { generatePersonalizedRoadmap } from '../services/roadmapEngine.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get personalized dynamic roadmap
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : 'guest_preview';
    const roadmap = await generatePersonalizedRoadmap(userId);
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

