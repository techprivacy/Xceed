import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck, FileText, RefreshCcw } from 'lucide-react';

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
    <footer className="relative overflow-hidden bg-brand-black text-white">
      <div className="h-1 bg-brand-red" />

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[32%] lg:block"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
            maskImage: 'linear-gradient(to right, black, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to right, black, transparent 85%)',
          }}
          aria-hidden
        >
          <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full">
            <path d="M95 90 C 45 160, 30 220, 68 258" stroke="#E53935" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M68 258 C 88 300, 118 300, 112 250" stroke="#E53935" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M95 90 C 132 158, 132 208, 112 250" stroke="#E53935" strokeWidth="1.5" fill="none" opacity="0.7" />
            <circle cx="95" cy="90" r="9" fill="#E53935" opacity="0.25" />
            <circle cx="68" cy="258" r="9" fill="#E53935" opacity="0.25" />
            <circle cx="112" cy="250" r="9" fill="#E53935" opacity="0.25" />
            <circle cx="95" cy="90" r="4" fill="#E53935" />
            <circle cx="68" cy="258" r="4" fill="#E53935" />
            <circle cx="112" cy="250" r="4" fill="#E53935" />
          </svg>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] overflow-hidden lg:block" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-l from-black via-brand-charcoal/70 to-transparent" />
          <span className="absolute -right-10 top-1/2 -translate-y-1/2 select-none font-serif text-[20rem] font-black leading-none text-white/[0.05]">
            X
          </span>
          <div className="absolute inset-0 rotate-12 bg-gradient-to-tr from-transparent via-brand-red/20 to-transparent" />
          <div className="absolute inset-0 -rotate-6 bg-gradient-to-tr from-transparent via-brand-red/10 to-transparent" />
        </div>

        <div className="container-x relative z-10 flex flex-col items-center py-14 text-center">
          <span className="font-serif text-4xl font-bold tracking-wide text-white sm:text-5xl">XCEED</span>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
            Beyond Your Expectations
          </p>
          <div className="mt-4 h-0.5 w-10 rounded-full bg-brand-red" />
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-footerText">
            XCEED India delivers premium Japanese-quality industrial marking solutions, including
            cast letters, holders, jigs, and magnetic tools, trusted by manufacturing industries
            across India.
          </p>
          <div className="mt-6 flex justify-center gap-3">
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
