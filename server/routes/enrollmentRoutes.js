// routes/enrollmentRoutes.js — Enrollment routes
const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
  unenrollCourse,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:courseId', protect, enrollCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);
router.delete('/:courseId', protect, unenrollCourse);

module.exports = router;
