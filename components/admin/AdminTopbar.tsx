'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, ChevronDown, LogOut, ExternalLink, ShoppingBag, MessageSquare, Bookmark } from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '@/components/admin/AdminSidebar';
import { useCurrentAdmin } from '@/lib/useCurrentAdmin';
import { getAdminToken, getQuoteRequests, getOrders, getSavedCarts } from '@/lib/api';

interface AdminTopbarProps {
  onMenuClick: () => void;
}

interface Snapshot {
  newOrders: number;
  newEnquiries: number;
  savedCarts: number;
}

// Real counts, not fabricated ones: "needs attention" = status: 'new' for
// orders/quotes, and every saved cart (there's no status concept for those
// yet). Same admin-only endpoints useAdminNotifications already polls for
// toasts — this just also keeps a snapshot around to show in the bell
// dropdown, since a toast disappears the moment it's dismissed.
function useAdminSnapshot(isAdmin: boolean) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const token = getAdminToken();
    if (!token) return;
    let cancelled = false;

    const load = async () => {
      try {
        const [quotes, orders, carts] = await Promise.all([
          getQuoteRequests(token, { status: 'new', limit: 1 }),
          getOrders(token, { status: 'new', limit: 1 }),
          getSavedCarts(token, { limit: 1 }),
        ]);
        if (cancelled) return;
        setSnapshot({
          newEnquiries: quotes.total ?? 0,
          newOrders: orders.total ?? 0,
          savedCarts: carts.total ?? 0,
        });
      } catch {
        // Silent — topbar shouldn't error out over a background snapshot.
      }
    };

    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAdmin]);

  return snapshot;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const router = useRouter();
  const { admin } = useCurrentAdmin();
  const snapshot = useAdminSnapshot(admin?.role === 'admin');

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const results =
    query.trim().length > 0
      ? ADMIN_NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()))
      : [];

  useEffect(() => {
    const closeOnOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, []);

  const goTo = (href: string) => {
    setQuery('');
    setSearchOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('xceed_admin_token');
    router.push('/login');
  };

  const notifCount = snapshot ? snapshot.newOrders + snapshot.newEnquiries : 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-black/5 bg-white px-4 shadow-sm sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-mist lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Quick-nav search — client-side fuzzy match over admin pages, not a
          server search across every entity (that's a bigger, separate
          feature). Still a real, working jump-to-page tool. */}
      <div ref={searchRef} className="relative min-w-0 flex-1 max-w-md">
        <div className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-mist/60 px-3 py-2 focus-within:border-brand-blue/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-blue/15">
          <Search size={16} className="shrink-0 text-brand-slate" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search pages..."
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-brand-slate/70"
          />
        </div>
        {searchOpen && results.length > 0 && (
          <div className="animate-fadeIn absolute left-0 top-full z-40 mt-1.5 w-full min-w-[220px] rounded-xl border border-black/5 bg-white py-1.5 shadow-lg">
            {results.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => goTo(item.href)}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-brand-charcoal transition hover:bg-brand-mist"
              >
                <item.icon size={15} className="shrink-0 text-brand-slate" />
                {item.label}
              </button>
            ))}
          </div>
        )}
        {searchOpen && query.trim().length > 0 && results.length === 0 && (
          <div className="animate-fadeIn absolute left-0 top-full z-40 mt-1.5 w-full rounded-xl border border-black/5 bg-white px-3.5 py-2.5 text-sm text-brand-slate shadow-lg">
            No pages match &quot;{query}&quot;
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-brand-slate transition hover:bg-brand-mist hover:text-brand-charcoal sm:flex"
        >
          View Site
          <ExternalLink size={13} />
        </Link>

        {admin?.role === 'admin' && (
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-mist"
            >
              <Bell size={20} />
              {notifCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="animate-fadeIn absolute right-0 top-full z-40 mt-1.5 w-72 rounded-xl border border-black/5 bg-white py-2 shadow-xl">
                <p className="px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-slate">
                  Needs Attention
                </p>
                <Link
                  href="/admin/orders"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-charcoal transition hover:bg-brand-mist"
                >
                  <ShoppingBag size={16} className="shrink-0 text-brand-blue" />
                  <span className="flex-1">New orders</span>
                  <span className="font-bold">{snapshot?.newOrders ?? '—'}</span>
                </Link>
                <Link
                  href="/admin/contact"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-charcoal transition hover:bg-brand-mist"
                >
                  <MessageSquare size={16} className="shrink-0 text-brand-red" />
                  <span className="flex-1">New enquiries</span>
                  <span className="font-bold">{snapshot?.newEnquiries ?? '—'}</span>
                </Link>
                <Link
                  href="/admin/saved-carts"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-charcoal transition hover:bg-brand-mist"
                >
                  <Bookmark size={16} className="shrink-0 text-amber-500" />
                  <span className="flex-1">Saved carts</span>
                  <span className="font-bold">{snapshot?.savedCarts ?? '—'}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {admin && (
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition hover:bg-brand-mist"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold uppercase text-white">
                {admin.username.slice(0, 2)}
              </span>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-xs font-bold text-brand-charcoal">{admin.username}</span>
                <span className="text-[11px] capitalize text-brand-slate">{admin.role.replace('_', ' ')}</span>
              </span>
              <ChevronDown size={14} className={`shrink-0 text-brand-slate transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div className="animate-fadeIn absolute right-0 top-full z-40 mt-1.5 w-52 rounded-xl border border-black/5 bg-white py-1.5 shadow-xl">
                <div className="border-b border-black/5 px-4 py-2.5">
                  <p className="truncate text-sm font-bold text-brand-charcoal">{admin.username}</p>
                  <p className="truncate text-xs capitalize text-brand-slate">{admin.role.replace('_', ' ')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-brand-red transition hover:bg-red-50"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
