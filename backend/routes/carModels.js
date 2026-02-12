const express = require('express');
const router = express.Router();
const CarModel = require('../models/CarModel');

router.get('/', async (req, res) => {
  try {
    const { search, listingType } = req.query;
    let filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { brand: regex }];
    }
    if (listingType) {
      filter.listingType = listingType;
    }
    const models = await CarModel.find(filter).sort({ brand: 1, name: 1 });
    res.json({ success: true, carModels: models });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const model = await CarModel.findOne({ id: req.params.id });
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }
    res.json({ success: true, model });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
