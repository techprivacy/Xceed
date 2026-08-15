import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Trophy, Landmark, Users2, TrendingUp, Rocket } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import { getFeaturedArticle, getLatestArticles } from '@/lib/newsData';

export const metadata: Metadata = {
  title: 'News & Awards',
};

// Awards/milestones stay placeholder copy — real ones get swapped in once
// supplied. Article content (featured + latest) now lives in
// lib/newsData.ts, shared with the /all listing and individual article
// pages so all three can never drift out of sync.
const AWARDS = [
  {
    year: '2026',
    title: 'Industrial Innovation Award',
    text: 'Recognized for innovation in industrial marking and identification solutions.',
    icon: Trophy,
  },
  {
    year: '2025',
    title: 'Japan–India Business Excellence',
    text: 'Recognized for strengthening industrial collaboration between Japan and India.',
    icon: Award,
  },
  {
    year: '2025',
    title: 'Manufacturing Partner Award',
    text: 'Awarded for reliable support to manufacturers and foundries.',
    icon: Trophy,
  },
  {
    year: '2024',
    title: 'Excellence in Industrial Solutions',
    text: 'Recognizing consistent quality and engineering-focused solutions.',
    icon: Award,
  },
];

const MILESTONES = [
  {
    year: '2004',
    title: 'XCEED Journey Begins',
    text: 'Established with a focus on industrial solutions and engineering support.',
    icon: Landmark,
  },
  {
    year: '2012',
    title: 'Japan Network Expansion',
    text: 'Built strong relationships with Japanese manufacturers and technology partners.',
    icon: Users2,
  },
  {
    year: '2020',
    title: 'Growing Manufacturer Network',
    text: 'Reached a significant milestone with a growing network of partners across India.',
    icon: TrendingUp,
  },
  {
    year: '2026',
    title: 'Next Generation XCEED',
    text: 'Expanding advanced industrial solutions with Japanese engineering excellence.',
    icon: Rocket,
  },
];

export default function NewsAwardsPage() {
  const featured = getFeaturedArticle();
  const latest = getLatestArticles(featured.slug, 3);
  const FeaturedIcon = featured.icon;

  return (
    <main>
      <Header />

      {/* Hero — reuses the same faded-photo-over-navy treatment as the
          homepage Hero for visual consistency across the site. */}
      <section className="relative overflow-hidden bg-brand-navy">
        <Image
          src="/main_Banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-brand-navy/90 via-brand-navy/85 to-brand-navy/95"
        />
        <div className="container-x relative py-16 sm:py-20">
          <SectionHeading
            eyebrow="XCEED / Updates"
            title="News & Awards"
            subtitle="Stay updated with the latest news, achievements and milestones as we continue to drive innovation and industrial excellence across Japan and India."
            size="h1"
            light
            className="max-w-2xl"
          />
        </div>
      </section>

      {/* Featured news */}
      <section className="bg-white py-16">
        <div className="container-x">
          <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-brand-red">
            Featured News
            <span className="h-px w-10 bg-brand-red/30" />
          </p>

          <Card className="grid grid-cols-1 items-center gap-8 overflow-hidden lg:grid-cols-2" style={{ padding: 0 }}>
            <div className="p-8 sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-red">{featured.category}</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-brand-black sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-slate">{featured.excerpt}</p>
              <Link
                href={`/about-us/news-awards/${featured.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-redDark"
              >
                Read More
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-brand-navy to-brand-blueDarker lg:h-full lg:min-h-[280px]">
              <FeaturedIcon size={64} className="text-white/25" />
            </div>
          </Card>
        </div>
      </section>

      {/* Latest news grid */}
      <section className="bg-brand-mist py-16">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-brand-red">
              Latest News
              <span className="h-px w-10 bg-brand-red/30" />
            </p>
            <Link
              href="/about-us/news-awards/all"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-red hover:underline"
            >
              View All News
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map(({ slug, category, title, date, icon: Icon }) => (
              <Link key={slug} href={`/about-us/news-awards/${slug}`}>
                <Card accent className="h-full overflow-hidden" style={{ padding: 0 }}>
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-navy to-brand-blueDarker">
                    <Icon size={40} className="text-white/25" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-red">{category}</p>
                    <h3 className="mt-2 text-base font-bold leading-snug text-brand-black">{title}</h3>
                    <p className="mt-3 text-xs text-brand-slate">{date}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & recognition */}
      <section className="bg-brand-navy py-16">
        <div className="container-x">
          <p className="mb-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-brand-red">
            Awards &amp; Recognition
            <span className="h-px w-10 bg-brand-red/30" />
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {AWARDS.map(({ year, title, text, icon: Icon }, i) => (
              <div key={title} className={`text-center ${i > 0 ? 'sm:border-l sm:border-white/10 sm:pl-8' : ''}`}>
                <Icon size={30} className="mx-auto text-brand-red" />
                <p className="mt-4 text-lg font-bold text-white">{year}</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/90">{title}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{text}</p>
                <span className="mx-auto mt-4 block h-0.5 w-8 rounded-full bg-brand-red/60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones timeline */}
      <section className="bg-white py-16">
        <div className="container-x">
          <p className="mb-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-brand-red">
            Milestones
            <span className="h-px w-10 bg-brand-red/30" />
          </p>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.map(({ year, title, text, icon: Icon }, i) => (
              <div key={year} className="relative pl-0">
                {/* Connector line — hidden on the last item, hidden below lg
                    where the timeline stacks to a single column. */}
                {i < MILESTONES.length - 1 && (
                  <span className="absolute left-6 top-6 hidden h-px w-full bg-black/10 lg:block" aria-hidden />
                )}
                <span
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-white ${
                    i === MILESTONES.length - 1 ? 'bg-brand-navy' : 'bg-brand-red'
                  }`}
                >
                  <Icon size={20} />
                </span>
                <p className="mt-4 text-xl font-bold text-brand-black">{year}</p>
                <p className="mt-1 text-sm font-bold text-brand-black">{title}</p>
                <p className="mt-2 text-xs leading-relaxed text-brand-slate">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
