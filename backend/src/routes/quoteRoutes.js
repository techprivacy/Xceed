const express = require('express');
const router = express.Router();
const {
  createQuoteRequest,
  getQuoteRequests,
  getQuoteRequestById,
  updateQuoteRequest,
  deleteQuoteRequest,
  addInternalNote,
  uploadDrawing,
  downloadQuotePdf,
  emailQuotePdf,
} = require('../controllers/quoteController');
const { protect, adminOnly } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/', createQuoteRequest);
router.get('/', protect, adminOnly, getQuoteRequests);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadDrawing);
router.get('/:id', protect, adminOnly, getQuoteRequestById);
router.put('/:id', protect, adminOnly, updateQuoteRequest);
router.delete('/:id', protect, adminOnly, deleteQuoteRequest);
router.post('/:id/notes', protect, adminOnly, addInternalNote);
router.get('/:id/pdf', protect, adminOnly, downloadQuotePdf);
router.post('/:id/email', protect, adminOnly, emailQuotePdf);

module.exports = router;
