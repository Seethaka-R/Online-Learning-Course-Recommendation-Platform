// controllers/progressController.js — Update and get learning progress
const Progress = require('../models/Progress');

// @desc  Get progress for a specific course
// @route GET /api/progress/:courseId
const getCourseProgress = async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.params.courseId,
  });
  if (!progress) return res.status(404).json({ success: false, message: 'Progress not found' });
  res.json({ success: true, data: progress });
};

// @desc  Get all progress records for the logged-in user
// @route GET /api/progress/my
const getAllProgress = async (req, res) => {
  const progressList = await Progress.find({ user: req.user._id }).populate('course', 'title thumbnail category totalLessons');
  res.json({ success: true, data: progressList });
};

// @desc  Update progress for a course
// @route PUT /api/progress/:courseId
// @body  { completedLessons: [...], progressPercent: 65 }
const updateProgress = async (req, res) => {
  const { completedLessons, progressPercent } = req.body;

  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.params.courseId,
  });

  if (!progress) return res.status(404).json({ success: false, message: 'Progress record not found. Enroll first.' });

  if (completedLessons !== undefined) progress.completedLessons = completedLessons;
  if (progressPercent !== undefined) progress.progressPercent = progressPercent;
  progress.lastAccessedAt = Date.now();

  if (progress.progressPercent >= 100) {
    progress.completed = true;
    progress.completedAt = Date.now();
  }

  const updated = await progress.save();
  res.json({ success: true, data: updated });
};

module.exports = { getCourseProgress, getAllProgress, updateProgress };