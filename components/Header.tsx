'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { useCartCount } from '@/lib/useCartCount';
import { WHATSAPP_GROUP_URL, PRODUCT_CATEGORIES } from '@/lib/staticData';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

const MAIN_CATEGORIES = PRODUCT_CATEGORIES.filter(
  (c) => ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'].includes(c.urlSlug)
);

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  ...MAIN_CATEGORIES.map((c) => ({ label: c.title, href: `/${c.urlSlug}` })),
  { label: 'Membership', href: '/membership' },
  { label: 'Contact Us', href: '/contact-us' },
];

const TOUR_ITEM = { label: 'Tokyo Tour 2026', href: '/tokyo-tour-2026' };

export default function Header() {
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="bg-white">
        <div className="container-x flex items-center gap-4 py-3 lg:gap-8 lg:py-4">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-mist lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a href="/" className="relative h-11 w-36 shrink-0 sm:h-12 sm:w-40 lg:h-14 lg:w-52 xl:w-56">
            <Image src="/logo.png" alt="XCEED India" fill sizes="220px" className="object-contain" priority />
          </a>

          <form action="/products" className="hidden min-w-0 flex-1 items-stretch lg:flex">
            <label className="sr-only" htmlFor="catalog-search">Search the product catalogue</label>
            <input
              id="catalog-search"
              name="q"
              type="search"
              placeholder="Search letters, holders, jigs and marking tools"
              className="w-full rounded-l-2xl border border-r-0 border-black/10 bg-brand-mist/60 px-5 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-brand-red/20"
            />
            <button
              type="submit"
              aria-label="Search catalogue"
              className="flex items-center justify-center rounded-r-2xl bg-brand-red px-5 text-white transition-colors hover:bg-brand-redDark"
            >
              <Search size={19} />
            </button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our WhatsApp group"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 bg-[#25D366] text-white transition-all duration-200 hover:bg-[#1fa84f] hover:-translate-y-0.5 xl:flex"
            >
              <WhatsAppIcon size={22} />
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-white">Join Our</span>
                <span className="block text-xs font-semibold text-white">WhatsApp Group</span>
              </span>
            </a>

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

      <nav className="hidden bg-brand-black lg:block">
        <div className="container-x">
          <ul className="flex items-center justify-between py-2.5 text-[12.5px] font-bold uppercase tracking-[0.045em] text-white/70">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-md px-1 py-2 transition-colors after:absolute after:bottom-0 after:left-1 after:h-0.5 after:rounded-full after:bg-brand-red after:transition-all after:duration-300 ${
                    pathname === item.href
                      ? 'text-white after:w-full'
                      : 'after:w-0 hover:text-white hover:after:w-full'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={TOUR_ITEM.href}
                className="relative flex items-center gap-1.5 rounded-lg bg-brand-red px-3.5 py-1.5 text-white shadow-sm shadow-brand-red/30 transition-all hover:-translate-y-0.5 hover:bg-brand-redDark"
              >
                <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-white" />
                </span>
                {TOUR_ITEM.label}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {open && (
        <div className="animate-fadeIn border-t border-white/10 bg-brand-black lg:hidden">
          <ul className="container-x flex flex-col gap-1 py-3 text-xs font-semibold uppercase tracking-wide text-white/80">
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
              </li>
            ))}
            <li className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3">
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-3.5 py-3 normal-case tracking-normal text-white/80"
              >
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
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
