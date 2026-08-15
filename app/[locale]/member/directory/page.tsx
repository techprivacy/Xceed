import MemberDirectory from '@/components/MemberDirectory';

// Same public GET /api/membership-applications/directory endpoint and field
// set as the public /membership page — logged-in members don't see anything
// beyond what a visitor sees (no account emails are exposed to other members
// either, see backend/src/controllers/membershipController.js
// getPublicDirectory).
export default function MemberPortalDirectoryPage() {
  return <MemberDirectory />;
}
