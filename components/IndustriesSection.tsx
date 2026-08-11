import Image from 'next/image';
import { INDUSTRIES } from '@/lib/staticData';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function IndustriesSection() {
  return (
    <section className="bg-brand-mist py-14">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div>
          <SectionHeading eyebrow="Industry Applications" title="Built for India's Industrial Workforce" />
          <p className="mt-4 text-sm text-brand-slate">
            Our marking solutions are trusted by thousands of industries across India for their
            daily marking, identification and traceability needs.
          </p>
          <Button href="/industries" variant="ghost" size="sm" className="mt-6">
            Explore Industries →
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {INDUSTRIES.map((industry) => (
            <Card key={industry.name} accent className="group overflow-hidden p-0 hover:shadow-md">
              <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-brand-charcoal to-brand-black">
                <Image
                  src={industry.image}
                  alt={industry.name}
                  fill
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="p-3 text-center text-xs font-semibold text-brand-charcoal">{industry.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
