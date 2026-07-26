import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck, FileText, RefreshCcw, Phone, Mail, Clock } from 'lucide-react';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

const MAIN_CATEGORIES = PRODUCT_CATEGORIES.filter(
  (c) => ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'].includes(c.urlSlug)
);

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

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-white">
      <FloatingWhatsApp />

      {/* Molten lava effect background */}
      <div className="relative">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes wave1 {
                0% { d: path('M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z'); }
                50% { d: path('M0,200 Q300,150 600,180 T1200,200 L1200,400 L0,400 Z'); }
                100% { d: path('M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z'); }
              }
              @keyframes wave2 {
                0% { d: path('M0,250 Q300,150 600,220 T1200,250 L1200,400 L0,400 Z'); }
                50% { d: path('M0,250 Q300,180 600,200 T1200,250 L1200,400 L0,400 Z'); }
                100% { d: path('M0,250 Q300,150 600,220 T1200,250 L1200,400 L0,400 Z'); }
              }
              @keyframes wave3 {
                0% { d: path('M0,280 Q300,200 600,250 T1200,280 L1200,400 L0,400 Z'); }
                50% { d: path('M0,280 Q300,220 600,240 T1200,280 L1200,400 L0,400 Z'); }
                100% { d: path('M0,280 Q300,200 600,250 T1200,280 L1200,400 L0,400 Z'); }
              }
              #wave1 { animation: wave1 8s infinite ease-in-out; }
              #wave2 { animation: wave2 7s infinite ease-in-out; }
              #wave3 { animation: wave3 6s infinite ease-in-out; }
            `}</style>
            <linearGradient id="lavaGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#8B0000', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#DC143C', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FF4500', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="lavaGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#DC143C', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#FF6347', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background base */}
          <rect width="1200" height="400" fill="#1a1a1a" />

          {/* Lava waves */}
          <path id="wave3" fill="url(#lavaGradient1)" opacity="0.9" />
          <path id="wave2" fill="url(#lavaGradient2)" opacity="0.8" />
          <path id="wave1" fill="#FF7F50" opacity="0.7" filter="url(#glow)" />

          {/* Glowing highlights */}
          <circle cx="200" cy="150" r="30" fill="#FFD700" opacity="0.4" filter="url(#glow)" />
          <circle cx="600" cy="180" r="40" fill="#FFB90F" opacity="0.3" filter="url(#glow)" />
          <circle cx="1000" cy="120" r="35" fill="#FFA500" opacity="0.35" filter="url(#glow)" />
        </svg>

        <div className="container-x relative z-10 grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="font-serif text-3xl font-bold tracking-wide text-white">XCEED</span>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">
              Beyond Your Expectations
            </p>
            <div className="mt-4 h-0.5 w-10 rounded-full bg-yellow-400" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/90">
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
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Products</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {MAIN_CATEGORIES.map((cat) => (
                <li key={cat.urlSlug}>
                  <a href={`/${cat.urlSlug}`} className="text-white/90 transition-colors hover:text-yellow-400">
                    {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Get In Touch</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a href="tel:+919909611333" className="flex items-start gap-3 text-white/90 transition-colors hover:text-yellow-400">
                  <Phone size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                  +91 99096 11333
                </a>
              </li>
              <li>
                <a href="mailto:info@xceedindia.com" className="flex items-start gap-3 text-white/90 transition-colors hover:text-yellow-400">
                  <Mail size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                  info@xceedindia.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/90">
                <Clock size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                Mon &ndash; Sat: 9:00 AM &ndash; 6:00 PM (IST)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="container-x flex flex-col items-center gap-3 py-4 text-center text-xs text-white/70 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-yellow-400" />
            © 2026 XCEED India. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex items-center gap-4">
                {i > 0 && <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />}
                <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-yellow-400 hover:underline">
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
