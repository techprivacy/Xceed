interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-brand-black">{title}</h1>
        {subtitle && <p className="text-sm text-brand-slate">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
