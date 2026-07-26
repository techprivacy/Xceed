import { CSSProperties } from 'react';
import { Users, Medal, Package, Truck, Headset } from 'lucide-react';

interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

function ToriiGate({ size = 20, className, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h18" />
      <path d="M4 5.5 3 9" />
      <path d="M20 5.5 21 9" />
      <path d="M6 9v11" />
      <path d="M18 9v11" />
      <path d="M4.5 11h15" />
    </svg>
  );
}

const STATS = [
  { icon: ToriiGate, title: 'Japanese', subtitle: 'Technology' },
  { icon: Users, title: '2000+', subtitle: 'Manufacturers & Foundries' },
  { icon: Medal, title: '20+', subtitle: 'Years Experience' },
  { icon: Package, title: '100+', subtitle: 'Products' },
  { icon: Truck, title: 'Delivery Across', subtitle: 'India & Japan' },
  { icon: Headset, title: 'Bulk Order', subtitle: 'Support' },
];

export default function TrustBar() {
  return (
    <div className="container-x relative z-10 -mt-8 md:-mt-10">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-3xl border border-black/5 bg-white px-6 py-6 shadow-xl shadow-black/10 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:px-8">
        {STATS.map(({ icon: Icon, title, subtitle }, i) => (
          <div key={subtitle} className="group flex min-w-0 items-center gap-3">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center md:h-16 md:w-16">
              {/* Halo pulses behind the glyph; the stagger keeps the row from
                  breathing in unison, which reads as a glitch rather than motion. */}
              <span
                className="absolute inset-0 rounded-full bg-brand-red/10 animate-haloPulse motion-reduce:animate-none"
                style={{ animationDelay: `${i * 0.35}s` }}
                aria-hidden
              />
              <Icon
                size={34}
                className="relative text-brand-red animate-floatSoft transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:animate-none"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-base font-bold text-brand-black md:text-lg">{title}</p>
              <p className="text-sm text-brand-slate">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
