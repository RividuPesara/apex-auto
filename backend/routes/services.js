const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
