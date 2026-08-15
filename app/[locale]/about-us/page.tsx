import { redirect } from 'next/navigation';

// /about-us has no page of its own anymore — the header's "About Us" nav
// item is dropdown-only now (Director Message / Our Global Team / News &
// Awards), so this covers direct hits on the old URL (bookmarks, external
// links, search results) by forwarding to where that content actually lives.
export default function AboutUsPage() {
  redirect('/about-us/director-message');
}
