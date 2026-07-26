import Image from 'next/image';


/* Showcase cards removed */

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full h-[180px] sm:h-[260px] md:h-[360px] lg:h-[480px]">
        <Image
          src="/main_Banner.png"
          alt="Industrial cast metal letters and marking tools"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container-x relative grid min-h-0 grid-cols-1 gap-0 py-6 lg:min-h-0 lg:grid-cols-[1fr_auto] lg:items-end lg:py-8">
        {/* Showcase cards removed */}
      </div>
    </section>
  );
}
