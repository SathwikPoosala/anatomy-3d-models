const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { authMiddleware, teacherMiddleware, studentMiddleware } = require('../middleware/auth');

// Get all quizzes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('teacherId', 'name email');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quizzes by teacher
router.get('/teacher', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.userId }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single quiz
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('teacherId', 'name email');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add quiz (Teacher only)
router.post('/', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { system, questions } = req.body;

    if (!system || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'System and questions array are required' });
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer) {
        return res.status(400).json({ message: 'Each question must have question, 4 options, and correctAnswer' });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({ message: 'Correct answer must be one of the options' });
      }
    }

    const quiz = new Quiz({
      system,
      questions,
      teacherId: req.userId
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit quiz (Student only)
router.post('/:id/submit', authMiddleware, studentMiddleware, async (req, res) => {
  try {
    const { answers } = req.body; // Array of answers

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Save score to user
    const user = await User.findById(req.userId);
    user.quizScores.push({
      quizId: quiz._id,
      score,
      totalQuestions: quiz.questions.length
    });
    await user.save();

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete quiz (Teacher only - own quizzes)
router.delete('/:id', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own quizzes' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

