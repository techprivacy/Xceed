import { redirect } from 'next/navigation';

// There's no dedicated /admin landing page — every admin route lives one
// level deeper (/admin/dashboard, /admin/products, etc.), so a bare
// /admin hit (a very natural URL to type) 404'd. This forwards it
// straight to the dashboard, same redirect-stub pattern used for
// /admin/login, /membership, and /about-us/director-message elsewhere in
// this codebase.
export default function AdminIndexPage() {
  redirect('/admin/dashboard');
}
