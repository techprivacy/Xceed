import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'ghost-light';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-brand-red text-white shadow-[0_12px_24px_-12px_color-mix(in_srgb,var(--color-primary)_75%,transparent)] hover:-translate-y-0.5 hover:bg-brand-redDark hover:shadow-[0_18px_28px_-14px_color-mix(in_srgb,var(--color-primary)_90%,transparent)]',
  secondary: 'bg-brand-navy text-white shadow-[0_12px_24px_-14px_rgba(7,28,58,0.7)] hover:-translate-y-0.5 hover:bg-brand-blueDarker',
  ghost: 'border border-black/10 bg-white text-brand-charcoal shadow-sm hover:-translate-y-0.5 hover:border-brand-red/30 hover:bg-brand-mist',
  'ghost-light': 'border border-white/40 bg-white/5 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-brand-black',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3.5 text-sm',
  lg: 'px-10 py-5 text-lg',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;

  if (rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
