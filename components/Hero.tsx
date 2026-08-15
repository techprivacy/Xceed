import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <div className="relative flex h-[240px] w-full items-center justify-center sm:h-[300px] md:h-[360px] lg:h-[420px]">
        <Image
          src="/main_Banner.png"
          alt="Industrial cast metal letters and marking tools"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        {/* Uniform dark navy scrim across the whole banner — the headline is
            now centered, so it needs to read clearly no matter where it
            lands over the photo, unlike the old side-lit gradient. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-brand-navy/95 via-brand-navy/85 to-brand-navy/95"
        />

        <div className="container-x relative flex flex-col items-center px-4 text-center">
          <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-brand-red">Japanese</span> <span className="text-white">Engineering</span>
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5 sm:gap-4">
            <span className="h-px w-8 bg-white/25 sm:w-16" />
            <p className="text-sm font-medium text-white/85 sm:text-base md:text-lg">
              Built for Industry. Globally Trusted.
            </p>
            <span className="h-px w-8 bg-white/25 sm:w-16" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 sm:mt-5">
            <span className="h-px w-10 bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            <span className="h-px w-10 bg-white/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
