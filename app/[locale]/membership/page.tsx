import { Handshake, Globe2, Factory, Settings, Megaphone, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemberDirectory from '@/components/MemberDirectory';
import Button from '@/components/ui/Button';

const MEMBERSHIP_BENEFITS = [
  { icon: Globe2, label: 'Japan–India Business Connections' },
  { icon: Factory, label: 'Industrial Company Network' },
  { icon: Handshake, label: 'Business & Partnership Opportunities' },
  { icon: Settings, label: 'Technology & Supplier Discovery' },
  { icon: Megaphone, label: 'Company & Product Visibility' },
  { icon: TrendingUp, label: 'India Market Opportunities' },
];

const WHO_CAN_JOIN = [
  'Foundries',
  'Manufacturers',
  'Japanese Technology Companies',
  'Machinery Suppliers',
  'Industrial Solution Providers',
];

export default function MembershipPage() {
  return (
    <main>
      <Header />

      <MemberDirectory />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERSHIP_BENEFITS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-blue/20 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <Icon size={22} />
                </span>
                <p className="text-sm font-semibold text-brand-charcoal">{label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl text-center">
            <h2 className="text-xl font-bold tracking-tight text-brand-black">Who Can Join?</h2>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {WHO_CAN_JOIN.map((who) => (
                <span
                  key={who}
                  className="rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-2 text-sm font-semibold text-brand-blue"
                >
                  {who}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-blue to-brand-blueDark py-16 text-center text-white">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Join India&apos;s &amp; Japan&apos;s Most Trusted Manufacturing Network
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              Connect with verified manufacturers, foundries, suppliers, buyers, and industrial partners.
            </p>
            <Button href="/membership/register" variant="primary" size="lg" className="mt-8 shadow-xl">
              Register Today
            </Button>
            <p className="mt-4 text-xs text-white/60">
              Become part of India&apos;s &amp; Japan&apos;s fastest-growing manufacturing and foundry business network.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
