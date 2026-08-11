import MemberDirectory from '@/components/MemberDirectory';

// Same public GET /api/members/directory endpoint and field set as the
// public /membership page — logged-in members don't see anything beyond
// what a visitor sees (no member emails are exposed to other members either,
// see backend/src/controllers/memberController.js getPublicDirectory).
export default function MemberPortalDirectoryPage() {
  return <MemberDirectory />;
}
