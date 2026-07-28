require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const QuoteRequest = require('../src/models/QuoteRequest');
const Member = require('../src/models/Member');

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
   
  ];

  const categories = {};
  for (const def of categoryDefs) {
    let cat = await Category.findOne({ slug: def.slug });
    if (!cat) cat = await Category.create(def);
    categories[def.slug] = cat;
  }
  console.log(`Categories ready: ${Object.keys(categories).length}`);

  // ---- Products ----
  // Pricing reference: XCD INDIA (S) series
  const SIZE_PRICING = [
    { size: '5mm', price: 95 },
    { size: '6mm', price: 100 },
    { size: '7mm', price: 105 },
    { size: '8mm', price: 115 },
  ];
  const HOLDER_PRICE_MATRIX = {
    '5mm': { GLUE: { 1: 3900, 2: 4800, 3: 5200, 4: 5700 }, SCREW: { 1: 4000, 2: 5000, 3: 5300, 4: 5700 } },
    '6mm': { GLUE: { 1: 3950, 2: 4900, 3: 5350, 4: 5750 }, SCREW: { 1: 4050, 2: 5100, 3: 5500, 4: 5850 } },
    '7mm': { GLUE: { 1: 4000, 2: 5100, 3: 5400, 4: 5850 }, SCREW: { 1: 4050, 2: 5200, 3: 5600, 4: 5900 } },
    '8mm': { GLUE: { 1: 4050, 2: 5120, 3: 5420, 4: 5780 }, SCREW: { 1: 4100, 2: 5300, 3: 5600, 4: 5960 } },
  };

  const productDefs = [
    {
      name: 'Cast Letters',
      slug: 'cast-letters-configurator',
      category: categories['cast-letters']._id,
      shortDescription: 'Precision cast steel letters — build your own set',
      price: 95,
      priceUnit: 'per_letter',
      minOrderQty: 100,
      isBestSeller: true,
      isTrending: true,
      tags: ['cast letters', 'alphabets'],
      configuratorType: 'cast_letters',
      sizePricing: SIZE_PRICING,
    },
    {
      name: 'Cast Numbers',
      slug: 'cast-numbers-configurator',
      category: categories['cast-numbers']._id,
      shortDescription: 'Precision cast steel numbers — build your own set',
      price: 95,
      priceUnit: 'per_letter',
      minOrderQty: 100,
      isTrending: true,
      tags: ['cast numbers'],
      configuratorType: 'cast_numbers',
      sizePricing: SIZE_PRICING,
    },
    {
      name: 'Holders',
      slug: 'holders-configurator',
      category: categories['holders']._id,
      shortDescription: 'Square & oval holders for secure marking — build your own',
      price: 3900,
      priceUnit: 'per_piece',
      minOrderQty: 1,
      isTrending: true,
      tags: ['holders'],
      configuratorType: 'holder',
      sizePricing: SIZE_PRICING,
      holderPriceMatrix: HOLDER_PRICE_MATRIX,
    },
    {
      name: 'Magnetic Tool',
      slug: 'magnetic-tool-standard',
      category: categories['magnetic-tool']._id,
      shortDescription: 'Strong magnetic grip for accurate marking',
      price: 8500,
      priceUnit: 'per_piece',
      minOrderQty: 1,
      isTrending: true,
      tags: ['magnetic', 'tools'],
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

  // ---- Sample members (directory + member-portal demo data) ----
  const memberDemoPassword = 'member@123';
  const memberDefs = [
    {
      companyName: 'Anand Auto Components',
      contactPerson: 'Suresh Joshi',
      email: 'suresh@anandauto.example.com',
      industry: 'Automotive',
      products: 'Magnetic Tools',
      location: 'Chennai, India',
      status: 'approved',
      subscriptionStatus: 'active',
    },
    {
      companyName: 'Shakti Engineering Works',
      contactPerson: 'Anita Kulkarni',
      email: 'anita@shaktiengineering.example.com',
      industry: 'Machine Tools',
      products: 'Detachable Jigs',
      location: 'Coimbatore, India',
      status: 'approved',
      subscriptionStatus: 'active',
    },
    {
      companyName: 'Vishwakarma Castings',
      contactPerson: 'Vikram Rao',
      email: 'vikram@vishwakarmacastings.example.com',
      industry: 'Sheet Metal',
      products: 'Custom Marking Solutions',
      location: 'Rajkot, India',
      status: 'pending',
      subscriptionStatus: 'none',
    },
  ];

  for (const def of memberDefs) {
    const exists = await Member.findOne({ email: def.email });
    if (!exists) await Member.create({ ...def, password: memberDemoPassword });
  }
  console.log(`Sample members ready: ${memberDefs.length}`);

  console.log('Seeding complete.');
  console.log(`Login with -> username: ${adminUsername} / password: ${adminPassword}`);
  console.log(
    `Approved demo member login -> email: ${memberDefs[0].email} / password: ${memberDemoPassword}`
  );
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
