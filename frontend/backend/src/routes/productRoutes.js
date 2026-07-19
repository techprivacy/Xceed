const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/auth');
const uploadImages = require('../middlewares/uploadImages');
const { generateProductDescription } = require('../controllers/aiController');

router.get('/', getProducts);
router.get('/id/:id', protect, adminOnly, getProductById);
router.post('/upload', protect, adminOnly, uploadImages.array('images', 6), uploadProductImages);
router.post('/ai/description', protect, adminOnly, generateProductDescription);
router.get('/:slug', getProductBySlug);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
