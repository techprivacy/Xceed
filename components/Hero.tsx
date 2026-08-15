import Image from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px]">
        <Image
          src="/main_Banner.png"
          alt="Industrial cast metal letters and marking tools"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Scrim: the banner photo is busy (foundry pour, Fuji, stone-carved
            lettering) — a flat overlay would fight it everywhere, so this
            fades in only along the left/bottom where the headline actually
            sits, leaving the rest of the image untouched. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, rgba(7,28,58,0.82) 0%, rgba(7,28,58,0.55) 32%, rgba(7,28,58,0) 60%), linear-gradient(0deg, rgba(7,28,58,0.55) 0%, rgba(7,28,58,0) 45%)',
          }}
        />
        <div className="container-x absolute inset-0 flex items-center">
          <SectionHeading
            eyebrow="Japanese Engineering"
            title="Built for Industry. Globally Trusted."
            size="h1"
            light
            className="max-w-xl"
          />
        </div>
      </div>
    </section>
  );
}
