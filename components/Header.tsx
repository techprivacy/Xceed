'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useCartCount } from '@/lib/useCartCount';
import { getMemberToken } from '@/lib/api';
import { getActiveGoogleTranslateLang, translateTo, clearGoogleTranslateCookie } from '@/lib/googleTranslate';
import { PRODUCT_CATEGORIES, INDUSTRIES } from '@/lib/staticData';

// EN is the real underlying content (see i18n/routing.ts + messages/en) —
// clicking it navigates like any other link. Every other language is driven
// live by the Google Website Translator widget instead (see
// lib/googleTranslate.ts + components/GoogleTranslateLoader.tsx): `google:
// true` marks that. JA has its own /ja route via next-intl too, but no page
// actually calls useTranslations() — messages/ja/*.json covers two strings,
// so that route silently rendered English. Google Translate is what
// actually makes Japanese (and the rest) show translated content. `flag`
// picks which drawn flag (not an emoji — Windows renders flag emoji as bare
// "IN"/"JP" text) shows next to it; `native` is the name in that language's
// own script.
const LANGUAGES = [
  { code: 'en' as const, native: 'English', flag: 'in' as const, google: false },
  { code: 'ja' as const, native: '日本語', flag: 'jp' as const, google: true },
  { code: 'hi' as const, native: 'हिन्दी', flag: 'in' as const, google: true },
  { code: 'ta' as const, native: 'தமிழ்', flag: 'in' as const, google: true },
  { code: 'te' as const, native: 'తెలుగు', flag: 'in' as const, google: true },
  { code: 'kn' as const, native: 'ಕನ್ನಡ', flag: 'in' as const, google: true },
  { code: 'ml' as const, native: 'മലയാളം', flag: 'in' as const, google: true },
  { code: 'bn' as const, native: 'বাংলা', flag: 'in' as const, google: true },
  { code: 'mr' as const, native: 'मराठी', flag: 'in' as const, google: true },
] as const;

// Small drawn flag chips — deliberately not emoji. Windows (this user's OS)
// renders 🇮🇳/🇯🇵 as plain "IN"/"JP" text instead of a flag glyph, so an
// actual India/Japan graphic needs to be real markup, not a codepoint.
function FlagIcon({ country, className }: { country: 'in' | 'jp'; className?: string }) {
  if (country === 'jp') {
    return (
      <svg viewBox="0 0 30 20" className={className} aria-hidden>
        <rect width="30" height="20" rx="2" fill="#fff" />
        <rect width="30" height="20" rx="2" fill="none" stroke="#00000014" strokeWidth="1" />
        <circle cx="15" cy="10" r="6" fill="#BC002D" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden>
      <rect width="30" height="20" rx="2" fill="#fff" />
      <rect width="30" height="6.67" rx="2" fill="#FF9933" />
      <rect y="13.33" width="30" height="6.67" rx="2" fill="#138808" />
      <rect width="30" height="20" rx="2" fill="none" stroke="#00000014" strokeWidth="1" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.35" />
      <circle cx="15" cy="10" r="0.4" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI) / 12;
        return (
          <line
            key={i}
            x1="15"
            y1="10"
            x2={15 + 2.6 * Math.cos(a)}
            y2={10 + 2.6 * Math.sin(a)}
            stroke="#000080"
            strokeWidth="0.15"
          />
        );
      })}
    </svg>
  );
}

const LOCALE_COOKIE = 'NEXT_LOCALE';

function currentLocaleOf(pathname: string): 'en' | 'ja' {
  return pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : 'en';
}

// localePrefix is 'as-needed': the default locale (en) carries no prefix,
// so switching just means stripping/adding the /ja segment.
function localizedPath(pathname: string, target: 'en' | 'ja'): string {
  const stripped = pathname.replace(/^\/ja(?=\/|$)/, '') || '/';
  return target === 'ja' ? `/ja${stripped === '/' ? '' : stripped}` : stripped;
}

