interface Bar {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  bars: Bar[];
  defaultColor?: string;
}

// Simple horizontal bar chart, plain divs — proportional to the largest
// value in the set. Good enough for a handful of comparison bars without
// pulling in a charting library.
export default function BarChart({ bars, defaultColor = 'var(--color-primary)' }: BarChartProps) {
  const max = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div className="space-y-3.5">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-brand-charcoal">{bar.label}</span>
            <span className="font-bold text-brand-black">{bar.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-mist">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.max(3, (bar.value / max) * 100)}%`,
                backgroundColor: bar.color ?? defaultColor,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
