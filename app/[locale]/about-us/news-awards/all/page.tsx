import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import { NEWS_ARTICLES } from '@/lib/newsData';

export const metadata: Metadata = {
  title: 'All News',
};

export default function AllNewsPage() {
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NEWS_ARTICLES.map(({ slug, category, title, date, icon: Icon }) => (
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

      <Footer />
    </main>
  );
}
