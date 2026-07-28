const STATS = [
  { title: 'Japanese', subtitle: 'Precision Technology' },
  { title: '2,000+', subtitle: 'Trusted Manufacturers & Foundries' },
  { title: '20+', subtitle: 'Years of Industry Experience' },
  { title: '100+', subtitle: 'Precision Industrial Products' },
  { title: 'India & Japan', subtitle: 'Fast & Reliable Delivery' },
  { title: 'Bulk Orders', subtitle: 'Dedicated Business Support' },
];

export default function TrustBar() {
  return (
    <section className="relative z-10 bg-white">
      <div className="container-x" style={{ paddingTop: 0, paddingBottom: 'clamp(2rem, 2rem + 2vw, 4rem)' }}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {STATS.map(({ title, subtitle }) => (
            <div
              key={subtitle}
              className="group relative flex flex-col items-center justify-start gap-2 overflow-hidden rounded-2xl border border-gray-100 bg-white text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg hover:shadow-black/5"
              style={{ padding: 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem) clamp(1rem, 0.8rem + 1vw, 1.5rem)' }}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-center scale-x-0 bg-brand-blue transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <p
                className="font-extrabold tracking-tight text-[#111827]"
                style={{ fontSize: 'clamp(1.375rem, 1rem + 1.6vw, 2rem)', lineHeight: 1.15 }}
              >
                {title}
              </p>
              <p
                className="font-medium text-[#6B7280]"
                style={{ fontSize: 'clamp(0.8125rem, 0.7rem + 0.4vw, 0.9375rem)', lineHeight: 1.4 }}
              >
                {subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
