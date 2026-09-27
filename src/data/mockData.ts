import type { Product, UpcomingDeduction, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Akshay',
  title: 'Level 12 Builder',
  level: 12,
  netWorth: 240000, // ₹2.4L
  savingsStreakWeeks: 12,
  monthlyIncome: 95000,
  monthlySavingsVelocity: 14300,
};

export const initialWalletData = {
  total: 38420,
  free: 14200,
  planned: 9800,
  locked: 14420,
};

export const upcomingDeductions: UpcomingDeduction[] = [
  {
    id: 'ded-1',
    name: 'Penthouse Rent',
    category: 'Housing',
    amount: 8000,
    dueDate: 'In 4 days (Oct 1)',
    isAutoDebit: true,
    priority: 'high',
  },
  {
    id: 'ded-2',
    name: 'HDFC Millennia Credit Card',
    category: 'Credit',
    amount: 4200,
    dueDate: 'In 7 days (Oct 4)',
    isAutoDebit: true,
    priority: 'high',
  },
  {
    id: 'ded-3',
    name: 'MacBook Zero EMI',
    category: 'Tech EMI',
    amount: 3000,
    dueDate: 'In 12 days (Oct 9)',
    isAutoDebit: true,
    priority: 'medium',
  },
  {
    id: 'ded-4',
    name: 'Cloud & Media Subscriptions',
    category: 'Subscriptions',
    amount: 799,
    dueDate: 'In 2 days (Sep 29)',
    isAutoDebit: true,
    priority: 'low',
  },
];

