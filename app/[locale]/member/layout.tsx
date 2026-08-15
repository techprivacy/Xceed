'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MemberSidebar from '@/components/member/MemberSidebar';
import ToastHost from '@/components/admin/ToastHost';
import { getMemberToken } from '@/lib/api';

// Mirrors app/admin/layout.tsx's guard exactly, but against the separate
// xceed_member_token — a member session can't satisfy this check with an
// admin token or vice versa (see backend/src/middlewares/memberAuth.js for
// why that's true on the API side too, not just here).
// Public entry points into the member area — none of these need (or should
// wait on) a session check, unlike /member/dashboard, /member/profile, etc.
const PUBLIC_MEMBER_PAGES = ['/member/login', '/member/forgot-password', '/member/register'];

export default function MemberPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isPublicPage = PUBLIC_MEMBER_PAGES.includes(pathname);

  useEffect(() => {
    if (isPublicPage) return;
    if (!getMemberToken()) {
      router.replace('/member/login');
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
