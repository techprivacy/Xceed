const TONE_STYLES: Record<string, string> = {
  gray: 'bg-brand-mist text-brand-slate',
  blue: 'bg-blue-100 text-brand-blue',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
};

export default function StatusBadge({
  label,
  tone = 'gray',
}: {
  label: string;
  tone?: keyof typeof TONE_STYLES;
}) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_STYLES[tone]}`}>{label}</span>
  );
}
