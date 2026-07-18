import { Users, Medal, Package, Truck, Headset } from 'lucide-react';

function ToriiGate({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
  { icon: Users, title: '5000+', subtitle: 'Happy Customers' },
  { icon: Medal, title: '20+', subtitle: 'Years Experience' },
  { icon: Package, title: '100+', subtitle: 'Products' },
  { icon: Truck, title: 'Pan India', subtitle: 'Delivery' },
  { icon: Headset, title: 'Bulk Order', subtitle: 'Support' },
];

export default function TrustBar() {
  return (
    <div className="container-x relative z-10 -mt-8 md:-mt-10">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-3xl border border-black/5 bg-white px-6 py-6 shadow-xl shadow-black/10 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:px-8">
        {STATS.map(({ icon: Icon, title, subtitle }) => (
          <div key={subtitle} className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red md:h-16 md:w-16">
              <Icon size={34} />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-brand-black md:text-lg">{title}</p>
              <p className="text-sm text-brand-slate">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
