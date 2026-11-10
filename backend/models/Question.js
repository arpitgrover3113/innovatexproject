import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  codeSnippet: { type: String, default: null },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true }, // 0-based index (0, 1, 2, 3)
  explanation: { type: String, required: true },
  topicSlug: { type: String, required: true },
  topicName: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  misconceptionTip: { type: String, default: null }
});

export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

