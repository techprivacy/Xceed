import { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function ComingSoon({ icon: Icon, title, message, ctaLabel, ctaHref }: ComingSoonProps) {
  return (
    <section className="bg-white py-20">
      <div className="container-x flex justify-center">
        <Card className="max-w-md p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
            <Icon size={28} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-brand-black">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-slate">{message}</p>
          <Button href={ctaHref} variant="primary" className="mt-6">
            {ctaLabel}
          </Button>
        </Card>
      </div>
    </section>
  );
}
