// controllers/courseController.js — CRUD + search/filter for courses
const Course = require('../models/Course');

// @desc  Get all courses (with optional search, category, level filters)
// @route GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (level) query.level = level;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort({ rating: -1, enrolledCount: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single course by ID
// @route GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get featured courses
// @route GET /api/courses/featured
const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isFeatured: true }).limit(6);
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create course (admin/instructor only)
// @route POST /api/courses
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCourses, getCourseById, getFeaturedCourses, createCourse };
