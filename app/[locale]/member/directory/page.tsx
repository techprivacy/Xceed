import type { Metadata } from 'next';
import MemberDirectory from '@/components/MemberDirectory';
import { absoluteUrl } from '@/lib/seo';

// Same public GET /api/membership-applications/directory endpoint and field
// set as the public /directory page — logged-in members don't see anything
// beyond what a visitor sees (no account emails are exposed to other members
// either, see backend/src/controllers/membershipController.js
// getPublicDirectory). Byte-identical content to /directory, kept as a
// portal-internal convenience link (see MemberSidebar) — canonicalized to
// /directory so it isn't indexed as separate duplicate content.
export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/directory') },
};

export default function MemberPortalDirectoryPage() {
  return <MemberDirectory />;
}
