import mongoose from 'mongoose';

const studentProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topicSlug: { type: String, required: true },
  topicName: { type: String, required: true },
  masteryScore: { type: Number, default: 0, min: 0, max: 100 },
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  recentAccuracy: { type: Number, default: 0 },
  lastDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  consecutiveMistakes: { type: Number, default: 0 },
  consecutiveSuccesses: { type: Number, default: 0 },
  recentMisconceptions: { type: [String], default: [] },
  history: [
    {
      questionId: String,
      difficulty: String,
      isCorrect: Boolean,
      responseTimeSeconds: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

export const StudentProgress = mongoose.models.StudentProgress || mongoose.model('StudentProgress', studentProgressSchema);

