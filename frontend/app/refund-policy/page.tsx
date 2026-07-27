import LegalPageLayout from '@/components/LegalPageLayout';

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="27 July 2026"
      intro="At XCEED India, we strive to ensure our customers are satisfied with every purchase. This Refund Policy outlines the terms under which refunds, replacements, or cancellations may be considered."
      sections={[
        {
          heading: '1. Eligibility for Refunds',
          body: (
            <p>
              Refund requests are considered for products found to be defective, damaged in transit, or
              incorrectly shipped. Requests must be raised within 7 days of delivery along with photographic
              evidence and the order reference number.
            </p>
          ),
        },
        {
          heading: '2. Non-Refundable Items',
          body: (
            <p>
              Custom-made or made-to-order products, and items that have been used or altered after
              delivery, are not eligible for refund or return unless found defective on arrival.
            </p>
          ),
        },
        {
          heading: '3. Refund Process',
          body: (
            <p>
              Once a refund request is approved, our team will coordinate the return of the product where
              applicable. Approved refunds are processed to the original mode of payment within 7-10
              business days.
            </p>
          ),
        },
        {
          heading: '4. Order Cancellations',
          body: (
            <p>
              Orders may be cancelled before they are dispatched by contacting our support team. Once an
              order has been shipped, it can no longer be cancelled and will instead be subject to our
              return process.
            </p>
          ),
        },
        {
          heading: '5. How to Request a Refund',
          body: (
            <p>
              To initiate a refund, replacement, or cancellation request, please contact us with your order
              details via our Contact Us page or the details below.
            </p>
          ),
        },
        {
          heading: '6. Contact Us',
          body: (
            <p>
              For refund or cancellation queries, please reach out to us at{' '}
              <a href="mailto:info@xceedindia.com" className="font-medium text-brand-red hover:underline">
                info@xceedindia.com
              </a>{' '}
              or call{' '}
              <a href="tel:+919909611333" className="font-medium text-brand-red hover:underline">
                +91 99096 11333
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
