// controllers/recommendationController.js — Keyword-based course recommendations
const Course = require('../models/Course');

// @desc  Get personalized course recommendations based on user interests/skills
// @route GET /api/recommend
const getRecommendations = async (req, res) => {
  try {
    const user = req.user;

    if (!user || (!user.interests?.length && !user.skills?.length)) {
      // Fallback: return top rated courses
      const courses = await Course.find()
        .sort({ rating: -1, enrolledCount: -1 })
        .limit(8);
      return res.json({ success: true, data: courses });
    }

    // Build category map from interests
    const interestCategoryMap = {
      'Web Development': 'Web Development',
      'Data Science': 'Data Science',
      'AI/ML': 'AI/ML',
      'Cybersecurity': 'Cybersecurity',
      'Mobile Development': 'Mobile Development',
      'Cloud Computing': 'Cloud Computing',
      'DevOps': 'DevOps',
      'UI/UX Design': 'UI/UX Design',
      'Database': 'Database',
      'Programming': 'Programming',
    };

    const interestedCategories = user.interests
      .map((i) => interestCategoryMap[i])
      .filter(Boolean);

    const skillKeywords = user.skills || [];

    // Find courses matching interests or skills (tags)
    let recommendedCourses = [];

    if (interestedCategories.length > 0) {
      recommendedCourses = await Course.find({
        category: { $in: interestedCategories },
      })
        .sort({ rating: -1, enrolledCount: -1 })
        .limit(12);
    }

    // If not enough, add courses matching skill tags
    if (recommendedCourses.length < 6 && skillKeywords.length > 0) {
      const tagMatches = await Course.find({
        tags: { $in: skillKeywords },
        _id: { $nin: recommendedCourses.map((c) => c._id) },
      })
        .sort({ rating: -1 })
        .limit(8);
      recommendedCourses = [...recommendedCourses, ...tagMatches];
    }

    // Add recommendScore for each course
    const scoredCourses = recommendedCourses.map((course) => {
      const courseObj = course.toObject();
      let score = 0;

      // Category match: +40 pts
      if (interestedCategories.includes(course.category)) score += 40;

      // Tag matches: +10 pts each
      skillKeywords.forEach((skill) => {
        if (course.tags.includes(skill)) score += 10;
      });

      // Rating bonus: up to 10 pts
      score += Math.round((course.rating / 5) * 10);

      courseObj.recommendScore = Math.min(score, 99);
      return courseObj;
    });

    // Sort by score desc
    scoredCourses.sort((a, b) => b.recommendScore - a.recommendScore);

    res.json({ success: true, data: scoredCourses.slice(0, 8) });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecommendations };
