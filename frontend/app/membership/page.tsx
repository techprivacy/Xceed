import { Handshake, Building2, Globe2, Gem } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemberDirectory from '@/components/MemberDirectory';
import Button from '@/components/ui/Button';

const STATS_BAR = [
  { icon: Building2, label: 'Global Business Network' },
  { icon: Handshake, label: 'Trusted Partnership' },
  { icon: Gem, label: 'Exclusive Opportunities' },
  { icon: Globe2, label: 'India – Japan Growth' },
];

export default function MembershipPage() {
  return (
    <main>
      <Header />

      <MemberDirectory />

      <section className="bg-brand-navy py-6">
        <div className="container-x flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {STATS_BAR.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm font-medium text-white/90">
                <Icon size={16} className="text-brand-blue" />
                {label}
              </span>
            ))}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold italic text-white">
              XCEED INDIA<span className="text-brand-blue">↗</span>
            </p>
            <p className="text-[11px] uppercase tracking-wide text-white/60">Your Bridge to Japan</p>
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
            <Button href="/membership/register" variant="ghost-light" className="mt-8">
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
