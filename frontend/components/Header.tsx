import Image from 'next/image';
import { Search, ShoppingCart, User, MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4 sm:flex-nowrap sm:gap-6">
        <a href="/" className="relative h-16 w-56 shrink-0 sm:h-20 sm:w-64">
          <Image src="/logo.png" alt="XCEED India" fill className="object-contain" priority />
        </a>

        <div className="order-last flex w-full items-stretch sm:order-none sm:w-auto sm:max-w-xl sm:flex-1">
          <input
            type="text"
            placeholder="Search letters, holders, jigs and marking tools..."
            className="w-full rounded-l border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <button
            aria-label="Search"
            className="flex items-center justify-center rounded-r bg-brand-blue px-4 text-white shadow-sm transition-all duration-300 hover:bg-brand-blueDarker hover:shadow-md hover:shadow-brand-blue/30"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-sm sm:gap-6">
          <a href="/cart" className="relative flex flex-col items-center gap-0.5 text-gray-700 hover:text-brand-blueDark">
            <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[10px] text-white">
              0
            </span>
            <ShoppingCart size={20} />
            <span className="hidden text-xs sm:inline">Cart</span>
          </a>
          <a href="/account" className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-brand-blueDark">
            <User size={20} />
            <span className="hidden text-xs sm:inline">Account</span>
          </a>
          <a
            href="https://wa.me/919909611333"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-green-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white">
              <MessageCircle size={18} />
            </span>
            <span className="hidden text-xs leading-tight lg:block">
              WhatsApp
              <br />
              Enquiry
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
