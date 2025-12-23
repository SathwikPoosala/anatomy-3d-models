const mongoose = require('mongoose');

const organSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  system: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  modelUrl: {
    type: String,
    required: true,
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Organ', organSchema);

