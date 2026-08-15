'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MemberSidebar from '@/components/member/MemberSidebar';
import ToastHost from '@/components/admin/ToastHost';
import { getAccountToken } from '@/lib/api';

// Mirrors app/admin/layout.tsx's guard exactly, but against the separate
// xceed_account_token — an account session can't satisfy this check with an
// admin token or vice versa (see backend/src/middlewares/accountAuth.js for
// why that's true on the API side too, not just here). This portal is now
// gated by Account (self-service signup), not the old Member login —
// "membership" is a status the dashboard/profile pages fetch separately
// (see MembershipApplication), not what grants access to this area at all.
// Public entry points into the member area — none of these need (or should
// wait on) a session check, unlike /member/dashboard, /member/profile, etc.
// /member/login itself is just a redirect stub now (see its page.tsx) but
// stays listed defensively in case it ever renders as a child of this
// layout before that redirect fires.
const PUBLIC_MEMBER_PAGES = ['/member/login', '/member/forgot-password', '/member/register'];

export default function MemberPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isPublicPage = PUBLIC_MEMBER_PAGES.includes(pathname);

  useEffect(() => {
    if (isPublicPage) return;
    if (!getAccountToken()) {
      // Straight to the unified login, not /member/login (which would just
      // redirect here again) — one hop instead of two.
      router.replace('/login');
      return;
    }
    setChecked(true);
  }, [isPublicPage, router]);

  if (isPublicPage)
    return (
      <>
        {children}
        <ToastHost />
      </>
    );

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-mist text-sm text-brand-slate">
        Checking session...
      </div>
    );
  }

  return (
    // Column below lg so MemberSidebar's mobile top bar sits above the
    // content instead of squeezing beside it; row from lg up, where the
    // sidebar goes back to being a static fixed-width column.
    <div className="flex min-h-screen flex-col bg-brand-mist lg:flex-row">
      <MemberSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
      <ToastHost />
    </div>
  );
}
