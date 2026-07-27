import Image from 'next/image';

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
    </section>
  );
}
