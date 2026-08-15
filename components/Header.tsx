'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useCartCount } from '@/lib/useCartCount';
import { getAccountToken } from '@/lib/api';
import { PRODUCT_CATEGORIES, INDUSTRIES } from '@/lib/staticData';

// Precomputed once at module load, not inline per render: Math.cos/sin can
// return a value that differs from the browser's in the last couple of
// binary digits versus Node's SSR pass (trig functions aren't required to
// be bit-identical across engines/platforms per IEEE 754, only +-*/ are).
// That was showing up as a real React hydration-mismatch warning on every
// page load — "Server: 7.748333950160459 Client: 7.74833395016046" — right
// in the language switcher's own flag icon. .toFixed(3) rounds both
// platforms' results to the same string well before that divergence, which
// sits ~12 decimal places deeper than this icon could ever render visibly.
const CHAKRA_SPOKES = Array.from({ length: 24 }, (_, i) => {
  const a = (i * Math.PI) / 12;
  return { x2: (15 + 2.6 * Math.cos(a)).toFixed(3), y2: (10 + 2.6 * Math.sin(a)).toFixed(3) };
});

// Drawn India flag chip — deliberately not the 🇮🇳 emoji. Windows (this
// user's OS) renders regional-indicator flag emoji as bare "IN" text
// instead of a flag glyph, so an actual graphic needs to be real markup,
// not a codepoint. Site is English-only for now (see LANGUAGES history in
// git log if multi-language returns), so this is the one flag left.
function IndiaFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden>
      <rect width="30" height="20" rx="2" fill="#fff" />
      <rect width="30" height="6.67" rx="2" fill="#FF9933" />
      <rect y="13.33" width="30" height="6.67" rx="2" fill="#138808" />
      <rect width="30" height="20" rx="2" fill="none" stroke="#00000014" strokeWidth="1" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.35" />
      <circle cx="15" cy="10" r="0.4" fill="#000080" />
      {CHAKRA_SPOKES.map((spoke, i) => (
        <line key={i} x1="15" y1="10" x2={spoke.x2} y2={spoke.y2} stroke="#000080" strokeWidth="0.15" />
      ))}
    </svg>
  );
}

const MAIN_CATEGORIES = PRODUCT_CATEGORIES.filter(
  (c) => ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'].includes(c.urlSlug)
);

