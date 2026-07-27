import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}

export default function StatCard({ icon: Icon, label, value, hint, href }: StatCardProps) {
  const content = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
        <Icon size={20} />
      </span>
      <p className="mt-4 text-2xl font-bold tracking-tight text-brand-black">{value}</p>
      <p className="text-sm text-brand-slate">{label}</p>
      {hint && <p className="mt-1 text-xs text-brand-slate/70">{hint}</p>}
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card accent className="p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card accent className="p-5 hover:shadow-md">
      {content}
    </Card>
  );
}
