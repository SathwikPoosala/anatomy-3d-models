const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  system: {
    type: String,
    required: true,
    trim: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 4;
        },
        message: 'Each question must have exactly 4 options'
      }
    },
    correctAnswer: {
      type: String,
      required: true
    }
  }],
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);

