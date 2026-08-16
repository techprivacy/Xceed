import Link from 'next/link';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '@/components/ui/Card';

type Tone = 'red' | 'blue' | 'navy' | 'green' | 'amber';

const TONE_CLASSES: Record<Tone, string> = {
  red: 'bg-brand-red/10 text-brand-red',
  blue: 'bg-brand-blue/10 text-brand-blue',
  navy: 'bg-brand-navy/10 text-brand-navy',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: Tone;
  // Optional trend badge, e.g. { value: '+12%', positive: true } — only
  // rendered when real data backs it; never fabricated.
  trend?: { value: string; positive: boolean };
}

export default function StatCard({ icon: Icon, label, value, hint, href, tone = 'red', trend }: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${TONE_CLASSES[tone]}`}>
          <Icon size={28} strokeWidth={2} />
        </span>
        {trend && (
          <span
            className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-bold ${
              trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {trend.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight text-brand-black">{value}</p>
      <p className="mt-1 text-sm font-medium text-brand-slate">{label}</p>
      {hint && <p className="mt-1 text-xs text-brand-slate/70">{hint}</p>}
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card accent className="h-full p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md sm:p-6">
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card accent className="h-full p-5 hover:shadow-md sm:p-6">
      {content}
    </Card>
  );
}
