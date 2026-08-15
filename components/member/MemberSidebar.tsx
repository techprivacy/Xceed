'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, User, Users, Handshake, CreditCard, LogOut, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard },
  { label: 'Your Profile', href: '/member/profile', icon: User },
  // Apply for Membership is its own step now (see MembershipApplication) —
  // an Account holder isn't a "member" just by having an account, unlike
  // the old Member model where signup and membership were the same thing.
  { label: 'Apply for Membership', href: '/membership/register', icon: Handshake },
  { label: 'Member Directory', href: '/member/directory', icon: Users },
  { label: 'Subscription', href: '/member/subscription', icon: CreditCard },
];

// Deliberately its own shell (not the public Header/Footer, not AdminSidebar)
// — this is a logged-in account holder's own application area, using a
// separate localStorage token (xceed_account_token) from both the public
// site and the admin panel.
//
// Unlike the admin panel (internal staff, overwhelmingly desktop), account
// holders are the public — real people who will open this from a phone. A
// fixed 256px column with no mobile treatment left ~134px for content on a
// 390px screen. Below lg, the sidebar becomes a slide-in drawer behind a
// top bar, same idiom as components/Header.tsx's mobile menu.
export default function MemberSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('xceed_account_token');
    router.push('/login');
  };

  const NavList = (
    <ul className="space-y-0.5 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname?.startsWith(item.href);
        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
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
  );

  return (
    <>
      {/* Mobile top bar: visible below lg, holds the menu toggle. The
          sidebar itself is fixed off-screen at this width, not part of
          normal flow, so this bar is what actually reserves layout space. */}
      <div className="flex items-center justify-between border-b border-black/5 bg-brand-navy px-4 py-3 lg:hidden">
        <div className="inline-block rounded-lg bg-white p-1">
          <Image src="/logo.png" alt="XCEED" width={280} height={126} className="h-7 w-auto object-contain" />
        </div>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 -translate-x-full flex-col bg-brand-navy text-white transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
      >
        <div className="hidden border-b border-white/10 px-5 py-5 lg:block">
          <div className="inline-block rounded-lg bg-white p-1.5">
            <Image src="/logo.png" alt="XCEED" width={280} height={126} priority className="h-9 w-auto object-contain" />
          </div>
          <p className="mt-2 text-[11px] text-white/50">Member Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">{NavList}</nav>

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
    </>
  );
}
