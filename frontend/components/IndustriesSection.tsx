import Image from 'next/image';
import { INDUSTRIES } from '@/lib/staticData';

export default function IndustriesSection() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-brand-blue">
            Industry Applications
          </span>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-gray-900">
            Built for India&apos;s Industrial Workforce
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Our marking solutions are trusted by thousands of industries across India for their
            daily marking, identification and traceability needs.
          </p>
          <a
            href="/industries"
            className="mt-6 inline-block rounded border border-brand-blue px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-blue shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-blue hover:text-white hover:shadow-md hover:shadow-brand-blue/30"
          >
            Explore Industries →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {INDUSTRIES.map((industry) => (
            <div
              key={industry.name}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-brand-charcoal to-brand-black">
                <Image
                  src={industry.image}
                  alt={industry.name}
                  fill
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="p-3 text-center text-xs font-semibold text-gray-800">
                {industry.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
