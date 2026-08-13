'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useCartCount } from '@/lib/useCartCount';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

const MAIN_CATEGORIES = PRODUCT_CATEGORIES.filter(
  (c) => ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'].includes(c.urlSlug)
);

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  {
    label: 'Products',
    href: '/products',
    children: MAIN_CATEGORIES.map((c) => ({ label: c.title, href: `/${c.urlSlug}` })),
  },
  { label: 'Membership', href: '/membership' },
  { label: 'Contact Us', href: '/contact-us' },
];

const TOUR_ITEM = { label: 'Tokyo Tour 2026', href: '/tokyo-tour-2026' };

export default function Header() {
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-white">
        <div className="container-x flex items-center gap-4 py-3 lg:gap-6 lg:py-4 xl:gap-10 2xl:gap-14">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-mist xl:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a href="/" className="relative h-11 w-36 shrink-0 sm:h-12 sm:w-40 lg:h-14 lg:w-52 xl:w-56">
            <Image src="/logo.png" alt="XCEED India" fill sizes="220px" className="object-contain" priority />
          </a>

          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.03em] text-brand-charcoal/70 xl:flex 2xl:gap-4 2xl:text-[15px]">
            {NAV_ITEMS.map((item) => {
              const isActive = item.children
                ? pathname === item.href || item.children.some((c) => c.href === pathname)
                : pathname === item.href;

              return (
                <li key={item.label} className="group relative shrink-0">
                  <a
                    href={item.href}
                    className={`relative flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 transition-colors after:absolute after:bottom-0 after:left-2 after:h-0.5 after:rounded-full after:bg-brand-red after:transition-all after:duration-300 xl:px-2.5 2xl:px-3 ${
                      isActive
                        ? 'text-brand-charcoal after:w-[calc(100%-1rem)]'
                        : 'hover:text-brand-charcoal after:w-0 hover:after:w-[calc(100%-1rem)]'
                    }`}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown size={14} className="shrink-0 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </a>

                  {item.children && (
                    <div className="invisible absolute left-0 top-full z-[60] min-w-[190px] translate-y-1 rounded-xl border border-black/5 bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2 text-xs normal-case tracking-normal transition-colors xl:text-sm ${
                            pathname === child.href
                              ? 'bg-brand-mist text-brand-red'
                              : 'text-brand-charcoal/80 hover:bg-brand-mist hover:text-brand-red'
                          }`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
            <li className="shrink-0">
              <a
                href={TOUR_ITEM.href}
                className="relative flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-red px-3 py-1.5 text-white shadow-sm shadow-brand-red/30 transition-all hover:-translate-y-0.5 hover:bg-brand-redDark xl:px-4 xl:py-2"
              >
                <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-white" />
                </span>
                {TOUR_ITEM.label}
              </a>
            </li>
          </ul>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <a
              href="/cart"
              aria-label="Cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-mist hover:text-brand-red sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
            >
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white sm:static sm:order-2">
                {cartCount}
              </span>
              <ShoppingCart size={28} className="sm:order-1" />
            </a>

            <a
              href="/admin/login"
              aria-label="Admin login"
              className="hidden h-11 w-11 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-mist hover:text-brand-red sm:flex"
            >
              <User size={26} />
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-fadeIn border-t border-white/10 bg-brand-black xl:hidden">
          <ul className="container-x flex flex-col gap-1 py-3 text-sm font-semibold uppercase tracking-wide text-white/80">
            {[...NAV_ITEMS, TOUR_ITEM].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center justify-between gap-1 rounded-xl px-3.5 py-3 transition-colors ${
                    item === TOUR_ITEM
                      ? 'bg-brand-red text-white'
                      : pathname === item.href
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item === TOUR_ITEM && (
                    <span className="relative flex h-3.5 w-3.5 shrink-0" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-white" />
                    </span>
                  )}
                </a>

                {'children' in item && item.children && (
                  <ul className="ml-3 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <a
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className={`block rounded-lg px-3 py-2 text-xs normal-case tracking-normal transition-colors ${
                            pathname === child.href
                              ? 'bg-white/10 text-white'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3">
              <a
                href="/admin/login"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-3.5 py-3 normal-case tracking-normal text-white/80"
              >
                <User size={16} /> Admin
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
