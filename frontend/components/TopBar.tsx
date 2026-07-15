import { Phone, Mail } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="hidden bg-brand-navy text-xs text-white md:block">
      <div className="container-x flex items-center justify-between py-2">
        <p>XCEED | One Touch </p>
        <div className="flex items-center gap-6">
          <a href="tel:+919909611333" className="group flex items-center gap-1.5 hover:text-white">
            <Phone size={13} className="origin-bottom animate-ring group-hover:[animation-play-state:paused]" /> +91 99096 11333
          </a>
          <a href="mailto:sales@xceedonetouch.com" className="group flex items-center gap-1.5 hover:text-white">
            <Mail size={13} className="animate-pulse group-hover:[animation-play-state:paused]" /> sales@xceedonetouch.com
          </a>
          <span className="h-3 w-px bg-white/20" />
          <a href="/dealer-login" className="hover:text-white">Customer Login</a>
          <a href="/track-order" className="hover:text-white">Track Order</a>
          <a
            href="/request-a-quote"
            className="animate-pulse-glow rounded bg-brand-blue px-3 py-1 font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:animate-none hover:bg-brand-blueDarker"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </div>
  );
}
