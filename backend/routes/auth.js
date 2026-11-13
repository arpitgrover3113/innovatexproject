import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbStore } from '../services/storage.js';
import { generateToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

const formatUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  learningGoals: user.learningGoals,
  skillLevel: user.skillLevel,
  selectedSubjects: user.selectedSubjects,
  streakDays: user.streakDays || 1,
  totalQuestionsAnswered: user.totalQuestionsAnswered || 0,
  overallAccuracy: user.overallAccuracy || 0,
  xp: user.xp || 0,
  level: user.level || 1,
  levelTitle: user.levelTitle || 'Novice Learner',
  achievements: user.achievements || [],
  leetcodeUsername: user.leetcodeUsername || null
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, learningGoals, skillLevel, selectedSubjects } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await dbStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await dbStore.createUser({
      name,
      email,
      passwordHash,
      learningGoals: learningGoals || 'Master DSA & System Design',
      skillLevel: skillLevel || 'Beginner',
      selectedSubjects: selectedSubjects || ['Data Structures & Algorithms']
    });

    // If student took diagnostic test as a guest, automatically migrate their test data to their new account
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const guestToken = authHeader.split(' ')[1];
        const decoded = jwt.verify(guestToken, process.env.JWT_SECRET || 'learnloop_hackathon_jwt_secret_2026');
        if (decoded && decoded.id && decoded.id.startsWith('guest_')) {
          const guestProgress = await dbStore.getStudentProgress(decoded.id);
          for (const p of guestProgress) {
            if (p.totalAttempts > 0 || p.masteryScore > 0) {
              await dbStore.updateTopicProgress(user._id, p.topicSlug, {
                masteryScore: p.masteryScore,
                totalAttempts: p.totalAttempts,
                correctAttempts: p.correctAttempts,
                recentAccuracy: p.recentAccuracy,
                lastDifficulty: p.lastDifficulty,
                consecutiveMistakes: p.consecutiveMistakes,
                consecutiveSuccesses: p.consecutiveSuccesses,
                recentMisconceptions: p.recentMisconceptions
              });
            }
          }
          const guestAssessments = await dbStore.getUserAssessments(decoded.id);
          for (const a of guestAssessments) {
            a.userId = user._id;
          }
        }
      } catch (e) {
        // Graceful continuation if guest token is invalid
      }
    }

    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: formatUserPayload(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await dbStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUserPayload(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guest Learner Auto-Session
router.post('/guest', async (req, res) => {
  try {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const guestUser = await dbStore.createUser({
      name: 'Guest Learner',
      email: `${guestId}@guest.learnloop.ai`,
      passwordHash: 'guest_no_password',
      learningGoals: 'Explore Data Structures & Algorithms',
      skillLevel: 'Beginner',
      selectedSubjects: ['Data Structures & Algorithms']
    });

    const token = generateToken(guestUser);

    res.status(201).json({
      message: 'Guest session created',
      token,
      user: formatUserPayload(guestUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Demo account login
router.post('/demo', async (req, res) => {
  try {
    const demoUser = await dbStore.findUserById('demo_student_01');
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo user not found' });
    }
    const token = generateToken(demoUser);
    res.json({
      message: 'Demo login successful',
      token,
      user: formatUserPayload(demoUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User Profile
router.get('/me', requireAuth, async (req, res) => {
  const user = req.user;
  res.json({
    user: formatUserPayload(user)
  });
});

// Update Profile / Onboarding Settings
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { learningGoals, skillLevel, selectedSubjects, name, leetcodeUsername } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (learningGoals) user.learningGoals = learningGoals;
    if (skillLevel) user.skillLevel = skillLevel;
    if (selectedSubjects) user.selectedSubjects = selectedSubjects;
    if (leetcodeUsername !== undefined) user.leetcodeUsername = leetcodeUsername;
    if (dbStore.debouncedSave) dbStore.debouncedSave();

    res.json({
      message: 'Profile updated successfully',
      user: formatUserPayload(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

