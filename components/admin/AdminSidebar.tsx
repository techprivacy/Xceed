'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShieldCheck, LogOut, Award, MessageSquare, ShoppingBag, Bookmark, Users, Newspaper } from 'lucide-react';
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

// Categories and Settings were removed from the admin navigation on request.
// Their routes still exist under app/admin/ and remain reachable by direct URL
// — deleting them is a separate call, since /admin/settings is the only UI for
// the brand palette that drives every themed colour on the public site.
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { label: 'Products', href: '/admin/products', icon: Package, permission: 'products' },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Saved Carts', href: '/admin/saved-carts', icon: Bookmark },
  { label: 'Contact Enquiries', href: '/admin/contact', icon: MessageSquare },
  { label: 'Users', href: '/admin/accounts', icon: Users, permission: 'directory' },
  { label: 'Membership Applications', href: '/admin/membership', icon: Award, permission: 'directory' },
  { label: 'News', href: '/admin/news', icon: Newspaper, permission: 'news' },
  { label: 'Admin Users & Roles', href: '/admin/users', icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin } = useCurrentAdmin();

  // While /auth/me is loading, show every item rather than flashing an
  // empty sidebar — the API is the real gate, this list only hides links a
  // role can't use. Once the role is known, filter for real.
  const visibleItems = admin
    ? NAV_ITEMS.filter((item) => (item.permission ? can(admin.role, item.permission) : admin.role === 'admin'))
    : NAV_ITEMS;

  const handleLogout = () => {
    localStorage.removeItem('xceed_admin_token');
    router.push('/login');
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-brand-navy text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="inline-block rounded-lg bg-white p-1.5">
          <Image src="/logo.png" alt="XCEED" width={280} height={126} priority className="h-9 w-auto object-contain" />
        </div>
        <p className="mt-2 text-[11px] text-white/50">Precision Marking Solutions</p>
        {admin && (
          <p className="mt-3 truncate text-xs font-semibold text-white/70">
            {admin.username} <span className="text-white/40">&middot; {admin.role.replace('_', ' ')}</span>
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-3">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-brand-red text-white shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
