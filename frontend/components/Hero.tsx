import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <Image
        src="https://images.unsplash.com/photo-1765666328327-067203cc3157?w=1600&h=700&fit=crop"
        alt="Industrial metal stamping and marking"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-blue/30"
        aria-hidden
      />

      <div className="container-x relative py-20 md:py-28">
        <div className="max-w-xl">
          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Precision That Leaves a <span className="text-brand-blue">Permanent Mark.</span>
          </h1>
          <p className="mt-5 text-base text-white/70 md:text-lg">
            Japanese-quality industrial cast letters, numbers, holders and marking tools for
            manufacturing, steel, fabrication and engineering industries.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/products"
              className="rounded bg-gradient-to-r from-brand-blueDark to-brand-blue px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-blueDarker hover:to-brand-blueDarker hover:shadow-xl hover:shadow-brand-blue/40"
            >
              Explore Products
            </a>
            <a
              href="/request-a-quote"
              className="rounded border border-brand-blue bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-blue shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg"
            >
              Request Bulk Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
