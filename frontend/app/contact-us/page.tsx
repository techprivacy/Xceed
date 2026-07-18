import { Phone, Mail, Clock, Truck, CheckCircle2, Star } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 99096 11333',
    href: 'tel:+919909611333',
    text: 'Speak directly with our product specialists for sales, technical support, and business enquiries.',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'sales@xceedonetouch.com',
    href: 'mailto:sales@xceedonetouch.com',
    text: "Send us your requirements, RFQs, or product enquiries, and we'll respond promptly.",
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon - Sat: 9:00 AM - 6:00 PM (IST)',
    text: undefined,
  },
  {
    icon: Truck,
    label: 'Delivery Coverage',
    value: 'Fast Pan-India Delivery',
    text: 'Reliable shipping across India with secure packaging and timely dispatch.',
  },
];

const WHY_CHOOSE = [
  'Japanese-Quality Industrial Marking Products',
  'Trusted by Manufacturing & Foundry Industries',
  'Expert Technical Assistance',
  'Bulk Order Support',
  'Fast Pan-India Delivery',
  'Reliable After-Sales Service',
  'Custom Industrial Solutions',
];

export default function ContactUsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="bg-brand-navy py-16">
        <div className="container-x text-center">
          <span className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            Contact Us
          </span>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl">
            Get Expert Assistance Today
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
            Have a question about our products, industrial solutions, bulk orders, or dealership
            opportunities? Our team is ready to assist you. Reach out by phone, email, or submit
            the enquiry form below &mdash; we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value, href, text }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block text-base font-bold text-brand-black hover:text-brand-red">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-base font-bold text-brand-black">{value}</p>
                  )}
                  {text && <p className="mt-1 text-sm leading-relaxed text-brand-slate">{text}</p>}
                </div>
              </div>
            ))}
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <h2 className="text-center text-2xl font-bold leading-[1.2] tracking-tight text-brand-black">
            Why Choose XCEED India?
          </h2>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_CHOOSE.map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                  <CheckCircle2 size={16} />
                </span>
                <p className="text-sm font-medium text-brand-charcoal">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container-x flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex gap-1 text-brand-red">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <p className="text-sm font-semibold text-brand-charcoal">
            Trusted by Manufacturing Industries Across India
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
