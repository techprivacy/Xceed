'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  LogOut,
  Award,
  MessageSquare,
  ShoppingBag,
  Bookmark,
  Users,
  Newspaper,
  X,
} from 'lucide-react';
import { useCurrentAdmin } from '@/lib/useCurrentAdmin';
import { can, Permission } from '@/lib/permissions';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  // Omitted entirely => admin-only (mirrors routes still gated by the
  // original adminOnly middleware rather than requirePermission).
  permission?: Permission;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// Categories and Settings were removed from the admin navigation on request.
// Their routes still exist under app/admin/ and remain reachable by direct URL
// — deleting them is a separate call, since /admin/settings is the only UI for
// the brand palette that drives every themed colour on the public site.
//
// Grouped into sections (enterprise-dashboard convention: Overview / Catalog
// / Commerce / Content / Directory / Support / System) purely for visual
// hierarchy — the underlying routes and permission gating are unchanged.
const NAV_SECTIONS: NavSection[] = [
  { label: 'Overview', items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'dashboard' }] },
  { label: 'Catalog', items: [{ label: 'Products', href: '/admin/products', icon: Package, permission: 'products' }] },
  {
    label: 'Commerce',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Saved Carts', href: '/admin/saved-carts', icon: Bookmark },
    ],
  },
  { label: 'Content', items: [{ label: 'News', href: '/admin/news', icon: Newspaper, permission: 'news' }] },
  {
    label: 'Directory',
    items: [
      { label: 'Users', href: '/admin/accounts', icon: Users, permission: 'directory' },
      { label: 'Membership Applications', href: '/admin/membership', icon: Award, permission: 'directory' },
    ],
  },
  { label: 'Support', items: [{ label: 'Contact Enquiries', href: '/admin/contact', icon: MessageSquare }] },
  { label: 'System', items: [{ label: 'Admin Users & Roles', href: '/admin/users', icon: ShieldCheck }] },
];

// Flattened for AdminTopbar's quick-nav search — one source of truth for
// "what pages exist" rather than a second hardcoded list drifting out of
// sync with this one.
export const ADMIN_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

interface AdminSidebarProps {
  // Mobile drawer state — undefined/omitted means "always visible" (desktop
  // default via lg: classes below), matching how this component behaved
  // before the mobile drawer existed.
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin } = useCurrentAdmin();

  // While /auth/me is loading, show every item rather than flashing an
  // empty sidebar — the API is the real gate, this list only hides links a
  // role can't use. Once the role is known, filter for real.
  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: admin
      ? section.items.filter((item) => (item.permission ? can(admin.role, item.permission) : admin.role === 'admin'))
      : section.items,
  })).filter((section) => section.items.length > 0);

  const handleLogout = () => {
    localStorage.removeItem('xceed_admin_token');
    router.push('/login');
  };

  const handleNavigate = () => onClose?.();

  return (
    <>
      {/* Backdrop — mobile drawer only, sits below the sidebar itself */}
      {open && (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col bg-brand-navy text-white transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <div className="inline-block rounded-lg bg-white p-1.5">
              <Image src="/logo.png" alt="XCEED" width={280} height={126} priority className="h-9 w-auto object-contain" />
            </div>
            <p className="mt-2 text-[11px] text-white/50">Precision Marking Solutions</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {admin && (
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-bold uppercase text-white">
                {admin.username.slice(0, 2)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{admin.username}</p>
                <p className="truncate text-xs capitalize text-white/50">{admin.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {visibleSections.map((section) => (
            <div key={section.label} className="mb-5 last:mb-0">
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname?.startsWith(item.href);
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={handleNavigate}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-brand-red text-white shadow-sm shadow-black/20'
                            : 'text-white/75 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon size={20} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={20} className="shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
