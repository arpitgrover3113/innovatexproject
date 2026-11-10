import express from 'express';
import { dbStore } from '../services/storage.js';
import { generateTutorResponse, getTutorStatus } from '../services/geminiService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get AI Tutor status (Gemini active vs Fallback)
router.get('/status', (req, res) => {
  res.json(getTutorStatus());
});

// Get user chat history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await dbStore.getChatHistory(req.user._id);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat with AI Tutor
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, topicContext } = req.body;
    const userId = req.user._id;

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

// Clear conversation
router.post('/clear', requireAuth, async (req, res) => {
  try {
    const cleared = await dbStore.clearChatHistory(req.user._id);
    res.json({ message: 'Conversation cleared', history: cleared });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

