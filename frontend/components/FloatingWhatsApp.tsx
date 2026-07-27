import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

const WHATSAPP_CHAT_NUMBER = '919909611333';

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_CHAT_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with XCEED India on WhatsApp"
      title="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform duration-200 ease-out hover:scale-110"
    >
      <span
        className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-haloPulse motion-reduce:animate-none"
        aria-hidden
      />
      <WhatsAppIcon size={32} className="relative" />
    </a>
  );
}