function setLocaleCookie(locale: 'en' | 'ja') {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

const MAIN_CATEGORIES = PRODUCT_CATEGORIES.filter(
  (c) => ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'].includes(c.urlSlug)
);

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  {
    label: 'Industries',
    href: '/industries',
    children: INDUSTRIES.map((i) => ({ label: i.name, href: `/industries/${i.urlSlug}` })),
  },
  {
    label: 'Products',
    href: '/products',
    children: MAIN_CATEGORIES.map((c) => ({ label: c.title, href: `/${c.urlSlug}` })),
  },
  { label: 'Membership', href: '/membership' },
  { label: 'Contact Us', href: '/contact-us' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [gtLang, setGtLang] = useState<string | null>(null);
  const cartCount = useCartCount();
  const pathname = usePathname();
  const currentLocale = currentLocaleOf(pathname);

  useEffect(() => {
    const check = () => setIsSignedIn(Boolean(getMemberToken()));
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, [pathname]);

  useEffect(() => {
    setGtLang(getActiveGoogleTranslateLang());
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('xceed_member_token');
    window.location.href = '/member/login';
  };

  // A Google-translated language (if active) takes visual priority over the
  // routed en/ja locale, since it's layered on top of whichever page is
  // actually showing.
  const activeCode = gtLang ?? currentLocale;
  const activeLang = LANGUAGES.find((l) => l.code === activeCode) ?? LANGUAGES[0];

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

          <ul className="no-scrollbar hidden min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto text-sm font-bold uppercase tracking-[0.03em] leading-normal text-brand-charcoal/70 xl:flex 2xl:gap-4 2xl:text-[15px]">
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
          </ul>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Language selector — translate="no" so Google doesn't re-translate
                these language names/codes into whichever language is currently
                active (e.g. showing "தமிழ் - TA" while browsing in Hindi). */}
            <div className="group relative notranslate" translate="no">
              <button
                type="button"
                aria-label="Select language"
                className="flex items-center gap-1 rounded-xl px-2 py-2 text-xs font-bold uppercase tracking-wide text-brand-charcoal/70 transition hover:bg-brand-mist hover:text-brand-charcoal sm:gap-1.5 sm:px-2.5"
              >
                <FlagIcon country={activeLang.flag} className="h-3.5 w-5 shrink-0 rounded-[2px]" />
                <span>{activeCode.toUpperCase()}</span>
                <ChevronDown size={13} className="shrink-0 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute right-0 top-full z-[60] max-h-[70vh] min-w-[200px] translate-y-1 overflow-y-auto rounded-xl border border-black/5 bg-white py-2 text-brand-charcoal opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {LANGUAGES.map((lang) => {
                  const isActive = activeCode === lang.code;
                  const rowClass = `flex w-full items-center gap-2 px-4 py-2 text-left text-xs normal-case transition-colors ${
                    isActive
                      ? 'bg-brand-mist font-semibold text-brand-red'
                      : 'text-brand-charcoal/80 hover:bg-brand-mist hover:text-brand-red'
                  }`;

                  if (lang.google) {
                    // Machine-translated in place via the Google widget —
                    // no navigation, so a <button> rather than an <a>.
                    return (
                      <button key={lang.code} type="button" onClick={() => { translateTo(lang.code); setGtLang(lang.code); }} className={rowClass}>
                        <FlagIcon country={lang.flag} className="h-3.5 w-5 shrink-0 rounded-[2px]" />
                        {lang.native} - {lang.code.toUpperCase()}
                      </button>
                    );
                  }

                  return (
                    <a
                      key={lang.code}
                      href={localizedPath(pathname, lang.code)}
                      onClick={() => {
                        clearGoogleTranslateCookie();
                        setLocaleCookie(lang.code);
                      }}
                      className={rowClass}
                    >
                      <FlagIcon country={lang.flag} className="h-3.5 w-5 shrink-0 rounded-[2px]" />
                      {lang.native} - {lang.code.toUpperCase()}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Sign in / Account & Lists */}
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl px-2 py-2 transition hover:bg-brand-mist sm:px-2.5"
              >
                <User size={20} className="hidden shrink-0 text-brand-charcoal/70 sm:block" />
                <span className="flex min-w-0 flex-col items-start leading-snug">
                  {/* max-w + truncate: translated labels run longer than English
                      in several of these languages — ellipsis keeps the button a
                      single predictable line instead of growing header height
                      per-language. */}
                  <span className="block max-w-[100px] truncate text-[10px] font-medium normal-case text-brand-slate sm:max-w-[140px] sm:text-[11px]">
                    {isSignedIn ? 'Hello, Member' : 'Hello, sign in'}
                  </span>
                  <span className="flex w-full min-w-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-brand-charcoal sm:text-xs">
                    <span className="block max-w-[85px] truncate sm:max-w-[120px]">Account &amp; Lists</span>
                    <ChevronDown size={12} className="shrink-0 transition-transform duration-200 group-hover:rotate-180" />
                  </span>
                </span>
              </button>

              <div className="invisible absolute right-0 top-full z-[60] w-[320px] max-w-[90vw] translate-y-1 rounded-xl border border-black/5 bg-white p-5 text-brand-charcoal opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-lg border border-brand-border px-4 py-2.5 text-center text-sm font-bold text-brand-charcoal transition hover:bg-brand-mist"
                  >
                    Sign out
                  </button>
                ) : (
                  <>
                    <a
                      href="/member/login"
                      className="block w-full rounded-lg bg-brand-blue px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-blueDark"
                    >
                      Sign in
                    </a>
                    <p className="mt-2 text-center text-xs text-brand-slate">
                      New customer?{' '}
                      <a href="/membership/register" className="font-semibold text-brand-red hover:underline">
                        Start here.
                      </a>
                    </p>
                  </>
                )}

                <div className="my-4 border-t border-black/5" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-brand-charcoal">
                      Your Account
                    </h3>
                    <ul className="space-y-1.5 text-xs text-brand-slate">
                      <li>
                        <a href="/member/profile" className="hover:text-brand-red hover:underline">
                          Your Account
                        </a>
                      </li>
                      <li>
                        <a href="/track-order" className="hover:text-brand-red hover:underline">
                          Your Orders
                        </a>
                      </li>
                      <li>
                        <a href="/member/subscription" className="hover:text-brand-red hover:underline">
                          Your Membership
                        </a>
                      </li>
                      <li>
                        <a href="/membership/register" className="hover:text-brand-red hover:underline">
                          Register your Business with us
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-brand-charcoal">
                      Your Lists
                    </h3>
                    <ul className="space-y-1.5 text-xs text-brand-slate">
                      <li>
                        <a href="#" className="hover:text-brand-red hover:underline">
                          Create a Wish List
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-brand-red hover:underline">
                          Wish from Any Website
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-brand-red hover:underline">
                          Discover Your Style
                        </a>
                      </li>
                      <li>
                        <a href="/products" className="hover:text-brand-red hover:underline">
                          Explore Showroom
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart */}
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
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-fadeIn border-t border-white/10 bg-brand-black xl:hidden">
          <ul className="container-x flex flex-col gap-1 py-3 text-sm font-semibold uppercase tracking-wide text-white/80">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center justify-between gap-1 rounded-xl px-3.5 py-3 transition-colors ${
                    pathname === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="break-words">{item.label}</span>
                </a>

                {item.children && (
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
