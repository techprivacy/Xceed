'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import ToastHost from '@/components/admin/ToastHost';
import { getAdminToken } from '@/lib/api';
import { useCurrentAdmin } from '@/lib/useCurrentAdmin';
import { useAdminNotifications } from '@/lib/useAdminNotifications';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // /admin/login is just a redirect stub now (see its page.tsx, which
  // forwards to the unified /login) but stays checked defensively in case
  // it ever renders as a child of this layout before that redirect fires.
  const isLoginPage = pathname === '/admin/login';
  const { admin } = useCurrentAdmin();
  useAdminNotifications(admin?.role);

  useEffect(() => {
    if (isLoginPage) return;
    if (!getAdminToken()) {
      // Straight to the unified login, not /admin/login (which would just
      // redirect here again) — one hop instead of two.
      router.replace('/login');
      return;
    }
    setChecked(true);
  }, [isLoginPage, router]);

  // A route change is the clearest signal the mobile drawer should close —
  // covers both clicking a nav link and using browser back/forward.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (isLoginPage)
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
    <div className="flex min-h-screen bg-brand-mist">
      <AdminSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <AdminTopbar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="flex-1">{children}</div>
      </div>
      <ToastHost />
    </div>
  );
}
