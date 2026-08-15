import { redirect } from 'next/navigation';

// Superseded by the unified /login page — members and admins/staff now
// share one sign-in form (see app/[locale]/login/page.tsx). This just
// forwards old bookmarks/links so they still land somewhere real.
export default function MemberLoginPage() {
  redirect('/login');
}
