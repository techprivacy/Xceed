import Image from 'next/image';
import { Search, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="hidden bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 lg:block">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-3.5 sm:flex-nowrap sm:gap-6">
        <a href="/" className="relative h-12 w-44 shrink-0 sm:h-16 sm:w-60">
          <Image src="/logo.png" alt="XCEED India" fill sizes="240px" className="object-contain" priority />
        </a>

        <div className="order-last flex w-full items-stretch sm:order-none sm:w-auto sm:max-w-xl sm:flex-1">
          <input
            type="text"
            placeholder="Search letters, holders, jigs and marking tools..."
            className="w-full rounded-l-full border border-brand-border bg-brand-mist/60 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
          <button
            aria-label="Search"
            className="flex items-center justify-center rounded-r-full bg-brand-red px-6 text-white transition-colors duration-200 hover:bg-brand-redDark"
          >
            <Search size={20} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-4 text-sm sm:gap-7">
          <a
            href="/cart"
            className="relative flex flex-col items-center gap-0.5 text-brand-charcoal hover:text-brand-red"
          >
            <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] text-white">
              0
            </span>
            <ShoppingCart size={23} />
            <span className="hidden text-sm sm:inline">Cart</span>
          </a>
          <a href="/admin/login" className="flex flex-col items-center gap-0.5 text-brand-charcoal hover:text-brand-red">
            <User size={23} />
            <span className="hidden text-sm sm:inline">Login</span>
          </a>
        </div>
      </div>
    </header>
  );
}
