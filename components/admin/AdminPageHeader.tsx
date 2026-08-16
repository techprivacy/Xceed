interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-black sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-brand-slate">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
