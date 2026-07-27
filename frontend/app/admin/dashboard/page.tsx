'use client';

import { useEffect, useState } from 'react';
import { Package, Building2, UserCheck, Users, Plane } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import { getAdminToken, getProducts, getMemberStats, getQuoteRequests } from '@/lib/api';
import { useCurrentAdmin } from '@/lib/useCurrentAdmin';
import { can } from '@/lib/permissions';

// Total Revenue and Total Orders were requested but are intentionally not
// shown: there is no Order model or payment gateway anywhere in this codebase
// (checkout is client-side localStorage only, see lib/cart.ts), so either
// figure would have to be fabricated. Every tile below is a real count from
// the database as of page load.
export default function AdminDashboardPage() {
  const { admin } = useCurrentAdmin();
  const [products, setProducts] = useState<number | null>(null);
  const [memberStats, setMemberStats] = useState<{
    totalMembers: number;
    approvedMembers: number;
    pendingApprovals: number;
  } | null>(null);
  const [tokyoTourCount, setTokyoTourCount] = useState<number | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token || !admin) return;

    if (can(admin.role, 'products')) {
      getProducts({ limit: 1 })
        .then((res) => setProducts(res.total ?? 0))
        .catch(() => setProducts(0));
    }
    if (can(admin.role, 'directory')) {
      getMemberStats(token)
        .then((res) => setMemberStats(res.data))
        .catch(() => setMemberStats({ totalMembers: 0, approvedMembers: 0, pendingApprovals: 0 }));
    }
    // /api/quotes is gated by adminOnly on the backend (not the permission
    // system), same as the "Tokyo Tour" sidebar link — so only fetch for the
    // admin role, matching AdminSidebar's `admin.role === 'admin'` fallback.
    if (admin.role === 'admin') {
      getQuoteRequests(token, { source: 'Tokyo Tour', limit: 1 })
        .then((res) => setTokyoTourCount(res.total ?? 0))
        .catch(() => setTokyoTourCount(0));
    }
  }, [admin]);

  const tiles: { label: string; value: string | number; icon: typeof Package; href?: string }[] = [];
  if (!admin || can(admin.role, 'products')) {
    tiles.push({ label: 'Total Live Products', value: products ?? '—', icon: Package });
  }
  if (!admin || can(admin.role, 'directory')) {
    tiles.push(
      { label: 'Total Companies in Directory', value: memberStats?.approvedMembers ?? '—', icon: Building2 },
      { label: 'Pending Member Approvals', value: memberStats?.pendingApprovals ?? '—', icon: UserCheck },
      { label: 'Total Registered Members', value: memberStats?.totalMembers ?? '—', icon: Users }
    );
  }
  if (!admin || admin.role === 'admin') {
    tiles.push({
      label: 'Tokyo Tour Interested',
      value: tokyoTourCount ?? '—',
      icon: Plane,
      href: '/admin/tokyo-tour',
    });
  }

  return (
    <main className="p-6">
      <AdminPageHeader title="Dashboard" subtitle="Welcome back to the XCEED India admin panel." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <StatCard key={tile.label} {...tile} />
        ))}
      </div>
      {tiles.length === 0 && (
        <p className="rounded-2xl border border-black/5 bg-brand-mist p-6 text-sm text-brand-slate">
          Your role doesn&apos;t have access to any dashboard metrics yet.
        </p>
      )}
    </main>
  );
}
