import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';

interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({ title, lastUpdated, intro, sections }: LegalPageLayoutProps) {
  return (
    <main>
      <Header />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <SectionHeading eyebrow="Legal" title={title} subtitle={`Last updated: ${lastUpdated}`} size="h1" />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x max-w-3xl">
          <p className="text-sm leading-relaxed text-brand-slate">{intro}</p>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-lg font-bold tracking-tight text-brand-black">{section.heading}</h2>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-brand-slate">{section.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
