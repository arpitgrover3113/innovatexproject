import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  recommendedTopics: [
    {
      topicSlug: String,
      topicName: String,
      priority: { type: String, enum: ['critical', 'high', 'medium', 'mastered'] },
      reason: String,
      status: { type: String, enum: ['locked', 'in_progress', 'ready', 'mastered'], default: 'ready' },
      masteryScore: Number,
      prerequisites: [String],
      recommendedAction: String
    }
  ],
  completedTopics: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export const LearningPath = mongoose.models.LearningPath || mongoose.model('LearningPath', learningPathSchema);

