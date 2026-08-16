import Link from 'next/link';
import { Home, Package, Phone, SearchX } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

// Next.js renders this for any unmatched route under [locale] and
// automatically responds with a real HTTP 404 status — no extra wiring
// needed. Previously this fell through to Next's generic default page,
// which is unbranded and offers no way back into the site.
export default function NotFound() {
  return (
    <main>
      <Header />
      <section className="flex min-h-[60vh] items-center justify-center bg-white py-16">
        <div className="container-x flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
            <SearchX size={32} />
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-brand-red">404 Error</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">Page Not Found</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-slate">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Try one of the links below, or
            head back to the homepage.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="primary">
              <Home size={16} />
              Back to Home
            </Button>
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-full border border-brand-border px-5 py-2.5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-mist"
            >
              <Package size={16} />
              Browse Products
            </Link>
            <Link
              href="/contact-us"
              className="flex items-center gap-2 rounded-full border border-brand-border px-5 py-2.5 text-sm font-bold text-brand-charcoal transition hover:bg-brand-mist"
            >
              <Phone size={16} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
