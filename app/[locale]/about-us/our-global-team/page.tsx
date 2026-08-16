import type { Metadata } from 'next';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Our Global Team',
  description: "Meet the leadership team driving XCEED's operations and partnerships across India and Japan.",
  path: '/about-us/our-global-team',
});

// Sunil and Amit have real photos (Sunil's reused from the Director
// Message page); Pragya gets an initials avatar until hers is supplied,
// rather than a broken image or a stock photo standing in for a real
// person.
const TEAM = [
  {
    name: 'Sunil Sharma',
    role: 'President & Founder',
    bio: "Sunil Sharma founded XCEED as a pillar connecting Japanese industrial technology with India's manufacturing industry. With 20+ years of Japan–India market experience, he leads the company's strategic direction and cross-border partnerships.",
    photo: '/Sunil_Sharma_photo.png',
    initials: 'SS',
  },
  {
    name: 'Amit Singh',
    role: 'Director, Operations — India',
    bio: 'Amit Singh brings 12+ years of experience in operations and IT, driving efficient processes, technology integration, and business execution at XCEED.',
    photo: '/ak-photo.jpg',
    initials: 'AS',
  },
  {
    name: 'Pragya Paramita Nag',
    role: 'Director, Sales — India',
    bio: 'Pragya Paramita Nag holds an MBA in Sales & Marketing and brings a strategic, customer-focused approach to business growth, sales development, and market expansion at XCEED.',
    photo: null,
    initials: 'PN',
  },
];

// Placeholder targets — "we will link social accounts later" per request.
// Kept visible (not removed) so the layout matches the reference design
// now; hrefs get filled in once real profile links are supplied.
const SOCIALS = [Facebook, Twitter, Instagram, Linkedin];

export default function OurGlobalTeamPage() {
  return (
    <main>
      <Header />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Global Team"
            title="The People Behind XCEED"
            subtitle="Leadership connecting Japanese technology and Indian industry, and driving XCEED's operations and partnerships across both markets."
            align="center"
            size="h1"
            className="mx-auto max-w-3xl"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <Card key={member.name} className="text-center" style={{ padding: 'clamp(1.75rem, 1.2rem + 2vw, 2.5rem)' }}>
                <span className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy ring-2 ring-brand-blue/15">
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} fill sizes="144px" className="object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">{member.initials}</span>
                  )}
                </span>

                <h3 className="mt-5 text-lg font-bold uppercase tracking-wide text-brand-black">{member.name}</h3>
                <p className="mt-1 text-sm font-bold text-brand-blue">{member.role}</p>
                <p className="mt-4 text-sm italic leading-relaxed text-brand-slate">{member.bio}</p>

                <div className="mt-5 flex items-center justify-center gap-3">
                  {SOCIALS.map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      aria-label={`${member.name} on social media`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-brand-slate transition-colors hover:bg-brand-mist hover:text-brand-red"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
