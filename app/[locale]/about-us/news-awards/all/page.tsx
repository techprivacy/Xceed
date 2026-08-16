import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import { getNewsArticles } from '@/lib/api';
import { NEWS_ICON_MAP, formatNewsDate } from '@/lib/newsIcons';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'All News',
  description: 'The complete archive of company news, updates, and announcements from XCEED.',
  path: '/about-us/news-awards/all',
});

export default async function AllNewsPage() {
  const res = await getNewsArticles({ limit: 100 }).catch(() => ({ data: [] }));
  const articles = res.data ?? [];

  return (
    <main>
      <Header />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <Link
            href="/about-us/news-awards"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-red hover:underline"
          >
            <ArrowLeft size={13} />
            News &amp; Awards
          </Link>
          <SectionHeading eyebrow="XCEED / Updates" title="All News" size="h1" />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          {articles.length === 0 ? (
            <p className="rounded-2xl border border-black/5 bg-brand-mist p-6 text-center text-sm text-brand-slate">
              No articles yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map(({ _id, slug, category, title, date, icon }) => {
                const Icon = NEWS_ICON_MAP[icon];
                return (
                  <Link key={_id} href={`/about-us/news-awards/${slug}`}>
                    <Card accent className="h-full overflow-hidden" style={{ padding: 0 }}>
                      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-navy to-brand-blueDarker">
                        <Icon size={40} className="text-white/25" />
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-red">{category}</p>
                        <h3 className="mt-2 text-base font-bold leading-snug text-brand-black">{title}</h3>
                        <p className="mt-3 text-xs text-brand-slate">{formatNewsDate(date)}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
