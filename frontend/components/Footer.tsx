import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck, FileText, RefreshCcw, Phone, Mail, Clock } from 'lucide-react';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

const SOCIALS = [
  { icon: Facebook, label: 'Facebook', bg: 'bg-[#1877F2]' },
  { icon: Instagram, label: 'Instagram', bg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
  { icon: Linkedin, label: 'LinkedIn', bg: 'bg-[#0A66C2]' },
  { icon: Youtube, label: 'YouTube', bg: 'bg-[#FF0000]' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', icon: ShieldCheck },
  { label: 'Terms & Conditions', icon: FileText },
  { label: 'Refund Policy', icon: RefreshCcw },
];

const COMPANY_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Industries We Serve', href: '/industries' },
  { label: 'Membership', href: '/membership' },
  { label: 'Tokyo Tour 2026', href: '/tokyo-tour-2026' },
  { label: 'Contact Us', href: '/contact-us' },
];

const SUPPORT_LINKS = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Dealer Login', href: '/dealer-login' },
  { label: 'Your Cart', href: '/cart' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-black text-white">
      <FloatingWhatsApp />
      <div className="h-1 bg-brand-red" />

      <div className="relative">
        <span
          className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[18rem] font-black leading-none text-white/[0.04] lg:block"
          aria-hidden
        >
          X
        </span>

        <div className="container-x relative z-10 grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <span className="font-serif text-3xl font-bold tracking-wide text-white">XCEED</span>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Beyond Your Expectations
            </p>
            <div className="mt-4 h-0.5 w-10 rounded-full bg-brand-red" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-footerText">
              XCEED India delivers premium Japanese-quality industrial marking solutions, including
              cast letters, holders, jigs, and magnetic tools, trusted by manufacturing industries
              across India.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, bg }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 ${bg}`}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">Products</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.urlSlug}>
                  <a href={`/${cat.urlSlug}`} className="text-brand-footerText transition-colors hover:text-brand-red">
                    {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">Company</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-brand-footerText transition-colors hover:text-brand-red">
                    {link.label}
                  </a>
                </li>
              ))}
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-brand-footerText transition-colors hover:text-brand-red">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">Get In Touch</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a href="tel:+919909611333" className="flex items-start gap-3 text-brand-footerText transition-colors hover:text-brand-red">
                  <Phone size={16} className="mt-0.5 shrink-0 text-brand-red" />
                  +91 99096 11333
                </a>
              </li>
              <li>
                <a href="mailto:info@xceedindia.com" className="flex items-start gap-3 text-brand-footerText transition-colors hover:text-brand-red">
                  <Mail size={16} className="mt-0.5 shrink-0 text-brand-red" />
                  info@xceedindia.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-brand-footerText">
                <Clock size={16} className="mt-0.5 shrink-0 text-brand-red" />
                Mon &ndash; Sat: 9:00 AM &ndash; 6:00 PM (IST)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black">
        <div className="container-x flex flex-col items-center gap-3 py-4 text-center text-xs text-white/60 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-brand-red" />
            © 2026 XCEED India. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex items-center gap-4">
                {i > 0 && <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />}
                <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-brand-red hover:underline">
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
