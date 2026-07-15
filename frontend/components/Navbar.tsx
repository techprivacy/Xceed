'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', active: true },
  { label: 'Cast Letters', href: '/cast-letters' },
  { label: 'Cast Numbers', href: '/cast-numbers' },
  { label: 'Holders', href: '/holders' },
  { label: 'Magnetic Tools', href: '/magnetic-tools' },
  { label: 'Custom Marking', href: '/custom-marking' },
  { label: 'Membership', href: '/membership' },
  { label: 'Contact Us', href: '/contact-us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container-x">
        <div className="flex items-center justify-between py-2.5 lg:hidden">
          <span className="text-[13px] font-semibold text-gray-700">Menu</span>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <ul className="hidden flex-wrap items-center justify-center gap-x-7 py-2.5 text-[13px] font-semibold tracking-wide lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`relative flex items-center gap-1 py-1 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-brand-blue after:transition-all after:duration-300 ${
                  item.active
                    ? 'text-brand-blue after:w-full'
                    : 'text-gray-700 after:w-0 hover:text-brand-blueDark hover:after:w-full'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {open && (
          <ul className="flex flex-col gap-1 border-t border-gray-100 py-2 text-sm font-semibold tracking-wide lg:hidden">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center justify-between gap-1 rounded px-2 py-2.5 transition-colors ${
                    item.active ? 'text-brand-blue' : 'text-gray-700 hover:bg-gray-50 hover:text-brand-blueDark'
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
