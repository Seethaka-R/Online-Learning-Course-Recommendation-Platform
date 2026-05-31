// controllers/enrollmentController.js — Enroll, unenroll, get enrollments
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc  Enroll in a course
// @route POST /api/enroll/:courseId
const enrollCourse = async (req, res) => {
  const { courseId } = req.params;

  // Check if already enrolled
  const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (existing) return res.status(400).json({ success: false, message: 'Already enrolled' });

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

  // Create enrollment
  const enrollment = await Enrollment.create({ user: req.user._id, course: courseId });

  // Create initial progress record
  await Progress.create({ user: req.user._id, course: courseId });

  // Increment enrolledCount
  await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

  res.status(201).json({ success: true, data: enrollment });
};

// @desc  Get all enrollments for logged-in user
// @route GET /api/enroll/my
const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
  res.json({ success: true, data: enrollments });
};

// @desc  Check enrollment status for a course
// @route GET /api/enroll/check/:courseId
const checkEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.courseId,
  });
  res.json({ success: true, enrolled: !!enrollment });
};

// @desc  Unenroll from a course
// @route DELETE /api/enroll/:courseId
const unenrollCourse = async (req, res) => {
  const enrollment = await Enrollment.findOneAndDelete({
    user: req.user._id,
    course: req.params.courseId,
  });
  if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled' });
  res.json({ success: true, message: 'Unenrolled successfully' });
};

module.exports = { enrollCourse, getMyEnrollments, checkEnrollment, unenrollCourse };