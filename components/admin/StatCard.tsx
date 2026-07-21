import { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card accent className="p-5 hover:shadow-md">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
        <Icon size={20} />
      </span>
      <p className="mt-4 text-2xl font-bold tracking-tight text-brand-black">{value}</p>
      <p className="text-sm text-brand-slate">{label}</p>
      {hint && <p className="mt-1 text-xs text-brand-slate/70">{hint}</p>}
    </Card>
  );
}
