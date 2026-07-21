import Image from 'next/image';
import {
  Handshake,
  Crown,
  TrendingUp,
  Package,
  Building2,
  Percent,
  Globe2,
  Users,
  Ship,
  Lightbulb,
  Link2,
  Plane,
  Gem,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
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

const QUICK_LINKS = [
  { icon: Link2, label: 'Connect' },
  { icon: Users, label: 'Collaborate' },
  { icon: Package, label: 'Import' },
  { icon: Plane, label: 'Export' },
  { icon: TrendingUp, label: 'Grow with Japan' },
];

const STATS_BAR = [
  { icon: Building2, label: 'Global Business Network' },
  { icon: Handshake, label: 'Trusted Partnership' },
  { icon: Gem, label: 'Exclusive Opportunities' },
  { icon: Globe2, label: 'India – Japan Growth' },
];

export default function MembershipPage() {
  return (
    <main>
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF2FF] via-white to-[#DCEAFE] pb-16 pt-14">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block" aria-hidden>
          <Image
            src="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&h=1400&fit=crop"
            alt=""
            fill
            sizes="50vw"
            className="object-cover object-left opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
        </div>

        <div className="container-x relative">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white/80 px-4 py-1.5 text-xs font-semibold text-brand-blueDark shadow-sm">
            <Handshake size={14} className="text-brand-blue" />
            India – Japan Business Connection
          </span>
          <h1 className="max-w-2xl text-3xl font-bold italic leading-[1.15] tracking-tight text-brand-black sm:text-4xl md:text-5xl">
            Grow Your Business with{' '}
            <span className="relative inline-block text-brand-blue">
              Japan
              <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-brand-red" aria-hidden />
            </span>
            , Together.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-slate sm:text-base">
            Join XCEED India Membership and unlock global opportunities.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
            <div>
              <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:p-8">
                <div className="mb-6 flex items-center gap-2.5">
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

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-full bg-white/70 px-6 py-3 text-xs font-semibold text-brand-charcoal shadow-sm">
                {QUICK_LINKS.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <Icon size={14} className="text-brand-blue" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <MembershipForm />
          </div>
        </div>
      </section>

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

      <Footer />
    </main>
  );
}
