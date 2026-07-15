const PDFDocument = require('pdfkit');

// Builds the quotation PDF document. Caller is responsible for piping/consuming
// the stream and calling doc.end() once a destination is attached.
function createQuotePdfDoc(quote) {
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(20).fillColor('#0F4AA6').font('Helvetica-Bold').text('XCEED India');
  doc.fontSize(10).fillColor('#666666').font('Helvetica').text('Precision Marking Solutions');
  doc.moveDown(1.5);

  doc.fontSize(16).fillColor('#071C3A').font('Helvetica-Bold').text('Bulk Quote Request');
  doc.fontSize(9).fillColor('#666666').font('Helvetica');
  doc.text(`Quote Ref: ${quote._id}`);
  doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString('en-IN')}`);
  doc.moveDown(1);

  const row = (label, value) => {
    if (!value) return;
    doc
      .fontSize(10)
      .fillColor('#111111')
      .font('Helvetica-Bold')
      .text(`${label}: `, { continued: true });
    doc.font('Helvetica').text(String(value));
  };

  doc.fontSize(12).fillColor('#0F4AA6').font('Helvetica-Bold').text('Customer Details');
  doc.moveDown(0.3);
  row('Company', quote.companyName);
  row('Contact Person', quote.contactPerson);
  row('GST Number', quote.gstNumber);
  row('Email', quote.email);
  row('Phone', quote.mobileNumber);
  row('City', quote.city);
  row('State', quote.state);
  row('Industry', quote.industry);

  doc.moveDown(1);
  doc.fontSize(12).fillColor('#0F4AA6').font('Helvetica-Bold').text('Requirement');
  doc.moveDown(0.3);
  row('Products', quote.productRequirement);
  row('Quantity', quote.quantity);
  row('Special Requirement', quote.specialRequirement);

  doc.moveDown(1.5);
  doc
    .fontSize(9)
    .fillColor('#999999')
    .font('Helvetica')
    .text('This is a system-generated quotation summary from XCEED India.');
  doc.text('Contact: +91 99096 11333 | sales@xceedonetouch.com');

  return doc;
}

module.exports = { createQuotePdfDoc };