type NavChild = { label: string; href: string };
// href is optional: "About Us" is a dropdown-only trigger with no page of
// its own (see app/[locale]/about-us/page.tsx — it just redirects) so
// clicking the label itself should do nothing but reveal the dropdown.
type NavItem = { label: string; href?: string; children?: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us',
    children: [
      { label: 'Director Message', href: '/about-us/director-message' },
      { label: 'Our Global Team', href: '/about-us/our-global-team' },
      { label: 'News & Awards', href: '/about-us/news-awards' },
    ],
  },
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
  const cartCount = useCartCount();
  const pathname = usePathname();

  // Explicit click-to-toggle for href-less nav triggers ("About Us"), as a
  // reliable supplement to the CSS group-hover the other nav items rely on
  // — a <button> visually invites clicking, not just hovering, so this
  // covers that path deterministically rather than leaning on hover timing.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const closeOnOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenDropdown(null);
      // Escape doesn't blur by default, unlike an outside click — without
      // this the trigger button keeps keyboard focus, and the dropdown's
      // own group-focus-within:visible rule keeps it visually open even
      // though openDropdown state is now correctly null.
      if (document.activeElement instanceof HTMLElement && navRef.current?.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openDropdown]);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const check = () => setIsSignedIn(Boolean(getAccountToken()));
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('xceed_account_token');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-white">
        <div className="container-x flex items-center gap-2 py-3 sm:gap-4 lg:gap-6 lg:py-4 xl:gap-5 2xl:gap-8">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-brand-charcoal transition hover:bg-brand-mist xl:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a href="/" className="relative h-9 w-24 shrink-0 sm:h-12 sm:w-40 lg:h-14 lg:w-52 xl:w-56">
            <Image src="/logo.png" alt="XCEED" fill sizes="220px" className="object-contain" priority />
          </a>

          {/* Centered between logo and the EN/Account/Cart cluster. Verified
              (screenshot sweep, 1280-1920px) this has real margin to spare at
              every width, so no horizontal-overflow fallback is needed here.
              That's deliberate, not an oversight: overflow-x-auto (removed)
              was silently clipping every dropdown panel below it — per the
              CSS spec, setting only overflow-x to non-visible forces
              overflow-y to compute as auto too, which clipped the
              absolutely-positioned dropdowns hanging below this <ul>'s own
              one-line height. Confirmed via elementFromPoint(): clicks at the
              dropdown's own coordinates were landing on the header's
              container div instead, for every item with children. */}
          <ul
            ref={navRef}
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 text-sm font-bold uppercase tracking-[0.03em] leading-normal text-brand-charcoal/70 xl:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.children
                ? pathname === item.href || item.children.some((c) => c.href === pathname)
                : pathname === item.href;
              const isOpen = openDropdown === item.label;

              // uppercase is explicit here, not just inherited from the <ul>
              // — browsers reset text-transform to none on <button> in their
              // default stylesheet, which silently broke it for href-less
              // triggers like "About Us" even though the parent <ul> already
              // says uppercase.
              const triggerClassName = `relative flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 uppercase transition-colors after:absolute after:bottom-0 after:left-2 after:h-0.5 after:rounded-full after:bg-brand-red after:transition-all after:duration-300 ${
                isActive
                  ? 'text-brand-charcoal after:w-[calc(100%-1rem)]'
                  : 'hover:text-brand-charcoal after:w-0 hover:after:w-[calc(100%-1rem)]'
              }`;
              const triggerContent = (
                <>
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </>
              );

              return (
                <li
                  key={item.label}
                  className="relative shrink-0"
                  // Driven entirely by React state now, not CSS
                  // :hover/:focus-within — those depend on paint/transition
                  // timing that turned out unreliable for this menu in
                  // practice, so open/closed is now a plain boolean with no
                  // ambiguity about what's actually showing.
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown((current) => (current === item.label ? null : current))}
                >
                  {item.href ? (
                    <a href={item.href} className={triggerClassName}>
                      {triggerContent}
                    </a>
                  ) : (
                    // No href (e.g. "About Us"): dropdown-only trigger that
                    // opens nothing itself — a <button>, not a link.
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className={triggerClassName}
                    >
                      {triggerContent}
                    </button>
                  )}

                  {item.children && isOpen && (
                    <div className="animate-fadeIn absolute left-0 top-full z-[60] min-w-[190px] rounded-xl border border-black/5 bg-white py-2 shadow-lg">
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

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Static English indicator — site is English-only for now, no
                dropdown since there's nothing to switch to. Multi-language
                (Google Translate widget + EN/JA routing) was built and then
                fully removed per request; see git log if it comes back. The
                chevron stays purely decorative (matches the reference pill
                design) rather than implying a working switcher. */}
            <div
              className="notranslate flex items-center gap-1.5 rounded-xl border border-brand-border/60 px-2.5 py-2 text-xs font-bold uppercase tracking-wide text-brand-charcoal/80 sm:px-3"
              translate="no"
            >
              <IndiaFlagIcon className="h-3.5 w-5 shrink-0 rounded-[2px]" />
              <span>EN</span>
              <ChevronDown size={12} className="hidden shrink-0 text-brand-charcoal/40 sm:block" />
            </div>

            <span className="hidden h-8 w-px bg-brand-border/60 sm:block" aria-hidden />

            {/* Sign in / My Account */}
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-brand-border/60 px-2.5 py-2 transition hover:bg-brand-mist sm:px-3"
              >
                {/* Below sm: icon + chevron only. The full two-line label
                    (~130px) plus everything else in this row was overflowing
                    the viewport at 375px — a real ~100px horizontal
                    scroll/clip on mobile, not just tight. */}
                <User size={20} className="shrink-0 text-brand-charcoal/70" />
                <span className="hidden min-w-0 flex-col items-start whitespace-nowrap leading-snug sm:flex">
                  <span className="text-[11px] font-medium normal-case text-brand-slate">
                    {isSignedIn ? 'Hello, Member' : 'Hello, Sign in'}
                  </span>
                  <span className="text-xs font-bold normal-case text-brand-charcoal">My Account</span>
                </span>
                <ChevronDown size={12} className="shrink-0 transition-transform duration-200 group-hover:rotate-180" />
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
                      href="/login"
                      className="block w-full rounded-lg bg-brand-blue px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-blueDark"
                    >
                      Sign in
                    </a>
                    <p className="mt-2 text-center text-xs text-brand-slate">
                      New customer?{' '}
                      <a href="/member/register" className="font-semibold text-brand-red hover:underline">
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
                          Members Login
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
                        <a href="/products" className="hover:text-brand-red hover:underline">
                          Explore Showroom
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart — solid navy square, matching the reference design's
                fixed icon button rather than the old label-that-expands
                treatment at sm+. */}
            <a
              href="/cart"
              aria-label="Cart"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white transition hover:bg-brand-navy/90 sm:h-11 sm:w-11"
            >
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
              <ShoppingCart size={22} />
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-fadeIn border-t border-white/10 bg-brand-black xl:hidden">
          <ul className="container-x flex flex-col gap-1 py-3 text-sm font-semibold uppercase tracking-wide text-white/80">
            {NAV_ITEMS.map((item) => {
              const mobileTriggerClassName = `relative flex items-center justify-between gap-1 rounded-xl px-3.5 py-3 transition-colors ${
                pathname === item.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`;

              return (
              <li key={item.label}>
                {/* No href (e.g. "About Us"): tapping the label opens
                    nothing — its Director Message / etc. children below are
                    the only tappable destinations. */}
                {item.href ? (
                  <a href={item.href} onClick={() => setOpen(false)} className={mobileTriggerClassName}>
                    <span className="break-words">{item.label}</span>
                  </a>
                ) : (
                  <span className={mobileTriggerClassName}>
                    <span className="break-words">{item.label}</span>
                  </span>
                )}

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
              );
            })}
            <li className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3">
              <a
                href="/login"
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
