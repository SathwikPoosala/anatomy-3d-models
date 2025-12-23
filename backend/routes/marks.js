const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const { authMiddleware, studentMiddleware } = require('../middleware/auth');

// Get student marks
router.get('/', authMiddleware, studentMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('quizScores.quizId');
    
    const marks = user.quizScores.map(score => {
      const quiz = score.quizId;
      return {
        quizId: quiz._id,
        quizName: quiz.system || 'Quiz',
        score: score.score,
        totalQuestions: score.totalQuestions,
        percentage: Math.round((score.score / score.totalQuestions) * 100),
        date: score.date
      };
    });

    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

