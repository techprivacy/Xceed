import LegalPageLayout from '@/components/LegalPageLayout';

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="27 July 2026"
      intro="These Terms & Conditions govern your use of the XCEED website and any products or services purchased through it. By accessing this website or placing an order with us, you agree to be bound by these terms."
      sections={[
        {
          heading: '1. Use of Website',
          body: (
            <p>
              This website and its content are provided for informational and business purposes. You agree
              to use this website only for lawful purposes and in a manner that does not infringe the
              rights of, or restrict or inhibit the use of, this website by any third party.
            </p>
          ),
        },
        {
          heading: '2. Products & Orders',
          body: (
            <p>
              All product descriptions, specifications, and pricing displayed on this website are subject
              to change without notice. Placing an order or enquiry does not guarantee availability, and all
              orders are subject to confirmation by our sales team.
            </p>
          ),
        },
        {
          heading: '3. Intellectual Property',
          body: (
            <p>
              All content on this website, including text, graphics, logos, and images, is the property of
              XCEED and is protected by applicable intellectual property laws. It may not be
              reproduced without our prior written consent.
            </p>
          ),
        },
        {
          heading: '4. Limitation of Liability',
          body: (
            <p>
              XCEED shall not be liable for any indirect, incidental, or consequential damages arising
              from the use of this website or the products purchased through it, to the fullest extent
              permitted by law.
            </p>
          ),
        },
        {
          heading: '5. Governing Law',
          body: (
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, and any
              disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          ),
        },
        {
          heading: '6. Changes to These Terms',
          body: (
            <p>
              We reserve the right to update these Terms & Conditions at any time. Continued use of the
              website after changes are posted constitutes acceptance of the revised terms.
            </p>
          ),
        },
        {
          heading: '7. Contact Us',
          body: (
            <p>
              For any questions regarding these Terms & Conditions, please contact us at{' '}
              <a href="mailto:info@xceedindia.com" className="font-medium text-brand-red hover:underline">
                info@xceedindia.com
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
