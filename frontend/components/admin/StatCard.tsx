import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
        <Icon size={20} />
      </span>
      <p className="mt-4 text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
