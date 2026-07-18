import Image from 'next/image';
import { ShieldCheck, Truck, Award, ArrowRight, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

const FEATURES = [
  { icon: ShieldCheck, title: 'Japanese Quality', subtitle: 'Imported Standards' },
  { icon: Truck, title: 'Pan India Delivery', subtitle: 'Fast & Reliable' },
  { icon: Award, title: '20+ Years of Trust', subtitle: 'Proven Excellence' },
];

const SHOWCASE_CARDS = [
  {
    label: 'Cast Letters',
    image: 'https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=300&h=260&fit=crop',
  },
  {
    label: 'Magnetic Holder',
    image: 'https://images.unsplash.com/photo-1611288870280-4a322b8ec7ec?w=300&h=260&fit=crop',
  },
  {
    label: 'Custom Jig',
    image: 'https://images.unsplash.com/photo-1711418235334-8895331a6cf9?w=300&h=260&fit=crop',
  },
  {
    label: 'Marking Tools',
    image: 'https://images.unsplash.com/photo-1764114441123-586d13fc6ece?w=300&h=260&fit=crop',
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-black">
      <Image
        src="https://images.unsplash.com/photo-1765666328327-067203cc3157?w=1920&h=1000&fit=crop"
        alt="Industrial cast metal letters and marking tools"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-brand-black/25"
        aria-hidden
      />

      <div className="container-x relative grid min-h-[420px] grid-cols-1 gap-10 py-14 lg:min-h-[520px] lg:grid-cols-[1fr_auto] lg:items-end lg:py-20">
        <div className="max-w-2xl">
          <span className="mb-6 inline-flex items-center rounded-full border border-brand-red/40 bg-brand-red/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-red">
            Precision Marking Solutions
          </span>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl">
            Precision that leaves a <span className="text-brand-red">permanent mark.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            Japanese-quality industrial cast letters, numbers, holders and marking tools for
            manufacturing, steel, fabrication and engineering industries.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon size={26} className="mt-0.5 shrink-0 text-brand-red" />
                <div>
                  <p className="text-base font-semibold leading-tight text-white">{title}</p>
                  <p className="text-sm text-white/55">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-5">
            <Button href="/products" variant="primary" size="md" className="uppercase tracking-wide">
              Explore Products <ArrowRight size={18} />
            </Button>
            <Button href="/contact-us" variant="ghost-light" size="md" className="uppercase tracking-wide">
              <FileText size={18} /> Get Bulk Quote
            </Button>
          </div>
        </div>

        <div className="hidden gap-4 lg:flex">
          {SHOWCASE_CARDS.map((card) => (
            <div
              key={card.label}
              className="w-[130px] overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm"
            >
              <div className="relative h-28 w-full">
                <Image src={card.image} alt={card.label} fill sizes="130px" className="object-cover" />
              </div>
              <p className="border-t-2 border-brand-red bg-brand-black/80 px-2 py-2.5 text-center text-xs font-semibold text-white">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
