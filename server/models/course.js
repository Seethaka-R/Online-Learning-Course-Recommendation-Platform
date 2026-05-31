// models/Course.js — Course schema with tags and category
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Data Science',
        'AI/ML',
        'Cybersecurity',
        'Mobile Development',
        'Cloud Computing',
        'DevOps',
        'UI/UX Design',
        'Database',
        'Programming',
      ],
    },
    tags: [{ type: String }],             // e.g. ['React', 'JavaScript', 'Frontend']
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: { type: String, default: '10 hours' }, // e.g. "12 hours"
    totalLessons: { type: Number, default: 10 },
    price: { type: Number, default: 0 },            // 0 = free
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    enrolledCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    curriculum: [
      {
        sectionTitle: String,
        lessons: [
          {
            lessonTitle: String,
            duration: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Text index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);