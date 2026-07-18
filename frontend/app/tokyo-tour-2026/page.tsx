import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import TokyoTourEnquiryForm from '@/components/TokyoTourEnquiryForm';
import { HIGHLIGHTS, FOUNDRY_VISITS, ITINERARY, INCLUSIONS } from '@/lib/tokyoTourData';

export default function TokyoTourPage() {
  return (
    <main>
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy">
        <Image
          src="https://images.unsplash.com/photo-1762018824220-d4a9ebda2b28?w=1600&h=900&fit=crop"
          alt="Mount Fuji, pagoda and cherry blossoms, Japan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/40" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-red blur-3xl" />
        </div>

        <div className="container-x relative py-20 pb-28 md:py-28 md:pb-36">
          <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Connect &middot; Collaborate &middot; Excel
          </span>
          <p className="text-lg font-semibold uppercase tracking-wide text-white/80 md:text-xl">
            Japan Foundry Immersion 2026
          </p>
          <h1 className="mt-1 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
            Tokyo<span className="text-brand-red">.</span> Japan
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            <span className="font-semibold text-white">10 Days. Home to Home. Where Business Meets Culture.</span>{' '}
            Discover world-class foundries, build global partnerships, and experience the innovation of Japan
            with XCEED India&apos;s exclusive industrial tour.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {['Flight', 'Visa', 'Foundry Expo', 'Business Hotels'].map((tag) => (
              <span
                key={tag}
                className="animate-pulse rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-red/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#enquiry" variant="primary">
              Confirm Booking
            </Button>
            <Button href="#itinerary" variant="ghost-light">
              View Itinerary
            </Button>
          </div>

          <a
            href="/tokyo-tour-2026/poster"
            className="mt-6 inline-block text-sm font-semibold text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white"
          >
            View printable poster &rarr;
          </a>
        </div>
      </section>

      {/* Highlights — floating card overlapping the hero */}
      <section className="relative z-10 -mt-16 md:-mt-20">
        <div className="container-x">
          <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                    <Icon size={36} />
                  </div>
                  <p className="text-xs font-semibold leading-snug text-brand-charcoal">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Connect */}
      <section className="relative overflow-hidden bg-brand-navy pb-16 pt-20 md:pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden>
          <Image
            src="https://images.unsplash.com/photo-1751607238847-6b55276e4b44?w=1600&h=900&fit=crop"
            alt=""
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-brand-navy/40" />
        </div>
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Industry Connect"
            title="Exclusive Visits to 4 World-Class Foundry Companies"
            subtitle="Get an exclusive behind-the-scenes experience with Japan's leading foundry innovators."
            light
          />

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FOUNDRY_VISITS.map((visit) => (
              <div
                key={visit.title}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={visit.image}
                    alt={visit.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-brand-black">{visit.title}</h3>
                  <p className="mt-1 text-xs text-brand-slate">{visit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section id="itinerary" className="bg-brand-mist py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="10-Day Itinerary"
            eyebrowClassName="text-lg font-semibold italic"
            title="Itinerary Overview"
            align="center"
          />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {ITINERARY.map(({ day, icon: Icon, title, text }) => (
              <div
                key={day}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between bg-brand-navy px-4 py-3">
                  <span className="text-lg font-bold text-white">Day {day}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-brand-red">
                    <Icon size={18} />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold leading-snug text-brand-black">{title}</h3>
                  <p className="mt-1 text-xs text-brand-slate">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-14">
        <div className="container-x grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 h-72 overflow-hidden rounded-2xl lg:order-1 lg:h-full lg:min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1751607238847-6b55276e4b44?w=900&h=1100&fit=crop"
              alt="Japanese Shinkansen bullet train at a station"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="Package" eyebrowClassName="text-lg font-semibold" title="What's Included" />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {INCLUSIONS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-brand-mist p-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white text-brand-red shadow-sm">
                    <Icon size={26} />
                  </span>
                  <p className="text-base font-semibold leading-snug text-brand-charcoal">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="relative overflow-hidden border-t border-black/5 bg-white py-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.09]" aria-hidden>
          <Image
            src="https://images.unsplash.com/photo-1522518961115-07c922089dd4?w=1600&h=900&fit=crop"
            alt=""
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-white/50" />
        </div>
        <div className="container-x relative flex flex-col items-center">
          <p className="mb-8 text-center text-2xl font-bold tracking-tight text-brand-navy md:text-3xl">
            Experience Japan. <span className="text-brand-red">Empower your business.</span>
          </p>
          <div className="w-full max-w-xl">
            <TokyoTourEnquiryForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
