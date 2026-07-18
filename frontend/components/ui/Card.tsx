import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: boolean;
}

export default function Card({ children, accent = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-200 ${
        accent ? 'hover:shadow-lg hover:shadow-brand-red/10' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
