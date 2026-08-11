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
const { protect } = require('../middlewares/auth');
const { requirePermission } = require('../middlewares/permissions');
const uploadImages = require('../middlewares/uploadImages');

const canManageProducts = requirePermission('products');

router.get('/', getProducts);
router.get('/id/:id', protect, canManageProducts, getProductById);
router.post('/upload', protect, canManageProducts, uploadImages.array('images', 6), uploadProductImages);
router.get('/:slug', getProductBySlug);
router.post('/', protect, canManageProducts, createProduct);
router.put('/:id', protect, canManageProducts, updateProduct);
router.delete('/:id', protect, canManageProducts, deleteProduct);

module.exports = router;
