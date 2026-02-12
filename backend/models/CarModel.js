const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['sports', 'sedan', 'suv', 'coupe', 'hatchback', 'truck', 'convertible'],
    default: 'sports'
  },
  image: {
    type: String,
    default: ''
  },
  price: { type: Number, default: 0 },
  hp: { type: Number },
  cc: { type: Number },
  speed: { type: String },
  cylinder: { type: Number },
  totalRun: { type: String, default: '' },
  condition: { type: String, default: '' },
  year: { type: Number },
  fuelType: { type: String },
  transmission: { type: String },
  description: { type: String, default: '' },
  modelPath: { type: String, default: '/models/porshe.glb' },
  listingType: { type: String, enum: ['hot', 'regular', ''], default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('CarModel', carModelSchema);
