import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import { getArticleBySlug, NEWS_ARTICLES } from '@/lib/newsData';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return NEWS_ARTICLES.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  return { title: article ? article.title : 'Article Not Found' };
}

export default function NewsArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const Icon = article.icon;

  return (
    <main>
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
          <p className="mt-3 text-sm text-white/60">{article.date}</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <Card className="mx-auto max-w-3xl" style={{ padding: 'clamp(1.75rem, 1.2rem + 2vw, 3rem)' }}>
            <div className="space-y-5 text-base leading-relaxed text-brand-slate">
              {article.body.map((paragraph, i) => (
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
