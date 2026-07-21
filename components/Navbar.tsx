'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', active: true },
  { label: 'Cast Letters', href: '/cast-letters' },
  { label: 'Cast Numbers', href: '/cast-numbers' },
  { label: 'Holders', href: '/holders' },
  { label: 'Magnetic Tools', href: '/magnetic-tools' },
  { label: 'Membership', href: '/membership' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Tokyo Tour 2026', href: '/tokyo-tour-2026', highlight: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const tourItem = NAV_ITEMS.find((item) => item.highlight);

  return (
    <nav className="border-t border-black/5 bg-white shadow-sm">
      <div className="container-x">
        <div className="flex items-center justify-between py-3.5 lg:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <a href="/" className="relative h-11 w-40 shrink-0">
              <Image src="/logo.png" alt="XCEED India" fill sizes="160px" className="object-contain" priority />
            </a>
            {tourItem && (
              <a
                href={tourItem.href}
                className="flex shrink-0 animate-pulse flex-col items-center justify-center rounded-xl bg-brand-red px-3.5 py-1.5 text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-white shadow-sm shadow-brand-red/30"
              >
                <span>Tokyo</span>
                <span>Tour 2026</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-5">
            <a href="/cart" className="relative flex items-center text-brand-charcoal hover:text-brand-red">
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] text-white">
                0
              </span>
              <ShoppingCart size={25} />
            </a>
            <a href="/admin/login" className="flex items-center text-brand-charcoal hover:text-brand-red">
              <User size={25} />
            </a>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-brand-charcoal hover:bg-brand-mist"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <ul className="hidden flex-wrap items-center justify-center gap-x-8 py-3 text-base font-semibold uppercase tracking-wide lg:flex">
          {NAV_ITEMS.map((item) =>
            item.highlight ? (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 text-white shadow-sm shadow-brand-red/30 transition-colors hover:bg-brand-redDark"
                >
                  {item.label}
                </a>
              </li>
            ) : (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`relative flex items-center gap-1.5 py-1.5 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-brand-red after:transition-all after:duration-300 ${
                    item.active
                      ? 'text-brand-red after:w-full'
                      : 'text-brand-charcoal after:w-0 hover:text-brand-red hover:after:w-full'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>

        {open && (
          <ul className="flex flex-col gap-1 border-t border-black/5 py-2 text-xs font-semibold uppercase tracking-wide lg:hidden">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center justify-between gap-1 rounded-xl px-3 py-2.5 transition-colors ${
                    item.highlight
                      ? 'bg-brand-red text-white'
                      : item.active
                        ? 'bg-brand-red/10 text-brand-red'
                        : 'text-brand-charcoal hover:bg-brand-mist'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
