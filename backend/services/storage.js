import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { dsaTopics, dsaQuestions } from '../seed/dsaData.js';
import { getDbStatus } from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_FILE_PATH = path.join(__dirname, '../data/store.json');

// In-Memory Database Store (Always available, robust fallback)
class DataStore {
  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.questions = new Map();
    this.studentProgress = new Map(); // key: `${userId}_${topicSlug}`
    this.assessments = new Map();
    this.learningPaths = new Map();
    this.chatHistories = new Map();
    this.leetcodeSubmissions = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Seed Topics
    for (const topic of dsaTopics) {
      this.topics.set(topic.slug, { ...topic, _id: topic.slug });
    }

    // Seed Questions
    for (const q of dsaQuestions) {
      this.questions.set(q.id, { ...q, _id: q.id });
    }

    // Seed Demo User
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    const demoUser = {
      _id: 'demo_student_01',
      name: 'Alex Mercer',
      email: 'alex@learnloop.ai',
      passwordHash: demoPasswordHash,
      selectedSubjects: ['Data Structures & Algorithms'],
      learningGoals: 'Master DSA & Ace Top-Tier Tech Interviews',
      skillLevel: 'Intermediate',
      streakDays: 4,
      totalQuestionsAnswered: 42,
      overallAccuracy: 74,
      xp: 1450,
      level: 3,
      levelTitle: 'Algorithmic Explorer',
      achievements: [
        { id: 'first_diagnostic', title: 'Diagnostic Trailblazer', description: 'Completed initial 10-topic diagnostic survey', icon: 'Award', unlocked: true, unlockedAt: '2 days ago' },
        { id: 'streak_4', title: 'Consistency Champion', description: 'Maintained 4-day active learning streak', icon: 'Flame', unlocked: true, unlockedAt: 'Yesterday' },
        { id: 'binary_master', title: 'Binary Search Ace', description: 'Reached 90% mastery on logarithmic search', icon: 'Search', unlocked: true, unlockedAt: '3 days ago' },
        { id: 'speed_demon', title: 'Speed Demon', description: 'Solved an adaptive challenge in under 15 seconds', icon: 'Zap', unlocked: true, unlockedAt: 'Yesterday' },
        { id: 'recursion_conqueror', title: 'Recursion Demystifier', description: 'Reach ≥ 50% mastery on Recursion base cases', icon: 'RotateCcw', unlocked: false },
        { id: 'tree_climber', title: 'Tree Climber', description: 'Reach 75% on hierarchical tree traversals', icon: 'GitFork', unlocked: false }
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
    this.users.set(demoUser._id, demoUser);
    this.users.set(demoUser.email, demoUser);

    // Seed realistic baseline mastery for Demo Student
    // Realistic distribution from prompt: Arrays: 85%, Binary Search: 90%, Recursion: 35%, Trees: 60%, Graphs: 20%, DP: 15%
    const baselineMastery = [
      { slug: 'arrays', name: 'Arrays', score: 85, attempts: 18, correct: 16, accuracy: 88, difficulty: 'hard' },
      { slug: 'strings', name: 'Strings', score: 78, attempts: 12, correct: 10, accuracy: 83, difficulty: 'medium' },
      { slug: 'recursion', name: 'Recursion', score: 35, attempts: 8, correct: 3, accuracy: 38, difficulty: 'easy', consecutiveMistakes: 2 },
      { slug: 'binary-search', name: 'Binary Search', score: 90, attempts: 15, correct: 14, accuracy: 93, difficulty: 'hard' },
      { slug: 'sorting', name: 'Sorting', score: 72, attempts: 10, correct: 7, accuracy: 70, difficulty: 'medium' },
      { slug: 'linked-lists', name: 'Linked Lists', score: 68, attempts: 9, correct: 6, accuracy: 66, difficulty: 'medium' },
      { slug: 'stacks-and-queues', name: 'Stacks and Queues', score: 74, attempts: 11, correct: 8, accuracy: 72, difficulty: 'medium' },
      { slug: 'trees', name: 'Trees', score: 60, attempts: 10, correct: 6, accuracy: 60, difficulty: 'medium' },
      { slug: 'graphs', name: 'Graphs', score: 20, attempts: 5, correct: 1, accuracy: 20, difficulty: 'easy', consecutiveMistakes: 1 },
      { slug: 'dynamic-programming', name: 'Dynamic Programming', score: 15, attempts: 4, correct: 1, accuracy: 25, difficulty: 'easy', consecutiveMistakes: 2 }
    ];

    for (const b of baselineMastery) {
      const progressKey = `demo_student_01_${b.slug}`;
      this.studentProgress.set(progressKey, {
        userId: 'demo_student_01',
        topicSlug: b.slug,
        topicName: b.name,
        masteryScore: b.score,
        totalAttempts: b.attempts,
        correctAttempts: b.correct,
        recentAccuracy: b.accuracy,
        lastDifficulty: b.difficulty,
        consecutiveMistakes: b.consecutiveMistakes || 0,
        consecutiveSuccesses: b.score > 70 ? 2 : 0,
        recentMisconceptions: b.score < 40 ? ['Confusing recursion tree branching with iterative loop steps'] : [],
        history: [],
        updatedAt: new Date()
      });
    }

    // Seed recent completed assessment for demo user
    const sampleAssessment = {
      _id: 'assess_init_01',
      userId: 'demo_student_01',
      title: 'DSA Comprehensive Diagnostic',
      subject: 'Data Structures & Algorithms',
      totalQuestions: 10,
      score: 60,
      correctCount: 6,
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      topicResults: baselineMastery.map(b => ({
        topicSlug: b.slug,
        topicName: b.name,
        total: 1,
        correct: b.score >= 60 ? 1 : 0,
        masteryScore: b.score
      })),
      answers: []
    };
    this.assessments.set(sampleAssessment._id, sampleAssessment);

    // Seed initial Chat History with tutor
    this.chatHistories.set('demo_student_01', {
      userId: 'demo_student_01',
      topicContext: 'Recursion Fundamentals',
      messages: [
        {
          role: 'assistant',
          content: "Hello Alex! I am your LearnLoop AI tutor. I noticed your diagnostic assessment showed strong intuition in Arrays (85%) and Binary Search (90%), but Recursion (35%) had a few tricky gaps. Whenever you're ready, we can break down recursion trees or practice base case formulation!",
          suggestedNextStep: 'Explain Recursion Call Stacks with a diagram',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ],
      updatedAt: new Date()
    });

    // Load persisted changes from disk if available
    this.loadFromFile();

    this.isInitialized = true;
    console.log(`[DataStore] Seeded in-memory store with ${this.topics.size} DSA topics, ${this.questions.size} questions, and student profile.`);
  }

  saveToFile() {
    try {
      const dataDir = path.dirname(STORE_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const serialized = {
        users: Array.from(this.users.entries()),
        studentProgress: Array.from(this.studentProgress.entries()),
        assessments: Array.from(this.assessments.entries()),
        chatHistories: Array.from(this.chatHistories.entries()),
        leetcodeSubmissions: Array.from(this.leetcodeSubmissions.entries())
      };
      fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(serialized, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[DataStore] Failed to write store to disk:', e.message);
    }
  }

  debouncedSave() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this.saveToFile(), 400);
  }

  loadFromFile() {
    try {
      if (fs.existsSync(STORE_FILE_PATH)) {
        const raw = fs.readFileSync(STORE_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users) {
          for (const [k, v] of parsed.users) this.users.set(k, v);
        }
        if (parsed.studentProgress) {
          for (const [k, v] of parsed.studentProgress) this.studentProgress.set(k, v);
        }
        if (parsed.assessments) {
          for (const [k, v] of parsed.assessments) this.assessments.set(k, v);
        }
        if (parsed.chatHistories) {
          for (const [k, v] of parsed.chatHistories) this.chatHistories.set(k, v);
        }
        if (parsed.leetcodeSubmissions) {
          for (const [k, v] of parsed.leetcodeSubmissions) this.leetcodeSubmissions.set(k, v);
        }
        console.log(`[DataStore] Restored persistent data from disk (${this.users.size} users, ${this.studentProgress.size} progress records).`);
      }
    } catch (e) {
      console.warn('[DataStore] Could not load persisted store:', e.message);
    }
  }

  // User Methods
  async findUserByEmail(email) {
    return this.users.get(email.toLowerCase().trim());
  }

  async findUserById(id) {
    return this.users.get(id);
  }

  async createUser(userData) {
    const _id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const user = {
      _id,
      ...userData,
      email: userData.email.toLowerCase().trim(),
      createdAt: new Date()
    };
    this.users.set(_id, user);
    this.users.set(user.email, user);

    // Initialize blank progress for new user across all topics
    for (const topic of dsaTopics) {
      const progressKey = `${_id}_${topic.slug}`;
      this.studentProgress.set(progressKey, {
        userId: _id,
        topicSlug: topic.slug,
        topicName: topic.name,
        masteryScore: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        recentAccuracy: 0,
        lastDifficulty: 'easy',
        consecutiveMistakes: 0,
        consecutiveSuccesses: 0,
        recentMisconceptions: [],
        history: [],
        updatedAt: new Date()
      });
    }

    this.debouncedSave();
    return user;
  }

  // Topic Methods
  async getTopics() {
    return Array.from(this.topics.values()).sort((a, b) => a.order - b.order);
  }

  async getTopicBySlug(slug) {
    return this.topics.get(slug);
  }

  // Question Methods
  async getQuestions(filter = {}) {
    let list = Array.from(this.questions.values());
    if (filter.topicSlug) {
      list = list.filter(q => q.topicSlug === filter.topicSlug);
    }
    if (filter.difficulty) {
      list = list.filter(q => q.difficulty === filter.difficulty);
    }
    return list;
  }

  async getQuestionById(id) {
    return this.questions.get(id);
  }

  // Student Progress Methods
  async getStudentProgress(userId) {
    const results = [];
    for (const [key, val] of this.studentProgress.entries()) {
      if (val.userId === userId) {
        results.push(val);
      }
    }
    // Return sorted according to topic order
    const topicOrder = new Map(dsaTopics.map((t, idx) => [t.slug, idx]));
    return results.sort((a, b) => (topicOrder.get(a.topicSlug) ?? 99) - (topicOrder.get(b.topicSlug) ?? 99));
  }

  async getTopicProgress(userId, topicSlug) {
    const key = `${userId}_${topicSlug}`;
    if (!this.studentProgress.has(key)) {
      const topic = this.topics.get(topicSlug);
      const initial = {
        userId,
        topicSlug,
        topicName: topic ? topic.name : topicSlug,
        masteryScore: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        recentAccuracy: 0,
        lastDifficulty: 'easy',
        consecutiveMistakes: 0,
        consecutiveSuccesses: 0,
        recentMisconceptions: [],
        history: [],
        updatedAt: new Date()
      };
      this.studentProgress.set(key, initial);
      return initial;
    }
    return this.studentProgress.get(key);
  }

  async updateTopicProgress(userId, topicSlug, updates) {
    const key = `${userId}_${topicSlug}`;
    const existing = await this.getTopicProgress(userId, topicSlug);
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.studentProgress.set(key, updated);
    this.debouncedSave();
    return updated;
  }

  // Assessment Methods
  async saveAssessment(assessmentData) {
    const _id = `assess_${Date.now()}`;
    const record = {
      _id,
      ...assessmentData,
      completedAt: new Date()
    };
    this.assessments.set(_id, record);
    this.debouncedSave();
    return record;
  }

  async getUserAssessments(userId) {
    const list = [];
    for (const assess of this.assessments.values()) {
      if (assess.userId === userId) {
        list.push(assess);
      }
    }
    return list.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  // Learning Path Methods
  async getLearningPath(userId) {
    return this.learningPaths.get(userId);
  }

  async saveLearningPath(userId, pathData) {
    const record = {
      userId,
      ...pathData,
      updatedAt: new Date()
    };
    this.learningPaths.set(userId, record);
    return record;
  }

  // Chat History Methods
  async getChatHistory(userId) {
    if (!this.chatHistories.has(userId)) {
      this.chatHistories.set(userId, {
        userId,
        topicContext: 'Recursion',
        messages: [
          {
            role: 'assistant',
            content: "Hello! I am your LearnLoop AI tutor. How can I help you today? Ask me to explain any DSA concept, review your recent weak areas, or generate guided practice problems!",
            suggestedNextStep: 'Explain Recursion vs Iteration',
            timestamp: new Date()
          }
        ],
        updatedAt: new Date()
      });
    }
    return this.chatHistories.get(userId);
  }

  async addChatMessage(userId, message, topicContext) {
    const history = await this.getChatHistory(userId);
    history.messages.push({
      ...message,
      timestamp: new Date()
    });
    if (topicContext) {
      history.topicContext = topicContext;
    }
    history.updatedAt = new Date();
    this.chatHistories.set(userId, history);
    this.debouncedSave();
    return history;
  }

  async clearChatHistory(userId) {
    this.chatHistories.delete(userId);
    this.debouncedSave();
    return this.getChatHistory(userId);
  }

  // --- LeetCode Tracking & Submissions ---
  async addLeetCodeSubmission(submission) {
    const id = submission.id || `lc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record = {
      id,
      ...submission,
      createdAt: submission.createdAt || new Date()
    };
    this.leetcodeSubmissions.set(id, record);

    // Award XP to user
    const userId = submission.userId || 'demo_student_01';
    const user = this.users.get(userId);
    if (user) {
      const xpAward = submission.difficulty === 'Hard' ? 200 : submission.difficulty === 'Medium' ? 100 : 50;
      user.xp = (user.xp || 0) + xpAward;
      user.totalQuestionsAnswered = (user.totalQuestionsAnswered || 0) + 1;
      this.users.set(userId, user);
    }

    this.debouncedSave();
    return record;
  }

  async getLeetCodeSubmissions(userId = 'demo_student_01') {
    const all = Array.from(this.leetcodeSubmissions.values());
    return all
      .filter(s => !s.userId || s.userId === userId || userId === 'all')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getLeetCodeAnalytics(userId = 'demo_student_01') {
    const subs = await this.getLeetCodeSubmissions(userId);
    const byDiff = {
      Easy: { count: 0, totalSeconds: 0 },
      Medium: { count: 0, totalSeconds: 0 },
      Hard: { count: 0, totalSeconds: 0 }
    };

    subs.forEach(s => {
      const diff = s.difficulty || 'Medium';
      if (!byDiff[diff]) byDiff[diff] = { count: 0, totalSeconds: 0 };
      byDiff[diff].count += 1;
      byDiff[diff].totalSeconds += (s.timeSpentSeconds || 0);
    });

    const formatAvg = (sec, count) => {
      if (count === 0) return 'N/A';
      const avg = Math.round(sec / count);
      const m = Math.floor(avg / 60);
      const s = avg % 60;
      return `${m}m ${s}s`;
    };

    return {
      totalSubmissions: subs.length,
      averageTime: {
        easy: formatAvg(byDiff.Easy.totalSeconds, byDiff.Easy.count),
        medium: formatAvg(byDiff.Medium.totalSeconds, byDiff.Medium.count),
        hard: formatAvg(byDiff.Hard.totalSeconds, byDiff.Hard.count),
        easySeconds: byDiff.Easy.count ? Math.round(byDiff.Easy.totalSeconds / byDiff.Easy.count) : null,
        mediumSeconds: byDiff.Medium.count ? Math.round(byDiff.Medium.totalSeconds / byDiff.Medium.count) : null,
        hardSeconds: byDiff.Hard.count ? Math.round(byDiff.Hard.totalSeconds / byDiff.Hard.count) : null
      },
      counts: {
        easy: byDiff.Easy.count,
        medium: byDiff.Medium.count,
        hard: byDiff.Hard.count
      },
      speedRating: byDiff.Medium.count && (byDiff.Medium.totalSeconds / byDiff.Medium.count) <= 1200
        ? 'FAANG Screen Ready (Sub-20m Medium Pace)'
        : 'Steady (Aim for <20m per Medium)',
      recentSubmissions: subs.slice(0, 10)
    };
  }
}

export const dbStore = new DataStore();

