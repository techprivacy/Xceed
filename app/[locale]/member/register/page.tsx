import type { Metadata } from 'next';
import { UserPlus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateAccountForm from '@/components/CreateAccountForm';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Create an Account',
  description: 'Create a free XCEED account to apply for membership, track orders, and manage your business profile.',
  path: '/member/register',
});

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
              {/* Self-service — no admin approval for a plain account (see
                  backend/src/controllers/accountController.js). Verify your
                  email and you're in; applying for business membership is a
                  separate, later step (see /membership/register). */}
              Just your name, email, and a password — verify your email and you&apos;re signed in. No approval wait.
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
