'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  FolderTree,
  ShoppingCart,
  FileSpreadsheet,
  Users,
  Building2,
  ShieldCheck,
  Settings,
  ScrollText,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Bulk Quotations', href: '/admin/quotes', icon: FileSpreadsheet },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Dealers', href: '/admin/dealers', icon: Building2 },
  { label: 'Users & Roles', href: '/admin/users', icon: ShieldCheck },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Activity Logs', href: '/admin/activity-logs', icon: ScrollText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('xceed_admin_token');
    router.push('/admin/login');
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-brand-navy text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="text-lg font-black">
          X<span className="text-brand-blue">CEED</span> Admin
        </div>
        <p className="mt-0.5 text-[11px] text-white/50">Precision Marking Solutions</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-blue text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
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
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
