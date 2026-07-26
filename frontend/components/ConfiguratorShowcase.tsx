import Link from 'next/link';
import { Type, Hash, Layers, ArrowRight } from 'lucide-react';

const CONFIGURATORS = [
  {
    href: '/cast-letters',
    icon: Type,
    title: 'Cast Letter Builder',
    text: 'Pick a size, choose convex or concave, and build your letter set with live pricing.',
  },
  {
    href: '/cast-numbers',
    icon: Hash,
    title: 'Cast Number Builder',
    text: 'Configure cast numbers 0–9 the same way, with instant totals as you build.',
  },
  {
    href: '/holders',
    icon: Layers,
    title: 'Holder Configurator',
    text: 'Design square or oval holders, choose glue or screw fitting, and see pricing update live.',
  },
];

export default function ConfiguratorShowcase() {
  return (
    <section className="bg-brand-navy py-14">
      <div className="container-x">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-blue">Build It Online</span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Configure Your Marking Tools in Real Time
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CONFIGURATORS.map(({ href, icon: Icon, title, text }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-200 hover:bg-white/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/15 text-brand-red">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
              <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-red">
                Start Configuring
                <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
