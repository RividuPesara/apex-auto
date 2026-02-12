const express = require('express');
const { body, validationResult } = require('express-validator');
const Build = require('../models/Build');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('carModel').notEmpty().withMessage('Car model is required'),
    body('color').notEmpty().withMessage('Color is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
          errors: errors.array()
        });
      }

      const { carModel, color, selectedParts, selectedServices, modelName, modelImage, totalEstimatedCost, notes } = req.body;

      const build = await Build.create({
        userId: req.user._id,
        carModel,
        color,
        selectedParts: selectedParts || {},
        selectedServices: selectedServices || [],
        modelName: modelName || '',
        modelImage: modelImage || '',
        totalEstimatedCost: totalEstimatedCost || 0,
        notes: notes || ''
      });

      res.status(201).json({
        success: true,
        build
      });
    } catch (error) {
      console.error('Create build error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

router.get('/', protect, async (req, res) => {
  try {
    const builds = await Build.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      count: builds.length,
      builds
    });
  } catch (error) {
    console.error('Get builds error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put(
  '/:id',
  protect,
  async (req, res) => {
    try {
      const build = await Build.findById(req.params.id);

      if (!build) {
        return res.status(404).json({ success: false, message: 'Build not found' });
      }

      if (build.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this build' });
      }

      const { carModel, color, selectedParts, selectedServices, modelName, modelImage, totalEstimatedCost, notes } = req.body;

      if (carModel) build.carModel = carModel;
      if (color) build.color = color;
      if (selectedParts) build.selectedParts = selectedParts;
      if (selectedServices) build.selectedServices = selectedServices;
      if (modelName !== undefined) build.modelName = modelName;
      if (modelImage !== undefined) build.modelImage = modelImage;
      if (totalEstimatedCost !== undefined) build.totalEstimatedCost = totalEstimatedCost;
      if (notes !== undefined) build.notes = notes;

      await build.save();

      res.json({
        success: true,
        build
      });
    } catch (error) {
      console.error('Update build error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

router.delete('/:id', protect, async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ success: false, message: 'Build not found' });
    }

    // Ensure user owns this build
    if (build.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this build' });
    }

    await Build.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Build deleted successfully'
    });
  } catch (error) {
    console.error('Delete build error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
