import { Handshake, Crown, TrendingUp, Package, Building2, Percent, Globe2, Users, Ship, Lightbulb, Link2, Plane } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MembershipForm from '@/components/MembershipForm';

const BENEFITS = [
  { icon: TrendingUp, text: 'Generate new business opportunities with Japan' },
  { icon: Package, text: 'Find the right suppliers & business solutions' },
  { icon: Building2, text: 'Connect with verified Japanese companies' },
  { icon: Percent, text: 'Exclusive member discounts and priority assistance' },
  { icon: Globe2, text: 'Access the XCEED India–Japan Business Network' },
  { icon: Users, text: 'Business matchmaking & networking opportunities' },
  { icon: Ship, text: 'Support for Import, Export & Global Sourcing' },
  { icon: Lightbulb, text: 'Expert guidance for expanding in Japan' },
];

const BENEFIT_CARDS = [
  { icon: Link2, label: 'Connect' },
  { icon: Users, label: 'Collaborate' },
  { icon: Package, label: 'Import' },
  { icon: Plane, label: 'Export' },
];

export default function MembershipRegisterPage() {
  return (
    <main>
      <Header />

      <section className="bg-gradient-to-br from-[#EAF2FF] via-white to-[#DCEAFE] pb-16 pt-14">
        <div className="container-x text-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Handshake size={32} />
            </span>
            <h1 className="text-4xl font-bold italic leading-[1.15] tracking-tight text-brand-black sm:text-5xl md:text-6xl">
              India &ndash; Japan Business Connection
            </h1>
          </div>

          <div className="mx-auto mt-6 max-w-xl">
            <p className="text-lg font-semibold leading-relaxed text-brand-charcoal sm:text-xl">
              Grow Your Business with Japan &amp; India, Together.
            </p>
            <p className="mt-3 text-base leading-relaxed text-brand-slate">
              Join XCEED India Membership and unlock global opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 flex items-center justify-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500">
                  <Crown size={18} />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-brand-black">Membership Benefits</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                      <Icon size={18} />
                    </span>
                    <p className="pt-1.5 text-sm leading-snug text-brand-charcoal">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {BENEFIT_CARDS.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className="flex h-full flex-col items-center rounded-2xl border border-black/[0.07] bg-white p-6 text-center shadow-[0_12px_32px_-24px_rgba(7,28,58,0.28)]"
                >
                  <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
                    <span
                      className="absolute inset-0 rounded-full bg-brand-red/10 animate-haloPulse motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 0.3}s` }}
                      aria-hidden
                    />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/20">
                      <Icon
                        size={32}
                        className="text-brand-red animate-floatSoft motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    </div>
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-wide text-brand-black">{label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <MembershipForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
