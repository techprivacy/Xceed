import { Award, ShieldCheck, Truck } from 'lucide-react';

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
    <section className="bg-gray-50 py-14">
      <div className="container-x">
        <h2 className="mb-10 text-center text-2xl font-extrabold text-gray-900">
          Why Choose XCEED India?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-gray-100 bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Icon size={26} className="text-brand-red" />
              </div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
