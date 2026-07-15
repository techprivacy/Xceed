'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';
import { getAdminToken, getQuoteRequests } from '@/lib/api';
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
      <h1 className="mb-1 text-xl font-extrabold text-gray-900">Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">Welcome back to the XCEED India admin panel.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/quotes"
          className="group rounded-xl border border-brand-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
              <FileSpreadsheet size={20} />
            </span>
            <ArrowRight size={16} className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-blue" />
          </div>
          <p className="mt-4 text-2xl font-extrabold text-gray-900">{total}</p>
          <p className="text-sm text-gray-500">New quote requests</p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
          Latest Bulk Quote Requests
        </h2>
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          {newLeads.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No new leads right now.</p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {newLeads.map((q) => (
                <li key={q._id}>
                  <Link
                    href={`/admin/quotes/${q._id}`}
                    className="flex items-center justify-between px-5 py-3 text-sm hover:bg-gray-50"
                  >
                    <span>
                      <span className="font-semibold text-gray-900">{q.companyName}</span>
                      <span className="ml-2 text-gray-500">{q.productRequirement}</span>
                    </span>
                    <span className="text-xs text-gray-400">
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
