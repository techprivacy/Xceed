import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck, FileText, RefreshCcw, Phone, Mail, Clock } from 'lucide-react';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

const MAIN_CATEGORIES = PRODUCT_CATEGORIES.filter((c) =>
  ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'].includes(c.urlSlug)
);

const SOCIALS = [
  { icon: Facebook, label: 'Facebook', bg: 'bg-[#1877F2]', href: '#' },
  {
    icon: Instagram,
    label: 'Instagram',
    bg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    href: 'https://www.instagram.com/xceed_india',
  },
  { icon: Linkedin, label: 'LinkedIn', bg: 'bg-[#0A66C2]', href: 'https://www.linkedin.com/company/xceedindia' },
  { icon: Youtube, label: 'YouTube', bg: 'bg-[#FF0000]', href: '#' },
];

const MEMBER_LINKS = [
  { label: 'Membership', href: '/membership' },
  { label: 'Member Directory', href: '/membership#directory' },
  { label: 'Become a Member', href: '/membership/register' },
  { label: 'Member Login', href: '/member/login' },
  { label: 'Tokyo Tour 2026', href: '/tokyo-tour-2026' },
];

// Shared so the three link columns keep identical hierarchy and spacing.
const COLUMN_HEADING = 'text-sm font-bold uppercase tracking-[0.15em] text-brand-slate';
const COLUMN_LINK = 'font-medium text-brand-charcoal transition-colors hover:text-brand-blue';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', icon: ShieldCheck, href: '/privacy-policy' },
  { label: 'Terms & Conditions', icon: FileText, href: '/terms-and-conditions' },
  { label: 'Refund Policy', icon: RefreshCcw, href: '/refund-policy' },
];

// Each wave repeats exactly every 1200 user units, so the `lavaDrift` keyframe
// (which shifts by -1200px) loops without a visible seam. The paths run to 2400
// so a second tile is always queued off-screen to the right.
const WAVES = [
  {
    d: 'M0,70 C150,35 300,105 600,70 C900,35 1050,105 1200,70 C1350,35 1500,105 1800,70 C2100,35 2250,105 2400,70 L2400,200 L0,200 Z',
    fill: 'var(--color-secondary)',
    opacity: 0.35,
    duration: '19s',
  },
  {
    d: 'M0,95 C200,60 400,130 600,95 C800,60 1000,130 1200,95 C1400,60 1600,130 1800,95 C2000,60 2200,130 2400,95 L2400,200 L0,200 Z',
    fill: 'var(--color-secondary)',
    opacity: 0.7,
    duration: '13s',
  },
  {
    d: 'M0,120 C180,95 360,145 600,120 C840,95 1020,145 1200,120 C1380,95 1560,145 1800,120 C2040,95 2220,145 2400,120 L2400,200 L0,200 Z',
    fill: 'var(--color-dark)',
    opacity: 1,
    duration: '9s',
  },
];

export default function Footer() {
  return (
    // overflow-hidden keeps the oversized decorative "X" from widening the
    // page; it does not clip the fixed-position floating button.
    <footer className="relative overflow-hidden bg-white">
      <FloatingWhatsApp />

      <div className="relative">
        <span
          className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[18rem] font-black leading-none text-black/[0.03] lg:block"
          aria-hidden
        >
          X
        </span>

        <div className="container-x relative z-10 grid grid-cols-1 gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <span className="font-serif text-3xl font-bold tracking-wide text-brand-black">XCEED</span>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-slate">
              Beyond Your Expectations
            </p>
            <div className="mt-4 h-0.5 w-10 rounded-full bg-brand-blue" />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-brand-slate">
              XCEED India delivers Japanese-quality industrial marking solutions backed by 20+ years of
              expertise, a trusted network of 2,000+ manufacturers &amp; foundries, and 100+ precision tools
              across India and Japan.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, bg, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 ${bg}`}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={COLUMN_HEADING}>Products</h3>
            <ul className="mt-6 space-y-4 text-base">
              {MAIN_CATEGORIES.map((cat) => (
                <li key={cat.urlSlug}>
                  <a href={`/${cat.urlSlug}`} className={COLUMN_LINK}>
                    {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={COLUMN_HEADING}>Our Services</h3>
            <ul className="mt-6 space-y-4 text-base">
              {MEMBER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={COLUMN_LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={COLUMN_HEADING}>Get In Touch</h3>
            <ul className="mt-6 space-y-5 text-base">
              <li>
                <a
                  href="tel:+919909611333"
                  className="flex items-start gap-3.5 font-medium text-brand-charcoal transition-colors hover:text-brand-blue"
                >
                  <Phone size={20} className="mt-0.5 shrink-0 text-brand-blue" />
                  +91 99096 11333
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@xceedindia.com"
                  className="flex items-start gap-3.5 break-all font-medium text-brand-charcoal transition-colors hover:text-brand-blue"
                >
                  <Mail size={20} className="mt-0.5 shrink-0 text-brand-blue" />
                  info@xceedindia.com
                </a>
              </li>
              <li className="flex items-start gap-3.5 font-medium text-brand-charcoal">
                <Clock size={20} className="mt-0.5 shrink-0 text-brand-blue" />
                Mon &ndash; Sat: 9:00 AM &ndash; 6:00 PM (IST)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Molten lava band. Purely decorative: the drifting waves carry no
          information, so it is hidden from assistive tech. */}
      <div className="relative h-24 overflow-hidden sm:h-32 lg:h-40" aria-hidden>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lavaHeat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7FB8FF" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#7FB8FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {WAVES.map((wave) => (
            <path
              key={wave.d}
              d={wave.d}
              fill={wave.fill}
              opacity={wave.opacity}
              style={{ animation: `lavaDrift ${wave.duration} linear infinite` }}
            />
          ))}

          {/* Cool crest highlight sells the "wave" read while staying inside
              the XCEED blue palette. */}
          <rect x="0" y="60" width="1200" height="140" fill="url(#lavaHeat)" />
        </svg>
      </div>

      <div className="relative z-10 bg-brand-blueDark">
        {/* Extra bottom padding on small screens keeps the copyright clear of
            the fixed floating button, which sits above this bar. */}
        <div className="container-x flex flex-col items-center gap-3 pb-24 pt-4 text-center text-sm text-white/80 sm:flex-row sm:justify-between sm:pb-4">
          <p>© 2026 XCEED India. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map(({ label, icon: Icon, href }, i) => (
              <div key={label} className="flex items-center gap-4">
                {i > 0 && <span className="hidden h-3 w-px bg-white/25 sm:block" aria-hidden />}
                <a href={href} className="flex items-center gap-1.5 transition-colors hover:text-white hover:underline">
                  <Icon size={13} />
                  {label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
