const express = require('express');
const router = express.Router();
const {
  createSavedCart,
  getSavedCarts,
  updateSavedCart,
  deleteSavedCart,
} = require('../controllers/savedCartController');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/', createSavedCart);
router.get('/', protect, adminOnly, getSavedCarts);
router.put('/:id', protect, adminOnly, updateSavedCart);
router.delete('/:id', protect, adminOnly, deleteSavedCart);

module.exports = router;
