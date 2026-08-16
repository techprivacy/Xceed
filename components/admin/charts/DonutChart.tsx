interface Segment {
  label: string;
  value: number;
  color: string; // any valid CSS color
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
}

// Plain SVG donut — no charting library needed for one shape. Each segment
// is drawn as a circle stroked with a dasharray sized to its share of the
// total, offset to continue where the previous segment left off.
export default function DonutChart({ segments, size = 160, thickness = 22 }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F3F5" strokeWidth={thickness} />
        {total > 0 &&
          segments.map((s) => {
            const fraction = s.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return circle;
          })}
      </svg>

      <div className="flex flex-col gap-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-brand-charcoal">{s.label}</span>
            <span className="ml-auto font-bold text-brand-black">{s.value}</span>
          </div>
        ))}
        {total === 0 && <p className="text-sm text-brand-slate">No data yet</p>}
      </div>
    </div>
  );
}
