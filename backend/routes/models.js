const express = require('express');
const router = express.Router();
const Organ = require('../models/Organ');
const { authMiddleware, teacherMiddleware } = require('../middleware/auth');

// Get all models
router.get('/', authMiddleware, async (req, res) => {
  try {
    const models = await Organ.find().populate('teacherId', 'name email');
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get models by teacher
router.get('/teacher', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const models = await Organ.find({ teacherId: req.userId }).sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single model
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const model = await Organ.findById(req.params.id).populate('teacherId', 'name email');
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add model (Teacher only)
router.post('/', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { name, system, description, modelUrl } = req.body;

    if (!name || !system || !modelUrl) {
      return res.status(400).json({ message: 'Name, system, and model URL are required' });
    }

    // Validate .glb URL
    if (!modelUrl.endsWith('.glb')) {
      return res.status(400).json({ message: 'Model URL must be a .glb file' });
    }

    const organ = new Organ({
      name,
      system,
      description: description || '',
      modelUrl,
      teacherId: req.userId
    });

    await organ.save();
    res.status(201).json(organ);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete model (Teacher only - own models)
router.delete('/:id', authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const model = await Organ.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    if (model.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own models' });
    }

    await Organ.findByIdAndDelete(req.params.id);
    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