export const initialProducts: Product[] = [
  // Affordable Tech
  {
    id: 'prod-smartwatch',
    name: 'Cyber Horizon Smartwatch',
    brand: 'Apex Wear',
    category: 'watches',
    price: 12990,
    description: 'Biometric titanium smartwatch with holographic always-on OLED and 14-day battery.',
    specs: {
      'Display': '1.9" Sapphire AMOLED',
      'Battery': '14 Days Ultra',
      'Case': 'Grade 5 Titanium',
      'Sensors': 'ECG, SpO2, Neural Tap'
    },
    modelType: 'watch',
    featured: true,
  },
  // Audio
  {
    id: 'prod-sony-wh1000xm6',
    name: 'WH-1000XM6 Flagship',
    brand: 'Sony',
    category: 'audio',
    price: 29990,
    description: 'Industry-leading AI noise cancelling with dual processor spatial acoustics and carbon dome drivers.',
    specs: {
      'Acoustic Driver': '40mm Carbon Composite',
      'ANC': 'Dual QN3 Processors',
      'Battery': '40h Quick Charge',
      'Weight': '248g Featherlight'
    },
    modelType: 'headphones',
    featured: true,
  },
  // Phones
  {
    id: 'prod-iphone16pro',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'phones',
    price: 129900,
    description: 'Forged in aerospace grade titanium. A18 Pro chip, studio-quality mics, and 5x telephoto optical zoom.',
    specs: {
      'Processor': 'A18 Pro 3nm',
      'Camera': '48MP Fusion + 5x Tetraprism',
      'Display': '6.9" ProMotion 120Hz',
      'Chassis': 'Micro-blasted Grade 5 Titanium'
    },
    modelType: 'phone',
    featured: true,
  },
  // Gaming
  {
    id: 'prod-ps5pro',
    name: 'PlayStation 5 Pro',
    brand: 'Sony Interactive',
    category: 'gaming',
    price: 79990,
    description: 'Spectacular 4K 120FPS ray-tracing console powered by PlayStation Spectral Super Resolution (PSSR).',
    specs: {
      'GPU Compute': '16.7 TFLOPs RDNA3',
      'Storage': '2TB Ultra NVMe',
      'Upscaling': 'AI PSSR 8K Ready',
      'Audio': 'Tempest 3D AudioTech'
    },
    modelType: 'console',
    featured: true,
  },
  // Laptops
  {
    id: 'prod-macbookpro',
    name: 'MacBook Pro 16" M4 Max',
    brand: 'Apple',
    category: 'laptops',
    price: 189900,
    description: 'Extreme workstation performance with liquid retina XDR nano-texture display and 128GB unified memory.',
    specs: {
      'Chip': 'Apple M4 Max 16-core CPU',
      'Memory': '36GB Unified 400GB/s',
      'Screen': '16.2" Liquid Retina XDR',
      'Battery': '22 Hours All-Day'
    },
    modelType: 'laptop',
  },
  // Cameras
  {
    id: 'prod-leica-camera',
    name: 'Leica Q3 Monochrom',
    brand: 'Leica',
    category: 'audio', // categorized under creative/gadgets
    price: 84990,
    description: 'Full-frame sensor with Summilux 28mm f/1.7 ASPH prime lens and handcrafted magnesium body.',
    specs: {
      'Sensor': '60MP BSI Full-Frame',
      'Lens': 'Summilux 28mm f/1.7 Fixed',
      'Body': 'Machined Magnesium Alloy',
      'Viewfinder': '5.76M OLED EVF'
    },
    modelType: 'camera',
  },
  // Fashion / Sneakers
  {
    id: 'prod-cyber-sneakers',
    name: 'Air Mag Quantum Runner',
    brand: 'Nike Lab',
    category: 'fashion',
    price: 18500,
    description: 'Self-lacing biometric footwear with magnetic charging dock and reactive kinetic cushions.',
    specs: {
      'Lacing': 'Electro-Adaptive Fit Engine',
      'Cushion': 'Quantum Zoom Air',
      'Outsole': 'Graphene Grip Grid',
      'Lighting': 'Chroma Neon Under-rim'
    },
    modelType: 'sneaker',
  },
  // Luxury Watches
  {
    id: 'prod-rolex-daytona',
    name: 'Cosmograph Daytona Oyster',
    brand: 'Rolex',
    category: 'watches',
    price: 1450000,
    description: 'The ultimate tool watch for those with a passion for driving and high performance in 18 ct Everose gold.',
    specs: {
      'Calibre': '4131 Manufacture Perpetual',
      'Material': '18 ct Everose Gold & Ceramic',
      'Power Reserve': '72 Hours',
      'Waterproof': '100 Metres / 330 Feet'
    },
    modelType: 'luxury_watch',
  },
  // Vehicles - Bikes
  {
    id: 'prod-royal-enfield',
    name: 'Classic 350 Stealth Black',
    brand: 'Royal Enfield',
    category: 'bikes',
    price: 210000,
    description: 'Timeless cruiser aesthetics reimagined with refined J-series counterbalanced engine and dual-channel ABS.',
    specs: {
      'Engine': '349cc Single Cylinder J-Platform',
      'Power': '20.2 bhp @ 6100 rpm',
      'Torque': '27 Nm @ 4000 rpm',
      'Brakes': '300mm Front Disc Dual ABS'
    },
    modelType: 'bike',
    featured: true,
  },
  // Vehicles - Sports Cars
  {
    id: 'prod-bmw-m4',
    name: 'BMW M4 Competition Coupe',
    brand: 'BMW M Power',
    category: 'cars',
    price: 15300000,
    description: 'High-performance icon featuring twin-turbo inline 6-cylinder engine with 510 hp and M xDrive.',
    specs: {
      'Engine': '3.0L M TwinPower Turbo S58',
      '0-100 km/h': '3.5 seconds',
      'Power': '510 hp @ 6250 rpm',
      'Drivetrain': 'M xDrive AWD with 2WD mode'
    },
    modelType: 'car',
    featured: true,
  },
  // Vehicles - Supercars
  {
    id: 'prod-hypercar',
    name: 'Apex Spectre EV Hypercar',
    brand: 'Spectre Automotive',
    category: 'supercars',
    price: 32000000,
    description: 'Carbon-monocoque quad-motor electric track weapon pushing 1900 horsepower with active aero surfaces.',
    specs: {
      'Motors': 'Quad Permanent Magnet Synch',
      '0-100 km/h': '1.85 seconds',
      'Top Speed': '412 km/h',
      'Downforce': '1200kg @ 300 km/h'
    },
    modelType: 'supercar',
  },
  // Real Estate - 3 BHK Apartment
  {
    id: 'prod-penthouse-apartment',
    name: 'Skyline Residence 3 BHK',
    brand: 'CyberTower Highrises',
    category: 'apartments',
    price: 12000000,
    description: 'Luxury high-rise apartment with 270° panoramic city glass facade, private elevator, and smart domotics.',
    specs: {
      'Area': '2,450 sq.ft Super Built-up',
      'Floor': '42nd Sky Level',
      'Balcony': 'Wrap-around Glass Deck',
      'Amenities': 'Infinity Sky Pool, Concierge'
    },
    modelType: 'apartment',
    featured: true,
  },
  // Real Estate - Villa
  {
    id: 'prod-modern-villa',
    name: 'Azure Coast Architectural Villa',
    brand: 'Horizon Estates',
    category: 'villas',
    price: 55000000,
    description: 'Modernist cantilivered concrete & glass cliffside villa with infinity ocean deck and 6-car subterranean showroom.',
    specs: {
      'Plot Size': '14,000 sq.ft Land',
      'Living Area': '7,200 sq.ft 5 Suites',
      'Garage': '6-Car Vault Showroom',
      'Energy': 'Zero-Carbon Solar Array'
    },
    modelType: 'villa',
  }
];

export const categoryMeta = [
  { id: 'phones', name: 'Phones', icon: 'Smartphone', count: 4 },
  { id: 'laptops', name: 'Laptops', icon: 'Laptop', count: 3 },
  { id: 'audio', name: 'Audio', icon: 'Headphones', count: 5 },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', count: 4 },
  { id: 'watches', name: 'Watches', icon: 'Watch', count: 6 },
  { id: 'fashion', name: 'Fashion', icon: 'Sparkles', count: 5 },
  { id: 'bikes', name: 'Bikes', icon: 'Bike', count: 4 },
  { id: 'cars', name: 'Cars', icon: 'Car', count: 5 },
  { id: 'supercars', name: 'Supercars', icon: 'Flame', count: 3 },
  { id: 'apartments', name: 'Apartments', icon: 'Building2', count: 4 },
  { id: 'villas', name: 'Villas', icon: 'Home', count: 3 },
  { id: 'travel', name: 'Travel', icon: 'Plane', count: 6 },
];
