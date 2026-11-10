import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  selectedSubjects: { type: [String], default: ['Data Structures & Algorithms'] },
  learningGoals: { type: String, default: 'Master DSA & Ace Technical Interviews' },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  streakDays: { type: Number, default: 3 },
  totalQuestionsAnswered: { type: Number, default: 0 },
  overallAccuracy: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

