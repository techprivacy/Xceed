import { Phone, Mail, Clock, Truck, CheckCircle2, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 99096 11333',
    href: 'tel:+919909611333',
    text: undefined,
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info@xceedindia.com',
    href: 'mailto:info@xceedindia.com',
    text: undefined,
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
    value: 'Fast Across India & Japan Delivery',
    text: undefined,
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
      <Header />

      <section className="bg-white py-16">
        <div className="container-x text-center">
          <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight text-brand-black md:text-4xl">
            Connect with Our Experts
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-slate">
            From product selection to bulk supply and dealership partnerships, XCEED India
            provides reliable industrial solutions backed by expert support. Reach out via phone,
            email, or the enquiry form below, and our team will respond at the earliest.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value, href, text }, i) => (
              <div
                key={label}
                className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-red/20 hover:shadow-lg"
              >
                <span className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-xl bg-brand-red/10 animate-haloPulse motion-reduce:animate-none"
                    style={{ animationDelay: `${i * 0.3}s` }}
                    aria-hidden
                  />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-brand-red/20 transition-transform duration-500 ease-out group-hover:scale-105">
                    <Icon
                      size={30}
                      className="text-brand-red animate-floatSoft motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  </span>
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
          <h2 className="text-center text-3xl font-bold leading-[1.2] tracking-tight text-brand-black sm:text-4xl">
            Why Choose XCEED India?
          </h2>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_CHOOSE.map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                  <CheckCircle2 size={24} />
                </span>
                <p className="text-base font-medium text-brand-charcoal">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container-x flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex gap-2 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={60} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <p className="text-sm font-semibold text-brand-charcoal">
            Trusted Network of 2,000+ Manufacturers &amp; Suppliers
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
