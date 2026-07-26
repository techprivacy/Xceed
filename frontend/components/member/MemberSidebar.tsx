'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, User, Users, CreditCard, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard },
  { label: 'Your Profile', href: '/member/profile', icon: User },
  { label: 'Member Directory', href: '/member/directory', icon: Users },
  { label: 'Subscription', href: '/member/subscription', icon: CreditCard },
];

// Deliberately its own shell (not the public Header/Footer, not AdminSidebar)
// — this is a logged-in member's own application area, using a separate
// localStorage token (xceed_member_token) from both the public site and the
// admin panel.
export default function MemberSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('xceed_member_token');
    router.push('/member/login');
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-brand-navy text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="inline-block rounded-lg bg-white p-1.5">
          <Image src="/logo.png" alt="XCEED India" width={280} height={126} priority className="h-9 w-auto object-contain" />
        </div>
        <p className="mt-2 text-[11px] text-white/50">Member Portal</p>
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
