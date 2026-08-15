import { Globe, Award, Package, Route, Handshake, ShieldCheck, Settings, Truck, Headset, LucideIcon } from 'lucide-react';

type Accent = 'navy' | 'red';

// "Japanese / Precision Technology" (the old first tile) moved up into the
// Hero headline itself ("Japanese Engineering") rather than being repeated
// here too — these five are what's left of the brief. `icon` drives both
// the main badge and the faint background watermark; `badgeIcon` is the
// small diamond marker straddling the card's bottom edge.
const STATS: { title: string; subtitle: string; icon: LucideIcon; badgeIcon: LucideIcon; accent: Accent }[] = [
  { title: 'Global Network', subtitle: 'Trusted Manufacturers & Foundries', icon: Globe, badgeIcon: Globe, accent: 'navy' },
  { title: '20+ Years', subtitle: 'Industry Experience', icon: Award, badgeIcon: ShieldCheck, accent: 'red' },
  { title: '100+', subtitle: 'Industrial Solutions', icon: Package, badgeIcon: Settings, accent: 'navy' },
  { title: 'India & Japan', subtitle: 'Fast & Reliable Delivery', icon: Route, badgeIcon: Truck, accent: 'red' },
  { title: 'Bulk Orders', subtitle: 'Dedicated Business Support', icon: Handshake, badgeIcon: Headset, accent: 'navy' },
];

const ACCENT_CLASSES: Record<Accent, { circle: string; text: string; bar: string; ring: string }> = {
  navy: { circle: 'bg-brand-navy', text: 'text-brand-navy', bar: 'bg-brand-navy', ring: 'border-brand-navy/25' },
  red: { circle: 'bg-brand-red', text: 'text-brand-red', bar: 'bg-brand-red', ring: 'border-brand-red/25' },
};

export default function TrustBar() {
  return (
    <section className="relative z-10 bg-white">
      <div
        className="container-x"
        style={{
          paddingTop: 'clamp(2.5rem, 2rem + 2vw, 4rem)',
          paddingBottom: 'clamp(2rem, 1.5rem + 2vw, 3.5rem)',
        }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {STATS.map(({ title, subtitle, icon: Icon, badgeIcon: BadgeIcon, accent }) => {
            const c = ACCENT_CLASSES[accent];
            return (
              <div
                key={subtitle}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-white pb-8 pt-8 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              >
                <Icon
                  aria-hidden
                  className="pointer-events-none absolute -bottom-2 left-1/2 h-24 w-24 -translate-x-1/2 text-gray-100"
                  strokeWidth={1.25}
                />

                <div className="relative">
                  <span className={`absolute -inset-1.5 rounded-full border-2 border-dashed ${c.ring}`} aria-hidden />
                  <span
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full ${c.circle} text-white shadow-md`}
                  >
                    <Icon size={26} />
                  </span>
                </div>

                <p className={`relative mt-5 text-xl font-extrabold uppercase tracking-tight sm:text-2xl ${c.text}`}>
                  {title}
                </p>
                <span className={`relative mt-2 h-0.5 w-8 rounded-full ${c.bar}`} />
                <p className="relative mt-3 px-2 text-sm font-medium text-brand-slate">{subtitle}</p>

                <span className="absolute inset-x-6 bottom-0 h-px bg-gray-100" aria-hidden />
                <span
                  className={`absolute -bottom-4 left-1/2 flex h-8 w-8 -translate-x-1/2 rotate-45 items-center justify-center rounded-md ${c.circle} shadow-md`}
                  aria-hidden
                >
                  <BadgeIcon size={14} className="-rotate-45 text-white" />
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 sm:mt-12">
          <span className="h-px w-10 bg-black/10 sm:w-16" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-slate sm:text-sm">
            Connecting Industry. Delivering Excellence.
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
          <span className="h-px w-10 bg-black/10 sm:w-16" />
        </div>
      </div>
    </section>
  );
}
