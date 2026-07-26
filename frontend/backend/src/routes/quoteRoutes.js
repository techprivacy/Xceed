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
  uploadCompanyLogo,
  downloadQuotePdf,
  emailQuotePdf,
} = require('../controllers/quoteController');
const { protect, adminOnly } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const uploadLogo = require('../middlewares/uploadLogo');

router.post('/', createQuoteRequest);
router.post('/upload-logo', uploadLogo.single('file'), uploadCompanyLogo);
router.get('/', protect, adminOnly, getQuoteRequests);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadDrawing);
router.get('/:id', protect, adminOnly, getQuoteRequestById);
router.put('/:id', protect, adminOnly, updateQuoteRequest);
router.delete('/:id', protect, adminOnly, deleteQuoteRequest);
router.post('/:id/notes', protect, adminOnly, addInternalNote);
router.get('/:id/pdf', protect, adminOnly, downloadQuotePdf);
router.post('/:id/email', protect, adminOnly, emailQuotePdf);

module.exports = router;
