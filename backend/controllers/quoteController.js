const QuoteRequest = require('../models/QuoteRequest');
const { createQuotePdfDoc } = require('../utils/quotePdf');
const { getTransporter, isConfigured } = require('../config/mailer');

// @route POST /api/quotes  (public - from "Submit Request" form)
exports.createQuoteRequest = async (req, res) => {
  try {
    const {
      companyName,
      mobileNumber,
      whatsappNumber,
      productRequirement,
      quantity,
      city,
      state,
      officeAddress,
      industry,
      specialRequirement,
      contactPerson,
      email,
      source,
    } = req.body;

    if (!companyName || !mobileNumber || !productRequirement) {
      return res.status(400).json({
        success: false,
        message: 'Company name, mobile number and product requirement are required',
      });
    }

    const quote = await QuoteRequest.create({
      companyName,
      mobileNumber,
      whatsappNumber,
      productRequirement,
      quantity,
      city,
      state,
      officeAddress,
      industry,
      specialRequirement,
      contactPerson,
      email,
      source: source || 'website',
    });

    res.status(201).json({ success: true, message: 'Request submitted successfully', data: quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route GET /api/quotes (admin)
exports.getQuoteRequests = async (req, res) => {
  try {
    const { status, industry, productRequirement, source, salesExecutive, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (industry) filter.industry = industry;
    if (productRequirement) filter.productRequirement = productRequirement;
    if (source) filter.source = source;
    if (salesExecutive) filter.salesExecutive = salesExecutive;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [quotes, total] = await Promise.all([
      QuoteRequest.find(filter)
        .populate('salesExecutive', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      QuoteRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: quotes.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: quotes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/quotes/:id (admin)
exports.getQuoteRequestById = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id)
      .populate('salesExecutive', 'username email')
      .populate('internalNotes.addedBy', 'username');
    if (!quote) return res.status(404).json({ success: false, message: 'Quote request not found' });
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/quotes/:id (admin)
exports.updateQuoteRequest = async (req, res) => {
  try {
    const { internalNotes, ...updates } = req.body;
    const quote = await QuoteRequest.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('salesExecutive', 'username email');
    if (!quote) return res.status(404).json({ success: false, message: 'Quote request not found' });
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/quotes/:id (admin)
exports.deleteQuoteRequest = async (req, res) => {
  try {
    const quote = await QuoteRequest.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote request not found' });
    res.json({ success: true, message: 'Quote request deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route POST /api/quotes/:id/notes (admin)
exports.addInternalNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote request not found' });

    quote.internalNotes.push({ text: text.trim(), addedBy: req.user._id });
    await quote.save();
    await quote.populate('internalNotes.addedBy', 'username');

    res.status(201).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route POST /api/quotes/upload (admin) - drawing/attachment upload
exports.uploadDrawing = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.status(201).json({
    success: true,
    data: { url: `/uploads/drawings/${req.file.filename}`, originalName: req.file.originalname },
  });
};

// @route GET /api/quotes/:id/pdf (admin) - download professional quotation PDF
exports.downloadQuotePdf = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote request not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="XCEED-Quote-${quote._id}.pdf"`
    );

    const doc = createQuotePdfDoc(quote);
    doc.pipe(res);
    doc.end();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route POST /api/quotes/:id/email (admin) - email the quotation PDF to the customer
exports.emailQuotePdf = async (req, res) => {
  try {
    if (!isConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Email is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in the backend .env file.',
      });
    }

    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote request not found' });
    if (!quote.email) {
      return res.status(400).json({ success: false, message: 'This quote has no customer email on file' });
    }

    const doc = createQuotePdfDoc(quote);
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', async () => {
      try {
        const transporter = getTransporter();
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: quote.email,
          subject: `XCEED India — Your Bulk Quote (Ref: ${quote._id})`,
          text: `Dear ${quote.contactPerson || quote.companyName},\n\nPlease find attached your quotation from XCEED India.\n\nRegards,\nXCEED India Sales Team`,
          attachments: [
            { filename: `XCEED-Quote-${quote._id}.pdf`, content: Buffer.concat(chunks) },
          ],
        });
        res.json({ success: true, message: `Quotation emailed to ${quote.email}` });
      } catch (mailErr) {
        res.status(500).json({ success: false, message: mailErr.message });
      }
    });
    doc.end();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
