import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/seo/JsonLd';
import { INDUSTRIES } from '@/lib/staticData';
import { buildMetadata, noIndexMetadata, breadcrumbJsonLd } from '@/lib/seo';

interface IndustryContent {
  tagline: string;
  intro: ReactNode;
  whyItMattersHeading: string;
  whyItMatters: string[];
  whyXceed: ReactNode;
  closingTagline: string;
  ctaLabel: string;
}

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-brand-black">{children}</strong>
);

const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  'steel-plants': {
    tagline: 'Precision Identification for Steel Manufacturing',
    intro: (
      <>
        <p>
          Steel plants handle heavy, high-temperature and continuously moving materials where{' '}
          <B>clear identification and traceability are essential</B>.
        </p>
        <p>
          From steel products and sections to production batches and material identification, durable marking
          helps operators identify products quickly throughout the manufacturing and handling process.
        </p>
      </>
    ),
    whyItMattersHeading: 'Why It Matters',
    whyItMatters: [
      'Clear product and batch identification',
      'Durable marking for demanding environments',
      'Faster material identification',
      'Improved production traceability',
      'Reduced identification errors',
    ],
    whyXceed: (
      <p>
        XCEED provides <B>Japanese-quality cast letters, cast numbers, holders and magnetic tools</B> designed
        for industrial marking applications.
      </p>
    ),
    closingTagline: 'Built for demanding steel environments.',
    ctaLabel: 'Explore Solutions',
  },
  'fabrication-units': {
    tagline: 'Reliable Marking for Fabrication & Metalwork',
    intro: (
      <p>
        Fabrication companies work with steel plates, structures, components and assemblies that require{' '}
        <B>clear identification during production, inspection and dispatch</B>.
      </p>
    ),
    whyItMattersHeading: 'Why It Matters',
    whyItMatters: [
      'Identify plates, components and assemblies',
      'Maintain job and batch traceability',
      'Reduce production confusion',
      'Improve workshop efficiency',
      'Support accurate inspection and dispatch',
    ],
    whyXceed: (
      <p>
        XCEED marking solutions provide a{' '}
        <B>simple, repeatable and durable method of identifying metal components</B> throughout fabrication
        operations.
      </p>
    ),
    closingTagline: 'Mark it clearly. Track it confidently.',
    ctaLabel: 'Explore Solutions',
  },
  automotive: {
    tagline: 'Precision Identification for Automotive Manufacturing',
    intro: (
      <>
        <p>
          Automotive manufacturing demands <B>accuracy, repeatability and traceability</B> across components,
          assemblies and production processes.
        </p>
        <p>
          Cast and metal components often require reliable identification throughout manufacturing, inspection
          and logistics.
        </p>
      </>
    ),
    whyItMattersHeading: 'Why It Matters',
    whyItMatters: [
      'Component identification',
      'Production traceability',
      'Batch and part identification',
      'Faster inspection and handling',
      'Reduced identification errors',
    ],
    whyXceed: (
      <p>
        With Japanese precision technology and more than 20 years of industrial experience, XCEED provides
        durable marking solutions for demanding automotive environments.
      </p>
    ),
    closingTagline: 'Precision that supports production.',
    ctaLabel: 'Explore Solutions',
  },
  foundries: {
    tagline: 'Built for the Foundry Industry',
    intro: (
      <p>
        Foundries produce components where <B>identification, traceability and process control</B> are critical
        from casting through finishing and dispatch.
      </p>
    ),
    whyItMattersHeading: 'Why Marking Matters in Foundries',
    whyItMatters: [
      'Identify casting numbers and grades',
      'Track batches and production lots',
      'Support quality control',
      'Improve component traceability',
      'Simplify inspection and dispatch',
    ],
    whyXceed: (
      <>
        <p>
          XCEED specializes in <B>cast letters and cast numbers</B> designed for industrial applications,
          supported by holders and magnetic tools for efficient positioning and marking.
        </p>
        <p>
          With a network of <B>2,000+ manufacturers and foundries</B> and 20+ years of industry experience,
          XCEED understands the requirements of industrial marking.
        </p>
      </>
    ),
    closingTagline: 'Made for the foundry floor.',
    ctaLabel: 'Explore Foundry Solutions',
  },
  warehouses: {
    tagline: 'Clear Identification. Faster Operations.',
    intro: (
      <p>
        Modern warehouses depend on accurate identification to manage{' '}
        <B>materials, components, batches and inventory efficiently</B>.
      </p>
    ),
    whyItMattersHeading: 'Why It Matters',
    whyItMatters: [
      'Identify stored materials',
      'Improve inventory organization',
      'Reduce picking errors',
      'Support material traceability',
      'Improve warehouse efficiency',
    ],
    whyXceed: (
      <p>
        XCEED provides durable industrial marking solutions that help businesses maintain{' '}
        <B>clear and consistent identification</B> across materials and components.
      </p>
    ),
    closingTagline: 'Better identification. Better control.',
    ctaLabel: 'Explore Solutions',
  },
  'engineering-units': {
    tagline: 'Precision Marking for Engineering Applications',
    intro: (
      <p>
        Engineering units handle a wide range of components, tools, assemblies and fabricated parts where{' '}
        <B>accurate identification is essential</B>.
      </p>
    ),
    whyItMattersHeading: 'Why It Matters',
    whyItMatters: [
      'Part and component identification',
      'Drawing and job reference marking',
      'Production traceability',
      'Inspection support',
      'Easier handling and organization',
    ],
    whyXceed: (
      <p>
        XCEED&apos;s industrial marking range is designed for{' '}
        <B>repeatable, accurate and durable identification</B> across engineering environments.
      </p>
    ),
    closingTagline: 'Precision for every component.',
    ctaLabel: 'Explore Solutions',
  },
  'packaging-lines': {
    tagline: 'Reliable Identification for Packaging Operations',
    intro: (
      <p>
        Packaging lines require speed, consistency and clear identification. Whether handling industrial
        products, components or finished goods, reliable marking helps maintain{' '}
        <B>product and batch traceability</B>.
      </p>
    ),
    whyItMattersHeading: 'Why It Matters',
    whyItMatters: [
      'Batch identification',
      'Product identification',
      'Production tracking',
      'Faster handling',
      'Reduced identification errors',
    ],
    whyXceed: (
      <p>
        XCEED provides practical marking tools designed for{' '}
        <B>fast and repeatable industrial applications</B>, helping operators maintain consistent identification.
      </p>
    ),
    closingTagline: 'Keep production moving. Keep identification clear.',
    ctaLabel: 'Explore Solutions',
  },
  'manufacturing-facilities': {
    tagline: 'Industrial Marking for Modern Manufacturing',
    intro: (
      <>
        <p>
          Manufacturing facilities need reliable identification across{' '}
          <B>raw materials, components, work-in-progress and finished products</B>.
        </p>
        <p>
          Clear marking supports production efficiency and helps maintain traceability throughout the
          manufacturing cycle.
        </p>
      </>
    ),
    whyItMattersHeading: 'Why It Matters',
    whyItMatters: [
      'Product and component identification',
      'Batch traceability',
      'Production control',
      'Quality and inspection support',
      'Faster material handling',
    ],
    whyXceed: (
      <p>
        XCEED combines{' '}
        <B>Japanese precision technology, industrial-grade materials and 20+ years of experience</B> to provide
        dependable marking solutions for manufacturers across India and Japan.
      </p>
    ),
    closingTagline: 'Industrial marking built for real production environments.',
    ctaLabel: 'Explore Solutions',
  },
};

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.urlSlug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const industry = INDUSTRIES.find((i) => i.urlSlug === params.slug);
  const content = INDUSTRY_CONTENT[params.slug];
  if (!industry || !content) return noIndexMetadata('Industry Not Found');
  return buildMetadata({
    title: `Marking Solutions for ${industry.name}`,
    description: content.tagline,
    path: `/industries/${industry.urlSlug}`,
  });
}

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const industry = INDUSTRIES.find((i) => i.urlSlug === params.slug);
  const content = INDUSTRY_CONTENT[params.slug];
  if (!industry || !content) notFound();

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
          { name: industry.name, path: `/industries/${industry.urlSlug}` },
        ])}
      />
      <Header />

      <section className="bg-brand-mist py-14">
        <div className="container-x text-center">
          <span className="mb-3 inline-flex items-center rounded-full border border-brand-red/10 bg-brand-red/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-red">
            Industry Applications
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-black sm:text-5xl">
            {industry.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg font-semibold text-brand-blue">{content.tagline}</p>
          <div className="mx-auto mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-brand-slate">
            {content.intro}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="relative h-64 overflow-hidden rounded-3xl lg:h-full lg:min-h-[320px]">
              <Image
                src={industry.image}
                alt={industry.name}
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-brand-black">{content.whyItMattersHeading}</h2>
              <ul className="mt-5 space-y-3">
                {content.whyItMatters.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-red" />
                    <span className="text-sm leading-relaxed text-brand-charcoal">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <Card
            className="mx-auto max-w-3xl text-center"
            style={{ padding: 'clamp(1.75rem, 1.2rem + 2vw, 3rem)' }}
          >
            <h2 className="text-xl font-bold tracking-tight text-brand-black">Why XCEED?</h2>
            <div className="mx-auto mt-4 max-w-2xl space-y-3 text-base leading-relaxed text-brand-slate">
              {content.whyXceed}
            </div>
            <p className="mt-6 text-lg font-bold text-brand-black">{content.closingTagline}</p>
            <Button href="/products" variant="primary" size="lg" className="mt-6">
              {content.ctaLabel}
            </Button>
          </Card>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-blue to-brand-blueDark py-16 text-center text-white">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Need a Better Industrial Marking Solution?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              Whether you operate a{' '}
              <strong className="font-semibold text-white">
                steel plant, foundry, automotive facility, fabrication unit or manufacturing plant
              </strong>
              , XCEED can help you improve identification, marking and traceability.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
              Japanese Precision. Industrial Reliability.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/products" variant="primary" size="lg" className="shadow-xl">
                View Products
              </Button>
              <Button href="/contact-us" variant="ghost-light" size="lg">
                Talk to XCEED
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
