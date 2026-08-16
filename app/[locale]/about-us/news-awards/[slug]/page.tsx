import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import JsonLd from '@/components/seo/JsonLd';
import { getNewsArticleBySlug } from '@/lib/api';
import { NEWS_ICON_MAP, formatNewsDate } from '@/lib/newsIcons';
import { buildMetadata, noIndexMetadata, absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';

interface PageProps {
  params: { slug: string };
}

// No generateStaticParams here on purpose — articles are now backend-
// managed (admin can add one at any time), so this renders dynamically
// per request rather than only knowing about slugs that existed at build
// time. getNewsArticleBySlug still benefits from lib/api.ts's normal
// 60s revalidate window.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const res = await getNewsArticleBySlug(params.slug).catch(() => null);
  const article = res?.data;
  if (!article) return noIndexMetadata('Article Not Found');
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/about-us/news-awards/${article.slug}`,
    type: 'article',
  });
}

export default async function NewsArticlePage({ params }: PageProps) {
  const res = await getNewsArticleBySlug(params.slug).catch(() => null);
  const article = res?.data;
  if (!article) notFound();

  const Icon = NEWS_ICON_MAP[article.icon];
  const paragraphs = article.body.split(/\n\s*\n/).filter(Boolean);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt,
    image: [absoluteUrl('/logo.png')],
    articleSection: article.category,
    mainEntityOfPage: absoluteUrl(`/about-us/news-awards/${article.slug}`),
    publisher: {
      '@type': 'Organization',
      name: 'XCEED',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
    },
  };

  return (
    <main>
      <JsonLd
        data={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'News & Awards', path: '/about-us/news-awards' },
            { name: article.title, path: `/about-us/news-awards/${article.slug}` },
          ]),
        ]}
      />
      <Header />

      <section className="relative overflow-hidden bg-brand-navy">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-blueDarker opacity-90"
        />
        <div className="container-x relative py-14 sm:py-16">
          <Link
            href="/about-us/news-awards"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70 hover:text-white"
          >
            <ArrowLeft size={13} />
            News &amp; Awards
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Icon size={20} />
            </span>
            <p className="text-xs font-bold uppercase tracking-wide text-white/70">{article.category}</p>
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-white/60">{formatNewsDate(article.date)}</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <Card className="mx-auto max-w-3xl" style={{ padding: 'clamp(1.75rem, 1.2rem + 2vw, 3rem)' }}>
            <div className="space-y-5 text-base leading-relaxed text-brand-slate">
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Card>

          <div className="mx-auto mt-8 max-w-3xl">
            <Link
              href="/about-us/news-awards"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:underline"
            >
              <ArrowLeft size={14} />
              Back to News &amp; Awards
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
