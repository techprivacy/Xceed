'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Building2,
  UserCheck,
  Users,
  ShoppingBag,
  Bookmark,
  Newspaper,
  MessageSquare,
  Plus,
  FileText,
  ArrowRight,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DonutChart from '@/components/admin/charts/DonutChart';
import BarChart from '@/components/admin/charts/BarChart';
import Card from '@/components/ui/Card';
import {
  getAdminToken,
  getProducts,
  getMembershipApplicationStats,
  getAccounts,
  getOrders,
  getSavedCarts,
  getNewsArticles,
  getQuoteRequests,
} from '@/lib/api';
import { useCurrentAdmin } from '@/lib/useCurrentAdmin';
import { can } from '@/lib/permissions';

interface ApplicationStats {
  approvedCompanies: number;
  pendingApplications: number;
  totalApplications: number;
}

const QUICK_ACTIONS = [
  { label: 'Add Product', href: '/admin/products/new', icon: Plus },
  { label: 'New Article', href: '/admin/news/new', icon: FileText },
  { label: 'View Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'View Enquiries', href: '/admin/contact', icon: MessageSquare },
];

// Every number on this page is a real count fetched from the database as
// of page load — nothing here is fabricated, including chart values.
export default function AdminDashboardPage() {
  const { admin } = useCurrentAdmin();
  const [products, setProducts] = useState<number | null>(null);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats | null>(null);
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [savedCartCount, setSavedCartCount] = useState<number | null>(null);
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const [newEnquiries, setNewEnquiries] = useState<number | null>(null);
  const [newOrders, setNewOrders] = useState<number | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token || !admin) return;

    if (can(admin.role, 'products')) {
      getProducts({ limit: 1 })
        .then((res) => setProducts(res.total ?? 0))
        .catch(() => setProducts(0));
    }
    if (can(admin.role, 'directory')) {
      getMembershipApplicationStats(token)
        .then((res) => setApplicationStats(res.data))
        .catch(() => setApplicationStats({ approvedCompanies: 0, pendingApplications: 0, totalApplications: 0 }));
      getAccounts(token, { limit: 1 })
        .then((res) => setAccountCount(res.total ?? 0))
        .catch(() => setAccountCount(0));
    }
    if (can(admin.role, 'news')) {
      getNewsArticles({ includeDrafts: true, limit: 1 })
        .then((res) => setNewsCount(res.total ?? 0))
        .catch(() => setNewsCount(0));
    }
    // /api/orders, /api/saved-carts, /api/quotes are gated by adminOnly on
    // the backend (not the permission system) — so only fetch for the
    // admin role, matching AdminSidebar's `admin.role === 'admin'` fallback.
    if (admin.role === 'admin') {
      getOrders(token, { limit: 1 })
        .then((res) => setOrderCount(res.total ?? 0))
        .catch(() => setOrderCount(0));
      getOrders(token, { status: 'new', limit: 1 })
        .then((res) => setNewOrders(res.total ?? 0))
        .catch(() => setNewOrders(0));
      getSavedCarts(token, { limit: 1 })
        .then((res) => setSavedCartCount(res.total ?? 0))
        .catch(() => setSavedCartCount(0));
      getQuoteRequests(token, { status: 'new', limit: 1 })
        .then((res) => setNewEnquiries(res.total ?? 0))
        .catch(() => setNewEnquiries(0));
    }
  }, [admin]);

  const tiles: { label: string; value: string | number; icon: typeof Package; href?: string; tone?: 'red' | 'blue' | 'navy' | 'green' | 'amber' }[] = [];
  if (!admin || can(admin.role, 'products')) {
    tiles.push({ label: 'Total Live Products', value: products ?? '—', icon: Package, href: '/admin/products', tone: 'blue' });
  }
  if (!admin || admin.role === 'admin') {
    tiles.push(
      { label: 'Total Orders', value: orderCount ?? '—', icon: ShoppingBag, href: '/admin/orders', tone: 'green' },
      { label: 'Saved Carts', value: savedCartCount ?? '—', icon: Bookmark, href: '/admin/saved-carts', tone: 'amber' }
    );
  }
  if (!admin || can(admin.role, 'directory')) {
    tiles.push(
      { label: 'Total Companies in Directory', value: applicationStats?.approvedCompanies ?? '—', icon: Building2, href: '/admin/membership', tone: 'navy' },
      { label: 'Pending Membership Applications', value: applicationStats?.pendingApplications ?? '—', icon: UserCheck, href: '/admin/membership', tone: 'red' },
      { label: 'Total Registered Users', value: accountCount ?? '—', icon: Users, href: '/admin/accounts', tone: 'blue' }
    );
  }
  if (!admin || can(admin.role, 'news')) {
    tiles.push({ label: 'News Articles', value: newsCount ?? '—', icon: Newspaper, href: '/admin/news', tone: 'navy' });
  }

  const rejectedApplications = applicationStats
    ? Math.max(0, applicationStats.totalApplications - applicationStats.approvedCompanies - applicationStats.pendingApplications)
    : 0;

  const overviewBars = [
    ...(products !== null ? [{ label: 'Products', value: products, color: '#3B82F6' }] : []),
    ...(orderCount !== null ? [{ label: 'Orders', value: orderCount, color: '#22C55E' }] : []),
    ...(accountCount !== null ? [{ label: 'Users', value: accountCount, color: '#0F4AA6' }] : []),
    ...(applicationStats ? [{ label: 'Directory Companies', value: applicationStats.approvedCompanies, color: '#F59E0B' }] : []),
    ...(newsCount !== null ? [{ label: 'News Articles', value: newsCount, color: '#8B5CF6' }] : []),
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Dashboard" subtitle="Welcome back to the XCEED admin panel." />

      {tiles.length === 0 ? (
        <p className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-brand-slate">
          Your role doesn&apos;t have access to any dashboard metrics yet.
        </p>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((tile) => (
              <StatCard key={tile.label} {...tile} />
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-blue/20 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                  <Icon size={18} />
                </span>
                <span className="min-w-0 truncate text-sm font-bold text-brand-charcoal">{label}</span>
              </Link>
            ))}
          </div>

          {/* Charts + needs-attention */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
            {applicationStats && applicationStats.totalApplications > 0 && (
              <Card className="p-5 sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-brand-charcoal">Directory Status</h2>
                <div className="mt-5">
                  <DonutChart
                    segments={[
                      { label: 'Approved', value: applicationStats.approvedCompanies, color: '#22C55E' },
                      { label: 'Pending', value: applicationStats.pendingApplications, color: '#F59E0B' },
                      { label: 'Rejected', value: rejectedApplications, color: '#EF4444' },
                    ]}
                  />
                </div>
              </Card>
            )}

            {overviewBars.length > 0 && (
              <Card className="p-5 sm:p-6 lg:col-span-2">
                <h2 className="text-sm font-bold uppercase tracking-wide text-brand-charcoal">Platform Overview</h2>
                <div className="mt-5">
                  <BarChart bars={overviewBars} />
                </div>
              </Card>
            )}
          </div>

          {admin?.role === 'admin' && (newOrders !== null || newEnquiries !== null) && (
            <Card className="mt-6 p-5 sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-brand-charcoal">Needs Attention</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-3 rounded-xl border border-black/5 p-3.5 transition hover:bg-brand-mist"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <ShoppingBag size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-brand-black">{newOrders ?? '—'} new orders</span>
                    <span className="block text-xs text-brand-slate">Awaiting confirmation</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-brand-slate" />
                </Link>
                <Link
                  href="/admin/contact"
                  className="flex items-center gap-3 rounded-xl border border-black/5 p-3.5 transition hover:bg-brand-mist"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                    <MessageSquare size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-brand-black">{newEnquiries ?? '—'} new enquiries</span>
                    <span className="block text-xs text-brand-slate">Not yet followed up</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-brand-slate" />
                </Link>
              </div>
            </Card>
          )}
        </>
      )}
    </main>
  );
}
