import { UserPlus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateAccountForm from '@/components/CreateAccountForm';

export default function CreateAccountPage() {
  return (
    <main>
      <Header />

      <section className="bg-gradient-to-br from-[#EAF2FF] via-white to-[#DCEAFE] pb-12 pt-14">
        <div className="container-x text-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <UserPlus size={32} />
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-brand-black sm:text-5xl">Create an Account</h1>
            <p className="max-w-xl text-base leading-relaxed text-brand-slate sm:text-lg">
              {/* Honest about how accounts actually work here: there's no
                  instant self-service signup — see backend/src/controllers/
                  memberController.js. An admin reviews and approves every
                  application, then emails your Member Portal login. */}
              Just your own details — our team will confirm your access and email your Member Portal login once
              approved.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <CreateAccountForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
