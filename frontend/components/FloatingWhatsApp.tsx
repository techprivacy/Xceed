import Image from 'next/image';

const WHATSAPP_CHAT_NUMBER = '919909611333';

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_CHAT_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with XCEED India on WhatsApp"
      title="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-brand-red bg-white shadow-lg shadow-black/25 transition-transform duration-200 ease-out hover:scale-110"
    >
      {/* The logo artwork has an opaque white background, so it needs a white
          plate to sit on — the brand red comes from the ring and halo instead. */}
      <span
        className="absolute inset-0 rounded-full bg-brand-red/25 animate-haloPulse motion-reduce:animate-none"
        aria-hidden
      />
      {/* The wordmark is ~3:1, so object-cover pinned left crops to the square
          diamond mark — the only part of the logo that reads at this size. */}
      <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
        <Image src="/logo.png" alt="" fill sizes="40px" className="object-cover object-left" />
      </span>
    </a>
  );
}
