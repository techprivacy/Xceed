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

      <section className="bg-white py-14">
        <div className="container-x">
          <div className="rounded-2xl border-y-2 border-brand-red bg-white px-6 py-10 shadow-sm sm:px-10">
            <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
              {STATS_BAR.map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="relative mb-5 flex h-28 w-28 items-center justify-center">
                    <span
                      className="absolute inset-0 rounded-full bg-brand-red/10 animate-haloPulse motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 0.3}s` }}
                      aria-hidden
                    />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-red/20">
                      <Icon
                        size={48}
                        className="text-brand-red animate-floatSoft motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-brand-black">{label}</h3>
                </div>
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
