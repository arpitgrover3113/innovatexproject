import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  prerequisites: { type: [String], default: [] }, // Array of topic slugs
  subject: { type: String, default: 'Data Structures & Algorithms' },
  order: { type: Number, required: true },
  icon: { type: String, default: 'Code' },
  estimatedHours: { type: Number, default: 4 }
});

export const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);

