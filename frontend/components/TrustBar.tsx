import { ShieldCheck, Truck, Gift, Lock } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, label: 'Japanese Quality Standards' },
  { icon: Truck, label: 'Pan-India Delivery' },
  { icon: Gift, label: 'Bulk Order Support' },
  { icon: Lock, label: 'Secure Payments' },
];

export default function TrustBar() {
  return (
    <div className="bg-brand-charcoal">
      <div className="container-x grid grid-cols-2 gap-4 py-4 text-sm text-white/90 sm:grid-cols-4">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={18} className="shrink-0 text-white/70" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
