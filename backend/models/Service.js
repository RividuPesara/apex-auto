const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  duration: { type: String, default: '1-2 hours' },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
