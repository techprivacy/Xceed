import { Handshake } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MembershipForm from '@/components/MembershipForm';

export default function MembershipRegisterPage() {
  return (
    <main>
      <Header />

      <section className="bg-gradient-to-br from-[#EAF2FF] via-white to-[#DCEAFE] pb-12 pt-14">
        <div className="container-x text-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Handshake size={32} />
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-brand-black sm:text-5xl">Join XCEED India</h1>
            <p className="max-w-xl text-base leading-relaxed text-brand-slate sm:text-lg">
              Connect with Japan&ndash;India industrial businesses, technology providers, manufacturers and
              foundry professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <MembershipForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
