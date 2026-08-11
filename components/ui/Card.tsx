import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: boolean;
}

export default function Card({ children, accent = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-black/[0.07] bg-white shadow-[0_12px_32px_-24px_rgba(7,28,58,0.28)] transition-all duration-300 ease-out ${
        accent ? 'hover:-translate-y-1 hover:border-brand-red/20 hover:shadow-[0_24px_44px_-28px_rgba(7,28,58,0.36)]' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
