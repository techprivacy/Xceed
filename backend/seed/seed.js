require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const QuoteRequest = require('../models/QuoteRequest');

const run = async () => {
  await connectDB();

  console.log('Seeding database...');

  // ---- Admin user ----
  const adminUsername = process.env.ADMIN_USERNAME || 'ak';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ak@123';

  let admin = await User.findOne({ username: adminUsername });
  if (!admin) {
    admin = await User.create({
      username: adminUsername,
      email: process.env.ADMIN_EMAIL || 'admin@xceedindia.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Created admin user: ${admin.username}`);
  } else {
    console.log(`Admin user already exists: ${admin.username}`);
  }

  // ---- Categories ----
  const categoryDefs = [
    { name: 'Cast Letters', slug: 'cast-letters', order: 1 },
    { name: 'Cast Numbers', slug: 'cast-numbers', order: 2 },
    { name: 'Holders', slug: 'holders', order: 3 },
    { name: 'Magnetic Tool', slug: 'magnetic-tool', order: 4 },
    { name: 'Custom Marking', slug: 'custom-marking', order: 5 },
  ];

  const categories = {};
  for (const def of categoryDefs) {
    let cat = await Category.findOne({ slug: def.slug });
    if (!cat) cat = await Category.create(def);
    categories[def.slug] = cat;
  }
  console.log(`Categories ready: ${Object.keys(categories).length}`);

  // ---- Products ----
  const productDefs = [
    {
      name: '5 mm Cast Letter',
      slug: 'cast-letter-5mm',
      category: categories['cast-letters']._id,
      shortDescription: 'Precision cast steel letter, 5mm size',
      price: 95,
      priceUnit: 'per_letter',
      minOrderQty: 100,
      isBestSeller: true,
      isTrending: true,
      tags: ['cast letters', '5mm', 'alphabets'],
    },
    {
      name: '6 mm Cast Letter',
      slug: 'cast-letter-6mm',
      category: categories['cast-letters']._id,
      shortDescription: 'Precision cast steel letter, 6mm size',
      price: 100,
      priceUnit: 'per_letter',
      minOrderQty: 100,
      isTrending: true,
      tags: ['cast letters', '6mm'],
    },
    {
      name: '5 mm Cast Number',
      slug: 'cast-number-5mm',
      category: categories['cast-numbers']._id,
      shortDescription: 'Precision cast steel number, 5mm size',
      price: 95,
      priceUnit: 'per_letter',
      minOrderQty: 100,
      isTrending: true,
      tags: ['cast numbers', '5mm'],
    },
    {
      name: 'Standard Holders',
      slug: 'standard-holders',
      category: categories['holders']._id,
      shortDescription: 'Square & oval holders for secure marking',
      price: 3400,
      priceUnit: 'per_piece',
      minOrderQty: 2,
      isTrending: true,
      tags: ['holders', 'standard'],
    },
    {
      name: 'Adhesive Type Holders',
      slug: 'adhesive-type-holders',
      category: categories['holders']._id,
      shortDescription: 'Strong adhesive base for easy mounting',
      price: 3400,
      priceUnit: 'per_piece',
      minOrderQty: 2,
      tags: ['holders', 'adhesive'],
    },
    {
      name: 'Magnetic Tool',
      slug: 'magnetic-tool-standard',
      category: categories['magnetic-tool']._id,
      shortDescription: 'Strong magnetic grip for accurate marking',
      price: 2500,
      priceUnit: 'per_piece',
      minOrderQty: 1,
      isTrending: true,
      tags: ['magnetic', 'tools'],
    },
    {
      name: 'Custom Marking Solution',
      slug: 'custom-marking-solution',
      category: categories['custom-marking']._id,
      shortDescription: 'Bespoke marking tools built to specification',
      price: 5000,
      priceUnit: 'per_piece',
      minOrderQty: 1,
      tags: ['custom', 'marking'],
    },
  ];

  for (const def of productDefs) {
    const exists = await Product.findOne({ slug: def.slug });
    if (!exists) await Product.create(def);
  }
  console.log(`Products ready: ${productDefs.length}`);

  // ---- Sample bulk quote requests (for CRM demo data) ----
  const quoteDefs = [
    {
      companyName: 'Bharat Steel Fabricators',
      gstNumber: '27AAECB1234F1Z5',
      industry: 'Steel Plants',
      contactPerson: 'Rajesh Mehta',
      email: 'rajesh@bharatsteel.example.com',
      mobileNumber: '+91 98200 11223',
      city: 'Pune',
      state: 'Maharashtra',
      productRequirement: '6mm Cast Letters, Detachable Jigs',
      quantity: '2000 letters, 10 jigs',
      specialRequirement: 'Need concave marking for curved steel sheets',
      status: 'follow_up',
    },
    {
      companyName: 'Anand Auto Components',
      gstNumber: '24AATCA5678G1Z2',
      industry: 'Automotive',
      contactPerson: 'Priya Shah',
      email: 'priya@anandauto.example.com',
      mobileNumber: '+91 99250 44556',
      city: 'Ahmedabad',
      state: 'Gujarat',
      productRequirement: 'Screw Type Holders, 5mm Cast Numbers',
      quantity: '500 letters, 25 holders',
      status: 'new',
    },
    {
      companyName: 'Konkan Foundries Pvt Ltd',
      gstNumber: '27AAFCK9012H1Z8',
      industry: 'Foundries',
      contactPerson: 'Suresh Naik',
      email: 'suresh@konkanfoundries.example.com',
      mobileNumber: '+91 90210 77889',
      city: 'Kolhapur',
      state: 'Maharashtra',
      productRequirement: 'Powerful Detachable Jigs, Magnetic Tools',
      quantity: '5 jigs, 8 magnetic tools',
      status: 'quotation_sent',
    },
  ];

  for (const def of quoteDefs) {
    const exists = await QuoteRequest.findOne({ companyName: def.companyName });
    if (!exists) await QuoteRequest.create(def);
  }
  console.log(`Sample quote requests ready: ${quoteDefs.length}`);

  console.log('Seeding complete.');
  console.log(`Login with -> username: ${adminUsername} / password: ${adminPassword}`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
