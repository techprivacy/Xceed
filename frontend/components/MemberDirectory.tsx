'use client';

import { useMemo, useState } from 'react';
import { Search, Building2, User, Package, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MEMBER_COMPANIES, MemberCompany } from '@/lib/memberDirectory';

const PAGE_SIZE = 10;

type FilterField = 'all' | 'name' | 'industry' | 'products' | 'location';

const FILTER_OPTIONS: { value: FilterField; label: string }[] = [
  { value: 'all', label: 'All Fields' },
  { value: 'name', label: 'Company Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'products', label: 'Products' },
  { value: 'location', label: 'Location' },
];

function CompanyCard({ company }: { company: MemberCompany }) {
  return (
    <Card className="flex items-start gap-4 p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
        <Building2 size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-brand-black">{company.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-slate">
          <User size={12} /> {company.contactPerson}
        </p>
        <p className="mt-1 text-xs text-brand-slate">{company.industry}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-slate">
          <Package size={12} /> {company.products}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-slate">
          <MapPin size={12} /> {company.location}
        </p>
        <Button href="/contact-us" size="sm" variant="ghost" className="mt-3">
          View Profile
        </Button>
      </div>
    </Card>
  );
}

export default function MemberDirectory() {
  const [query, setQuery] = useState('');
  const [filterField, setFilterField] = useState<FilterField>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEMBER_COMPANIES;

    return MEMBER_COMPANIES.filter((c) => {
      const fields =
        filterField === 'all'
          ? [c.name, c.industry, c.products, c.location]
          : filterField === 'name'
            ? [c.name]
            : filterField === 'industry'
              ? [c.industry]
              : filterField === 'products'
                ? [c.products]
                : [c.location];
      return fields.some((field) => field.toLowerCase().includes(q));
    });
  }, [query, filterField]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const leftColumn = pageItems.slice(0, 5);
  const rightColumn = pageItems.slice(5, 10);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleFilterChange = (value: FilterField) => {
    setFilterField(value);
    setPage(1);
  };

  return (
    <section className="bg-white py-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-1.5 text-xs font-semibold text-brand-blueDark">
            20+ Years of Experience
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-brand-black sm:text-3xl">
            India &amp; Japan&apos;s Trusted Manufacturing &amp; Foundry Network
          </h2>
        </div>

        <div className="sticky top-20 z-30 mx-auto mt-8 max-w-2xl bg-white/95 py-3 backdrop-blur-sm lg:top-36">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-brand-border bg-white px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-blue/20">
              <Search size={18} className="shrink-0 text-brand-slate" />
              <input
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by company name, industry, products, or location..."
                className="w-full text-sm text-brand-charcoal outline-none placeholder:text-brand-slate/70"
              />
            </div>
            <select
              value={filterField}
              onChange={(e) => handleFilterChange(e.target.value as FilterField)}
              className="rounded-full border border-brand-border bg-white px-4 py-3 text-xs font-semibold text-brand-charcoal shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 sm:w-40"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-center text-xs text-brand-slate">
            Search by: Company Name · Industry · Products · Location
          </p>
        </div>

        {pageItems.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-black/5 bg-brand-mist p-8 text-center text-sm text-brand-slate">
            No member companies match &quot;{query}&quot;.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {leftColumn.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
            <div className="space-y-4">
              {rightColumn.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-charcoal transition-colors hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              className={`h-9 w-9 rounded-full text-xs font-semibold transition-colors ${
                num === currentPage
                  ? 'bg-brand-red text-white'
                  : 'border border-brand-border text-brand-charcoal hover:border-brand-red hover:text-brand-red'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-charcoal transition-colors hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
