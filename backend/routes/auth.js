import express from 'express';
import bcrypt from 'bcryptjs';
import { dbStore } from '../services/storage.js';
import { generateToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

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

    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        learningGoals: user.learningGoals,
        skillLevel: user.skillLevel,
        selectedSubjects: user.selectedSubjects,
        streakDays: user.streakDays || 1,
        totalQuestionsAnswered: user.totalQuestionsAnswered || 0,
        overallAccuracy: user.overallAccuracy || 0
      }
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
      return res.status(401).json({ error: 'Invalid credentials. Try the 1-Click Demo Login!' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        learningGoals: user.learningGoals,
        skillLevel: user.skillLevel,
        selectedSubjects: user.selectedSubjects,
        streakDays: user.streakDays || 3,
        totalQuestionsAnswered: user.totalQuestionsAnswered || 0,
        overallAccuracy: user.overallAccuracy || 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1-Click Demo Access
router.post('/demo', async (req, res) => {
  try {
    const demoUser = await dbStore.findUserById('demo_student_01');
    const token = generateToken(demoUser);

    res.json({
      message: 'Logged in as Demo Student (Alex Mercer)',
      token,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        learningGoals: demoUser.learningGoals,
        skillLevel: demoUser.skillLevel,
        selectedSubjects: demoUser.selectedSubjects,
        streakDays: demoUser.streakDays,
        totalQuestionsAnswered: demoUser.totalQuestionsAnswered,
        overallAccuracy: demoUser.overallAccuracy,
        isDemo: true
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User Profile
router.get('/me', requireAuth, async (req, res) => {
  const user = req.user;
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      learningGoals: user.learningGoals,
      skillLevel: user.skillLevel,
      selectedSubjects: user.selectedSubjects,
      streakDays: user.streakDays,
      totalQuestionsAnswered: user.totalQuestionsAnswered,
      overallAccuracy: user.overallAccuracy,
      isDemo: user._id === 'demo_student_01'
    }
  });
});

// Update Profile / Onboarding Settings
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { learningGoals, skillLevel, selectedSubjects, name } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (learningGoals) user.learningGoals = learningGoals;
    if (skillLevel) user.skillLevel = skillLevel;
    if (selectedSubjects) user.selectedSubjects = selectedSubjects;

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        learningGoals: user.learningGoals,
        skillLevel: user.skillLevel,
        selectedSubjects: user.selectedSubjects,
        streakDays: user.streakDays,
        totalQuestionsAnswered: user.totalQuestionsAnswered,
        overallAccuracy: user.overallAccuracy
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

