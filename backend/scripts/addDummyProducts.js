require('dotenv').config();
const connectDB = require('../src/config/db');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

const IMAGES = {
  'cast-letters': 'https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=400&h=300&fit=crop',
  'cast-numbers': 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=400&h=300&fit=crop',
  holders: 'https://images.unsplash.com/photo-1621235218811-306917c960f7?w=400&h=300&fit=crop',
  'magnetic-tool': 'https://images.unsplash.com/photo-1611288870280-4a322b8ec7ec?w=400&h=300&fit=crop',
};

const CATEGORY_PRODUCTS = {
  'cast-letters': [
    { name: '5 mm Cast Letter - Concave', price: 95, priceUnit: 'per_letter' },
    { name: '5 mm Cast Letter - Convex', price: 95, priceUnit: 'per_letter' },
    { name: '6 mm Cast Letter - Concave', price: 110, priceUnit: 'per_letter' },
    { name: '6 mm Cast Letter - Convex', price: 110, priceUnit: 'per_letter' },
    { name: '8 mm Cast Letter', price: 135, priceUnit: 'per_letter' },
    { name: '10 mm Cast Letter', price: 165, priceUnit: 'per_letter' },
    { name: '12 mm Cast Letter', price: 195, priceUnit: 'per_letter' },
    { name: '15 mm Cast Letter', price: 230, priceUnit: 'per_letter' },
    { name: '20 mm Cast Letter', price: 280, priceUnit: 'per_letter' },
    { name: '25 mm Cast Letter', price: 340, priceUnit: 'per_letter' },
  ],
  'cast-numbers': [
    { name: '5 mm Cast Number', price: 95, priceUnit: 'per_letter' },
    { name: '6 mm Cast Number', price: 110, priceUnit: 'per_letter' },
    { name: '8 mm Cast Number', price: 135, priceUnit: 'per_letter' },
    { name: '10 mm Cast Number', price: 165, priceUnit: 'per_letter' },
    { name: '12 mm Cast Number', price: 195, priceUnit: 'per_letter' },
    { name: '15 mm Cast Number', price: 230, priceUnit: 'per_letter' },
    { name: '20 mm Cast Number', price: 280, priceUnit: 'per_letter' },
    { name: '25 mm Cast Number', price: 340, priceUnit: 'per_letter' },
    { name: '30 mm Cast Number', price: 400, priceUnit: 'per_letter' },
    { name: '40 mm Cast Number', price: 480, priceUnit: 'per_letter' },
  ],
  holders: [
    { name: 'Standard Square Holder', price: 3400, priceUnit: 'per_piece' },
    { name: 'Standard Oval Holder', price: 3400, priceUnit: 'per_piece' },
    { name: 'Adhesive Type Holder', price: 3400, priceUnit: 'per_piece' },
    { name: 'Screw Type Holder', price: 3500, priceUnit: 'per_piece' },
    { name: 'Heavy Duty Holder', price: 4200, priceUnit: 'per_piece' },
    { name: 'Mini Holder', price: 2800, priceUnit: 'per_piece' },
    { name: 'Double Row Holder', price: 5200, priceUnit: 'per_piece' },
    { name: 'Triple Row Holder', price: 6400, priceUnit: 'per_piece' },
    { name: 'Corner Mount Holder', price: 3900, priceUnit: 'per_piece' },
    { name: 'Flush Mount Holder', price: 3600, priceUnit: 'per_piece' },
  ],
  'magnetic-tool': [
    { name: 'Standard Magnetic Marking Tool', price: 2500, priceUnit: 'per_piece' },
    { name: 'Heavy Duty Magnetic Tool', price: 3800, priceUnit: 'per_piece' },
    { name: 'Compact Magnetic Holder', price: 2100, priceUnit: 'per_piece' },
    { name: 'Adjustable Magnetic Jig', price: 4500, priceUnit: 'per_piece' },
    { name: 'Detachable Magnetic Tool', price: 7000, priceUnit: 'per_piece' },
    { name: 'Powerful Detachable Jig', price: 8000, priceUnit: 'per_piece' },
    { name: 'Dual Magnet Marking Tool', price: 5200, priceUnit: 'per_piece' },
    { name: 'Mini Magnetic Clamp', price: 1800, priceUnit: 'per_piece' },
    { name: 'Industrial Magnetic Base', price: 6100, priceUnit: 'per_piece' },
    { name: 'Precision Magnetic Fixture', price: 5600, priceUnit: 'per_piece' },
  ],
};

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const run = async () => {
  await connectDB();
  console.log('Adding dummy products...');

  for (const [categorySlug, items] of Object.entries(CATEGORY_PRODUCTS)) {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      console.log(`Category not found, skipping: ${categorySlug}`);
      continue;
    }

    for (const item of items) {
      const slug = slugify(item.name);
      const exists = await Product.findOne({ slug });
      if (exists) {
        console.log(`Already exists, skipping: ${item.name}`);
        continue;
      }

      await Product.create({
        name: item.name,
        slug,
        category: category._id,
        shortDescription: `Precision ${category.name.toLowerCase()} built to Japanese quality standards.`,
        description: `The ${item.name} is manufactured to Japanese quality standards for accuracy, durability and consistent industrial marking performance.`,
        images: [IMAGES[categorySlug]],
        price: item.price,
        priceUnit: item.priceUnit,
        currency: 'INR',
        minOrderQty: 1,
        inStock: true,
      });
      console.log(`Created: ${item.name} (${categorySlug})`);
    }
  }

  console.log('\nDone.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
