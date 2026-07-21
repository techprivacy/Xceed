import { ReactNode } from 'react';

type Tone = 'red' | 'navy' | 'neutral';

const TONE_CLASSES: Record<Tone, string> = {
  red: 'bg-brand-red/10 text-brand-red',
  navy: 'bg-brand-navy text-white',
  neutral: 'bg-brand-mist text-brand-charcoal',
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export default function Badge({ children, tone = 'red', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
