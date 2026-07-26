import { ReactNode } from 'react';

type Tone = 'red' | 'navy' | 'neutral' | 'gray' | 'blue' | 'amber' | 'green' | 'purple';

const TONE_CLASSES: Record<Tone, string> = {
  red: 'bg-brand-red/10 text-brand-red',
  navy: 'bg-brand-navy text-white',
  neutral: 'bg-brand-mist text-brand-charcoal',
  gray: 'bg-brand-mist text-brand-slate',
  blue: 'bg-blue-100 text-brand-blue',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export default function Badge({ children, tone = 'red', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.01em] ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
