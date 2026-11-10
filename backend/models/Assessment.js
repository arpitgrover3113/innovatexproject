import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, default: 'DSA Diagnostic Assessment' },
  subject: { type: String, default: 'Data Structures & Algorithms' },
  totalQuestions: { type: Number, required: true },
  score: { type: Number, required: true }, // percentage 0 - 100
  correctCount: { type: Number, required: true },
  topicResults: [
    {
      topicSlug: String,
      topicName: String,
      total: Number,
      correct: Number,
      masteryScore: Number
    }
  ],
  answers: [
    {
      questionId: String,
      questionText: String,
      topicSlug: String,
      topicName: String,
      difficulty: String,
      selectedOption: Number,
      correctAnswer: Number,
      isCorrect: Boolean,
      responseTimeSeconds: Number
    }
  ],
  completedAt: { type: Date, default: Date.now }
});

export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);

