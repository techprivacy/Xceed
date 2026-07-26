import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

const WHATSAPP_CHAT_NUMBER = '919909611333';

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_CHAT_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-110"
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}
