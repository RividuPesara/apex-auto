require('dotenv').config();
const mongoose = require('mongoose');
const CarModel = require('./models/CarModel');
const Service = require('./models/Service');

const carModels = [
  {
    id: 'porsche-911-turbo-s',
    name: 'Porsche 911 Turbo S',
    brand: 'Porsche',
    category: 'sports',
    image: '/images/test2.webp',
    price: 85000000,
    hp: 641,
    cc: 3745,
    speed: '8-Speed',
    cylinder: 6,
    totalRun: '2,500 Km',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'PDK Dual-Clutch',
    description: 'Ultimate sports car with twin-turbo flat-six, all-wheel drive, and legendary Porsche engineering. Track-ready performance with everyday usability.',
    modelPath: '/models/porshe.glb',
    listingType: 'hot'
  },
  {
    id: 'porsche-911-carrera',
    name: 'Porsche 911 Carrera',
    brand: 'Porsche',
    category: 'sports',
    image: '/images/test3.webp',
    price: 62000000,
    hp: 385,
    cc: 2981,
    speed: '8-Speed',
    cylinder: 6,
    totalRun: '8,450 Km',
    condition: 'Excellent',
    year: 2023,
    fuelType: 'Petrol',
    transmission: 'PDK',
    description: 'Iconic rear-engine sports car with balanced handling, a refined flat-six, and timeless design.',
    modelPath: '/models/porshe.glb',
    listingType: 'regular'
  },
  {
    id: 'porsche-911-gt3',
    name: 'Porsche 911 GT3',
    brand: 'Porsche',
    category: 'sports',
    image: '/images/test3.webp',
    price: 95000000,
    hp: 502,
    cc: 3996,
    speed: '6-Speed',
    cylinder: 6,
    totalRun: '3,200 Km',
    condition: 'Great',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    description: 'Track-focused 911 with high-revving naturally aspirated engine, rear-wheel steering, and aggressive aerodynamics.',
    modelPath: '/models/porshe.glb',
    listingType: 'regular'
  }
];

carModels.push({
  id: 'porsche-911-gt2',
  name: 'Porsche 911 GT2',
  brand: 'Porsche',
  category: 'sports',
  image: '/images/test3.webp',
  price: 120000000,
  hp: 700,
  cc: 3800,
  speed: '7-Speed',
  cylinder: 6,
  totalRun: '500 Km',
  condition: 'New',
  year: 2025,
  fuelType: 'Petrol',
  transmission: 'PDK',
  description: 'Ultra-high-performance GT2 with lightweight components and track-focused setup.',
  modelPath: '/models/porshe.glb',
  listingType: 'hot'
});

const services = [
  { id: 'body-color', name: 'Body Color Change', description: 'Full exterior repaint with premium automotive paint', price: 750000, category: 'exterior' },
  { id: 'wheels', name: 'Wheel Upgrade', description: 'Performance alloy or carbon fiber wheel replacement', price: 540000, category: 'exterior' },
  { id: 'spoiler', name: 'Spoiler Installation', description: 'Aerodynamic spoiler or GT wing fitting', price: 360000, category: 'exterior' },
  { id: 'headlights', name: 'Headlight Upgrade', description: 'LED or Xenon HID headlight conversion', price: 270000, category: 'lighting' },
  { id: 'exhaust', name: 'Exhaust System', description: 'Performance exhaust with enhanced sound and flow', price: 660000, category: 'performance' },
  { id: 'suspension', name: 'Suspension Kit', description: 'Lowering springs or coilover suspension upgrade', price: 450000, category: 'performance' },
  { id: 'interior-trim', name: 'Interior Trim', description: 'Carbon fiber or alcantara interior trim upgrade', price: 900000, category: 'interior' },
  { id: 'tint', name: 'Window Tinting', description: 'Professional ceramic window tint application', price: 120000, category: 'exterior' },
  { id: 'wrap', name: 'Vinyl Wrap', description: 'Full vehicle vinyl wrap in custom color or design', price: 1050000, category: 'exterior' },
  { id: 'tune', name: 'ECU Tune', description: 'Performance ECU remap for increased power output', price: 240000, category: 'performance' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await CarModel.deleteMany({});
    console.log('Cleared existing car models');

    const createdModels = await CarModel.insertMany(carModels);
    console.log(`Seeded ${createdModels.length} car models`);

    await Service.deleteMany({});
    console.log('Cleared existing services');

    const createdServices = await Service.insertMany(services);
    console.log(`Seeded ${createdServices.length} services`);

    await mongoose.connection.close();
    console.log('Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
