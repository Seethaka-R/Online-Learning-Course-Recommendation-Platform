// routes/courseRoutes.js — Course CRUD routes
const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, getFeaturedCourses, createCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('admin', 'instructor'), createCourse);

module.exports = router;
