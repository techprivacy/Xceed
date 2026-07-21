import { Award, ShieldCheck, Truck } from 'lucide-react';
import Card from '@/components/ui/Card';

const REASONS = [
  {
    icon: Award,
    title: 'Japanese Precision',
    text: 'Every product is manufactured with Japanese quality standards to ensure accuracy, durability and consistency.',
  },
  {
    icon: ShieldCheck,
    title: 'Industrial Ready',
    text: 'Built with premium materials and engineered for tough industrial environments and heavy usage.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    text: 'Pan-India delivery network with priority delivery and member shipping benefits.',
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-brand-mist py-14">
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
          {REASONS.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="relative p-10 text-center shadow-md">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-brand-red/10">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-red/20">
                  <Icon size={48} className="text-brand-red" />
                </div>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-brand-black">{title}</h3>
              <span className="mx-auto mt-2 block h-0.5 w-8 rounded-full bg-brand-red" />
              <p className="mt-4 text-sm leading-relaxed text-brand-slate">{text}</p>
              <span className="absolute inset-x-8 -bottom-1 h-1 rounded-full bg-brand-red/70" aria-hidden />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
