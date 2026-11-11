import express from 'express';
import { dbStore } from '../services/storage.js';
import { generateTutorResponse, getTutorStatus } from '../services/geminiService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get AI Tutor status (Gemini active vs Fallback)
router.get('/status', (req, res) => {
  res.json(getTutorStatus());
});

// Get user chat history
router.get('/history', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : 'guest_preview';
    const history = await dbStore.getChatHistory(userId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat with AI Tutor
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, topicContext } = req.body;
    const userId = req.user ? req.user._id : 'guest_preview';

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // 1. Fetch past conversation
    const currentHistory = await dbStore.getChatHistory(userId);
    const resolvedTopic = topicContext || currentHistory.topicContext || 'Recursion';

    // 2. Save user message to history
    await dbStore.addChatMessage(userId, {
      role: 'user',
      content: message
    }, resolvedTopic);

    // 3. Generate adaptive response passing mastery profile & history
    const aiResponse = await generateTutorResponse({
      userId,
      message,
      topicContext: resolvedTopic,
      conversationHistory: currentHistory.messages
    });

    // 4. Save tutor response to history
    await dbStore.addChatMessage(userId, {
      role: 'assistant',
      content: aiResponse.content,
      suggestedNextStep: aiResponse.suggestedPrompts ? aiResponse.suggestedPrompts[0] : null
    }, resolvedTopic);

    res.json({
      reply: aiResponse.content,
      suggestedPrompts: aiResponse.suggestedPrompts,
      provider: aiResponse.provider,
      model: aiResponse.model,
      isFallback: aiResponse.isFallback,
      topicContext: aiResponse.topicContext,
      studentMastery: aiResponse.studentMastery
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configure API keys dynamically (optional user override)
router.post('/config', optionalAuth, async (req, res) => {
  const { geminiApiKey, groqApiKey } = req.body;
  if (typeof geminiApiKey === 'string') process.env.GEMINI_API_KEY = geminiApiKey.trim();
  if (typeof groqApiKey === 'string') process.env.GROQ_API_KEY = groqApiKey.trim();
  res.json({ success: true, status: getTutorStatus() });
});

// Clear conversation
router.post('/clear', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : 'guest_preview';
    const cleared = await dbStore.clearChatHistory(userId);
    res.json({ message: 'Conversation cleared', history: cleared });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

