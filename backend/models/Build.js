const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  carModel: {
    type: String,
    required: [true, 'Car model is required']
  },
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  selectedParts: {
    wheels: {
      type: String,
      default: 'stock'
    },
    spoiler: {
      type: String,
      default: 'none'
    },
    lights: {
      type: String,
      default: 'halogen'
    },
    exhaust: {
      type: String,
      default: 'stock'
    }
  },
  modelName: {
    type: String,
    default: ''
  },
  modelImage: {
    type: String,
    default: ''
  },
  selectedServices: [{
    type: String
  }],
  totalEstimatedCost: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Build', buildSchema);
