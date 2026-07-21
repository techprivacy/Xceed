import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { INDUSTRIES } from '@/lib/staticData';

export default function IndustriesPage() {
  return (
    <main>
      <SiteHeader />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <SectionHeading
            eyebrow="Industry Applications"
            title="Built for India's Industrial Workforce"
            subtitle="Our marking solutions are trusted by thousands of industries across India for their daily marking, identification and traceability needs."
          />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <Card key={industry.name} accent className="group overflow-hidden p-0 hover:shadow-md">
                <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-brand-charcoal to-brand-black">
                  <Image
                    src={industry.image}
                    alt={industry.name}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="p-4 text-center text-sm font-semibold text-brand-charcoal">{industry.name}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mx-auto max-w-xl text-sm text-brand-slate">
              Don't see your industry listed? We build custom marking solutions for specialised
              applications too.
            </p>
            <Button href="/contact-us" variant="primary" className="mt-5">
              Request a Custom Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
