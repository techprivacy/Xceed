import { ReactNode } from 'react';

type Size = 'h1' | 'h2';

const TITLE_CLASSES: Record<Size, string> = {
  h1: 'text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-black sm:text-5xl md:text-6xl',
  h2: 'text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-brand-black sm:text-4xl',
};

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowClassName?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  size?: Size;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  eyebrowClassName,
  title,
  subtitle,
  align = 'left',
  size = 'h2',
  light = false,
  className = '',
}: SectionHeadingProps) {
  const Tag = size;
  const eyebrowTypography = eyebrowClassName ?? 'text-[11px] font-bold uppercase tracking-[0.14em]';
  return (
    <div className={`${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <span
          className={`mb-3 inline-flex items-center rounded-full px-3 py-1 ${eyebrowTypography} ${
            light ? 'border border-white/15 bg-white/10 text-white' : 'border border-brand-red/10 bg-brand-red/10 text-brand-red'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <Tag className={light ? TITLE_CLASSES[size].replace('text-brand-black', 'text-white') : TITLE_CLASSES[size]}>
        {title}
      </Tag>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-brand-slate'}`}>{subtitle}</p>
      )}
    </div>
  );
}
