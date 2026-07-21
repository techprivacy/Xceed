'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';
import { getAdminToken, getQuoteRequests } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Card from '@/components/ui/Card';
import { QuoteRequest } from '@/types';

export default function AdminDashboardPage() {
  const [newLeads, setNewLeads] = useState<QuoteRequest[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    getQuoteRequests(token, { status: 'new', limit: 5 })
      .then((res) => {
        setNewLeads(res.data);
        setTotal(res.total ?? res.data.length);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="p-6">
      <AdminPageHeader title="Dashboard" subtitle="Welcome back to the XCEED India admin panel." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/admin/quotes" className="group block">
          <Card accent className="p-5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center bg-brand-red/10 text-brand-red">
                <FileSpreadsheet size={20} />
              </span>
              <ArrowRight
                size={16}
                className="text-brand-slate/50 transition-transform group-hover:translate-x-1 group-hover:text-brand-red"
              />
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-brand-black">{total}</p>
            <p className="text-sm text-brand-slate">New quote requests</p>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-slate">
          Latest Bulk Quote Requests
        </h2>
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          {newLeads.length === 0 ? (
            <p className="p-5 text-sm text-brand-slate/70">No new leads right now.</p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {newLeads.map((q) => (
                <li key={q._id}>
                  <Link
                    href={`/admin/quotes/${q._id}`}
                    className="flex items-center justify-between px-5 py-3 text-sm hover:bg-brand-mist"
                  >
                    <span>
                      <span className="font-semibold text-brand-black">{q.companyName}</span>
                      <span className="ml-2 text-brand-slate">{q.productRequirement}</span>
                    </span>
                    <span className="text-xs text-brand-slate/70">
                      {new Date(q.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
