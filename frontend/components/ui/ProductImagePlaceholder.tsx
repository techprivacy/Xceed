export default function ProductImagePlaceholder({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="text-brand-slate/40">
      <rect x="8" y="20" width="48" height="24" rx="3" fill="currentColor" opacity="0.5" />
      <rect x="16" y="8" width="12" height="16" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="36" y="8" width="12" height="16" rx="2" fill="currentColor" opacity="0.8" />
    </svg>
  );
}
