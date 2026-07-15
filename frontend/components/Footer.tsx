import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, Clock, FileCheck, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  Products: [
    'Cast Letters & Numbers',
    'Standard Holders',
    'Adhesive Type Holders',
    'Screw Type Holders',
    'Detachable Jigs',
    'Powerful Detachable Jigs',
    'Magnetic Tools',
    'Custom Marking Solutions',
  ],
};

const SOCIALS = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-brand-navy to-[#04122b] text-brand-footerText">
      <div className="container-x grid grid-cols-1 gap-10 py-12 text-sm sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="text-xl font-black text-white">
            X<span className="text-brand-blue">CEED</span>
          </div>
          <div className="text-lg font-black text-brand-blue">INDIA</div>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-brand-footerText/80">
            XCEED India provides Japanese-quality industrial marking products including cast
            letters, holders, jigs and magnetic tools for manufacturing industries across India.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">{heading}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/80 transition-colors duration-200 hover:text-brand-blue">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Customer Support</h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-brand-blue" /> +91 99096 11333
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-brand-blue" />
              <span className="break-all">sales@xceedonetouch.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-brand-blue" /> Mon - Sat: 9:00 AM - 6:00 PM
            </li>
            <li className="flex items-center gap-2">
              <FileCheck size={14} className="shrink-0 text-brand-blue" /> GST Invoice Available
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0 text-brand-blue" /> Pan-India Delivery
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Payment &amp; Trust</h4>
          <p className="mb-2 text-xs text-white/80">Secure Payment Gateway</p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-white/70">
            <span className="rounded border border-white/20 px-2 py-1">VISA</span>
            <span className="rounded border border-white/20 px-2 py-1">Mastercard</span>
            <span className="rounded border border-white/20 px-2 py-1">RuPay</span>
            <span className="rounded border border-white/20 px-2 py-1">UPI</span>
          </div>
          <div className="mt-4 flex gap-2">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-200 hover:border-brand-blue hover:bg-brand-blue hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20">
        <div className="container-x flex flex-col items-center gap-3 py-4 text-center text-xs text-white/80 sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 XCEED India. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="#" className="transition-colors hover:text-white hover:underline">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white hover:underline">Terms &amp; Conditions</a>
            <a href="#" className="transition-colors hover:text-white hover:underline">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
