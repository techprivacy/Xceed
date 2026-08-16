import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    "XCEED's Privacy Policy: what personal information we collect, how we use it, and the choices you have regarding your data.",
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="27 July 2026"
      intro="XCEED ('we', 'us', 'our') respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data."
      sections={[
        {
          heading: '1. Information We Collect',
          body: (
            <p>
              We may collect personal information such as your name, company name, email address, phone
              number, and business details when you fill out an enquiry form, request a quote, register
              for membership, or otherwise interact with our website.
            </p>
          ),
        },
        {
          heading: '2. How We Use Your Information',
          body: (
            <p>
              We use the information we collect to respond to enquiries, process orders and quotations,
              manage memberships, improve our products and services, and communicate updates that may be
              relevant to you.
            </p>
          ),
        },
        {
          heading: '3. Sharing of Information',
          body: (
            <p>
              We do not sell or rent your personal information to third parties. We may share information
              with trusted service providers who help us operate our business, or when required to do so
              by law.
            </p>
          ),
        },
        {
          heading: '4. Data Security',
          body: (
            <p>
              We take reasonable technical and organisational measures to protect your personal information
              from unauthorised access, alteration, disclosure, or destruction.
            </p>
          ),
        },
        {
          heading: '5. Your Rights',
          body: (
            <p>
              You may request access to, correction of, or deletion of your personal information at any
              time by contacting us using the details on our Contact Us page.
            </p>
          ),
        },
        {
          heading: '6. Changes to This Policy',
          body: (
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page
              with a revised "Last updated" date.
            </p>
          ),
        },
        {
          heading: '7. Contact Us',
          body: (
            <p>
              If you have any questions about this Privacy Policy, please reach out to us at{' '}
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
