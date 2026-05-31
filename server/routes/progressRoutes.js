// routes/progressRoutes.js — Learning progress routes
const express = require('express');
const router = express.Router();
const {
  getCourseProgress,
  getAllProgress,
  updateProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getAllProgress);
router.get('/:courseId', protect, getCourseProgress);
router.put('/:courseId', protect, updateProgress);

module.exports = router;
