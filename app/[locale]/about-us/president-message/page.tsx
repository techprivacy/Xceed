import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'President Message',
  description:
    "A message from XCEED's President & Founder on bridging Japanese industrial technology with India's manufacturing, foundry, and engineering industries.",
  path: '/about-us/president-message',
});

export default function PresidentMessagePage() {
  return (
    <main>
      <Header />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <SectionHeading
            eyebrow="President Message"
            title="A Pillar Connecting Japan and India Through Technology"
            subtitle="XCEED serves as a pillar connecting advanced Japanese industrial technology and expertise with the evolving needs of India's manufacturing, foundry, and engineering industries."
            align="center"
            size="h1"
            className="mx-auto max-w-3xl"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <Card className="mx-auto max-w-3xl" style={{ padding: 'clamp(1.75rem, 1.2rem + 2vw, 3rem)' }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-brand-red">
              Message from the President
            </h2>

            <div className="mt-5 space-y-5 text-base leading-relaxed text-brand-slate">
              <p>
                For more than 25 years, our journey between Japan and India has been driven by one purpose —{' '}
                <strong className="font-semibold text-brand-black">
                  connecting advanced Japanese technology with the growing needs of Indian industry.
                </strong>
              </p>
              <p>
                At XCEED, we believe that meaningful technology transfer is not simply about bringing machinery or
                solutions to a new market. It is about building long-term partnerships, understanding industrial
                challenges, and delivering reliable solutions that create measurable value.
              </p>
              <p>
                Our experience spans{' '}
                <strong className="font-semibold text-brand-black">
                  foundry engineering, robotics, automation, sand reclamation, environmental technologies, wastewater
                  treatment, industrial waste-gas purification, and industrial gasification machines for converting
                  solid waste into energy.
                </strong>
              </p>
              <p>
                XCEED is honoured to stand as a{' '}
                <strong className="font-semibold text-brand-black">
                  pillar of the growing economic and business relationship between Japan and India
                </strong>
                , fostering stronger connections, technology exchange, and long-term collaboration between the two
                nations.
              </p>
              <p>
                Today, we continue to work closely with leading Indian industries while helping Japanese technology
                companies develop strong and sustainable business opportunities in India.
              </p>
              <p>
                Our vision is simple:{' '}
                <strong className="font-semibold text-brand-black">
                  to strengthen Japan–India collaboration through technology, trust, and long-term industrial
                  partnerships.
                </strong>
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 border-t border-black/5 pt-6">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-blue/15">
                <Image
                  src="/Sunil_Sharma_photo.png"
                  alt="Sunil Sharma, President & Founder, XCEED"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div>
                <p className="text-base font-bold text-brand-black">Sunil Sharma</p>
                <p className="text-sm text-brand-slate">President &amp; Founder, XCEED</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
