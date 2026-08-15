'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ToastHost from '@/components/admin/ToastHost';
import { getAdminToken } from '@/lib/api';
import { useCurrentAdmin } from '@/lib/useCurrentAdmin';
import { useAdminNotifications } from '@/lib/useAdminNotifications';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
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
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
      <ToastHost />
    </div>
  );
}
