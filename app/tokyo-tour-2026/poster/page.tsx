'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Printer, ArrowLeft, Phone, Mail } from 'lucide-react';
import { HIGHLIGHTS, FOUNDRY_VISITS, ITINERARY, INCLUSIONS } from '@/lib/tokyoTourData';

export default function TokyoTourPosterPage() {
  return (
    <div className="min-h-screen bg-brand-mist py-8 print:bg-white print:py-0">
      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Screen-only toolbar */}
      <div className="container-x mb-6 flex items-center justify-between print:hidden">
        <Link href="/tokyo-tour-2026" className="flex items-center gap-1.5 text-sm font-semibold text-brand-slate hover:text-brand-black">
          <ArrowLeft size={16} /> Back to tour page
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-red/25 transition-colors hover:bg-brand-redDark"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* Poster canvas */}
      <div className="container-x">
        <div className="mx-auto max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-xl print:max-w-none print:rounded-none print:shadow-none">
          {/* Poster header */}
          <div className="flex items-center justify-between border-b border-brand-border px-8 py-5">
            <Image src="/logo.png" alt="XCEED India" width={280} height={126} priority className="h-9 w-auto object-contain" />
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-slate">
              Connect &middot; Collaborate &middot; Excel
            </p>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden bg-brand-navy px-8 py-12">
            <Image
              src="https://images.unsplash.com/photo-1762018824220-d4a9ebda2b28?w=1200&h=700&fit=crop"
              alt="Mount Fuji, pagoda and cherry blossoms, Japan"
              fill
              sizes="900px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/40" aria-hidden />
            <div className="relative">
              <p className="text-base font-semibold uppercase tracking-wide text-white/80">
                Japan Foundry Immersion 2026
              </p>
              <h1 className="mt-1 text-5xl font-bold leading-[1.05] tracking-tight text-white">
                Tokyo<span className="text-brand-red">.</span> Japan
              </h1>
              <p className="mt-2 text-sm font-semibold text-white/80">
                10 Days &middot; Home to Home &middot; Where Business Meets Culture
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                Discover world-class foundries, build global partnerships, and experience the innovation of
                Japan with XCEED India&apos;s exclusive industrial tour.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Flight', 'Visa', 'Foundry Expo', 'Business Hotels'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-red px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="border-b border-brand-border px-8 py-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-red">Highlights</p>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                    <Icon size={18} />
                  </div>
                  <p className="text-[10px] font-semibold leading-snug text-brand-charcoal">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Foundry visits */}
          <div className="border-b border-brand-border bg-brand-mist px-8 py-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-red">Industry Connect</p>
            <h2 className="text-lg font-bold tracking-tight text-brand-black">
              Exclusive Visits to 4 World-Class Foundry Companies
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FOUNDRY_VISITS.map((visit) => (
                <div key={visit.title} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  <div className="relative h-20 w-full">
                    <Image src={visit.image} alt={visit.title} fill sizes="200px" className="object-cover" />
                  </div>
                  <p className="px-2.5 py-2 text-[11px] font-semibold leading-snug text-brand-black">{visit.title}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-brand-slate">*Company visits subject to confirmation.</p>
          </div>

          {/* Itinerary */}
          <div className="border-b border-brand-border px-8 py-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-red">10-Day Itinerary</p>
            <div className="grid grid-cols-5 gap-2">
              {ITINERARY.map(({ day, title }) => (
                <div key={day} className="rounded-xl border border-brand-border p-2.5 text-center">
                  <span className="mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                    {day}
                  </span>
                  <p className="text-[10px] font-semibold leading-tight text-brand-charcoal">{title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div className="border-b border-brand-border bg-brand-mist px-8 py-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-red">What&apos;s Included</p>
            <div className="grid grid-cols-4 gap-3">
              {INCLUSIONS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-red shadow-sm">
                    <Icon size={15} />
                  </div>
                  <p className="text-[10px] font-semibold leading-snug text-brand-charcoal">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Poster footer */}
          <div className="bg-brand-navy px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-block rounded-lg bg-white p-1.5">
                  <Image src="/logo.png" alt="XCEED India" width={240} height={108} className="h-8 w-auto object-contain" />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Phone size={12} /> +91 99096 11333
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={12} /> sales@xceedonetouch.com
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-brand-red">
                EXPERIENCE JAPAN. <span className="text-white">EMPOWER YOUR BUSINESS.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
