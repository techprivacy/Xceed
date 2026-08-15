import { redirect } from 'next/navigation';

// Superseded by /directory (nav item renamed "Membership" -> "Directory").
// /membership/register (the "Apply for Membership" flow) is untouched and
// keeps living at its own path — this only forwards the old listing page.
export default function MembershipPage() {
  redirect('/directory');
}
