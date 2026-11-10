import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { dsaTopics, dsaQuestions } from './dsaData.js';
import { User } from '../models/User.js';
import { Topic } from '../models/Topic.js';
import { Question } from '../models/Question.js';
import { StudentProgress } from '../models/StudentProgress.js';
import { Assessment } from '../models/Assessment.js';
import { LearningPath } from '../models/LearningPath.js';
import { ChatHistory } from '../models/ChatHistory.js';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnloop';
  console.log(`Connecting to MongoDB at: ${uri}`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('MongoDB connection established.');

    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Topic.deleteMany({}),
      Question.deleteMany({}),
      StudentProgress.deleteMany({}),
      Assessment.deleteMany({}),
      LearningPath.deleteMany({}),
      ChatHistory.deleteMany({})
    ]);

    console.log('Seeding DSA Topics...');
    await Topic.insertMany(dsaTopics);

    console.log('Seeding DSA Questions...');
    await Question.insertMany(dsaQuestions.map(q => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topicSlug: q.topicSlug,
      topicName: q.topicName,
      difficulty: q.difficulty,
      misconceptionTip: q.misconceptionTip
    })));

    console.log('Seeding Demo User...');
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    const demoUser = await User.create({
      name: 'Alex Mercer',
      email: 'alex@learnloop.ai',
      passwordHash: demoPasswordHash,
      selectedSubjects: ['Data Structures & Algorithms'],
      learningGoals: 'Master DSA & Ace Top-Tier Tech Interviews',
      skillLevel: 'Intermediate',
      streakDays: 4,
      totalQuestionsAnswered: 42,
      overallAccuracy: 74
    });

    console.log('Seeding Student Baseline Progress...');
    const baseline = [
      { slug: 'arrays', name: 'Arrays', score: 85 },
      { slug: 'strings', name: 'Strings', score: 78 },
      { slug: 'recursion', name: 'Recursion', score: 35 },
      { slug: 'binary-search', name: 'Binary Search', score: 90 },
      { slug: 'sorting', name: 'Sorting', score: 72 },
      { slug: 'linked-lists', name: 'Linked Lists', score: 68 },
      { slug: 'stacks-and-queues', name: 'Stacks and Queues', score: 74 },
      { slug: 'trees', name: 'Trees', score: 60 },
      { slug: 'graphs', name: 'Graphs', score: 20 },
      { slug: 'dynamic-programming', name: 'Dynamic Programming', score: 15 }
    ];

    for (const b of baseline) {
      await StudentProgress.create({
        userId: demoUser._id.toString(),
        topicSlug: b.slug,
        topicName: b.name,
        masteryScore: b.score,
        totalAttempts: 10,
        correctAttempts: Math.round(10 * (b.score / 100)),
        recentAccuracy: b.score,
        lastDifficulty: b.score >= 75 ? 'hard' : b.score >= 40 ? 'medium' : 'easy'
      });
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.warn(`Could not seed MongoDB directly (${err.message}). Note: The backend automatic in-memory engine seeds this data automatically upon launch!`);
    process.exit(0);
  }
};

seed();

