import { Award, ShieldCheck, Truck } from 'lucide-react';
import Card from '@/components/ui/Card';

const REASONS = [
  {
    icon: Award,
    title: '20+ Years of Trust',
    text: 'Trusted by more than 2,000 manufacturers and foundries across India and Japan, XCEED delivers high-quality industrial marking solutions backed by over 20 years of expertise.',
  },
  {
    icon: ShieldCheck,
    title: 'Industrial Ready',
    text: 'Built with Japanese-quality materials and precision engineering to deliver outstanding durability, consistent accuracy, and long-lasting performance in the most demanding industrial environments.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    text: 'Fast and reliable delivery across India and Japan, supported by a trusted logistics network and priority service for manufacturers, foundries, and industrial businesses.',
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-white py-14">
      <div className="container-x">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-brand-black sm:text-4xl md:text-5xl">
            Why Choose <span className="text-brand-red">XCEED</span> India?
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-black/10" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            <span className="h-0.5 w-10 rounded-full bg-brand-red" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            <span className="h-px w-10 bg-black/10" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, text }, i) => (
            <Card
              key={title}
              className="group relative text-center shadow-md"
              style={{ padding: 'clamp(1.75rem, 1.2rem + 2vw, 2.5rem)' }}
            >
              {/* Outer halo is decorative and animates on its own; the inner
                  disc + glyph scale together on hover so they stay concentric.
                  Everything is sized off one clamp()'d wrapper so the whole
                  icon stack scales smoothly with viewport width. */}
              <div
                className="relative mx-auto mb-6 flex items-center justify-center"
                style={{ width: 'clamp(6.5rem, 4.5rem + 9vw, 12rem)', height: 'clamp(6.5rem, 4.5rem + 9vw, 12rem)' }}
              >
                <span
                  className="absolute inset-0 rounded-full bg-brand-blue/10 animate-haloPulse motion-reduce:animate-none"
                  style={{ animationDelay: `${i * 0.4}s` }}
                  aria-hidden
                />
                <div
                  className="relative flex items-center justify-center rounded-full bg-brand-blue/20 transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ width: '80%', height: '80%' }}
                >
                  <Icon
                    className="text-brand-blue animate-floatSoft transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:animate-none"
                    style={{ width: '60%', height: '60%', animationDelay: `${i * 0.4}s` }}
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-brand-black">{title}</h3>
              <span className="mx-auto mt-2 block h-0.5 w-8 rounded-full bg-brand-blue" />
              <p className="mt-4 text-sm leading-relaxed text-brand-slate">{text}</p>
              <span className="absolute inset-x-8 -bottom-1 h-1 rounded-full bg-brand-blue/70" aria-hidden />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
