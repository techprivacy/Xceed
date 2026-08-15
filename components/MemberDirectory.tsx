'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Building2, User, Package, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getPublicMembershipDirectory } from '@/lib/api';
import { PublicMembershipApplication } from '@/types';

const PAGE_SIZE = 10;

type FilterField = 'all' | 'name' | 'industry' | 'products' | 'location';

const FILTER_OPTIONS: { value: FilterField; label: string }[] = [
  { value: 'all', label: 'All Fields' },
  { value: 'name', label: 'Company Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'products', label: 'Products' },
  { value: 'location', label: 'Location' },
];

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-brand-red" />
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-brand-slate">{label}</dt>
        <dd className="text-sm font-medium text-brand-charcoal">{value}</dd>
      </div>
    </div>
  );
}

function CompanyCard({ company }: { company: PublicMembershipApplication }) {
  return (
    <Card
      accent
      className="flex h-full flex-col p-6 shadow-[0_10px_30px_-18px_rgba(7,28,58,0.35)] hover:shadow-[0_22px_44px_-24px_rgba(7,28,58,0.4)]"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
          <Building2 size={26} />
        </span>
        <h3 className="min-w-0 flex-1 text-base font-bold leading-snug text-brand-black">{company.companyName}</h3>
      </div>

      <div className="my-5 h-px bg-black/[0.07]" />

      <dl className="flex-1 space-y-4">
        <DetailRow icon={User} label="Contact Person" value={company.contactPerson} />
        <DetailRow icon={Building2} label="Industry" value={company.industry || '—'} />
        <DetailRow icon={Package} label="Products" value={company.products || '—'} />
        <DetailRow icon={MapPin} label="Location" value={company.location || '—'} />
      </dl>

      <Button href="/contact-us" size="sm" variant="ghost" className="mt-6 w-full">
        View Profile
      </Button>
    </Card>
  );
}

export default function MemberDirectory() {
  const [companies, setCompanies] = useState<PublicMembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterField, setFilterField] = useState<FilterField>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPublicMembershipDirectory()
      .then((res) => setCompanies(res.data))
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;

    return companies.filter((c) => {
      const fields =
        filterField === 'all'
          ? [c.companyName, c.industry, c.products, c.location]
          : filterField === 'name'
            ? [c.companyName]
            : filterField === 'industry'
              ? [c.industry]
              : filterField === 'products'
                ? [c.products]
                : [c.location];
      return fields.some((field) => (field || '').toLowerCase().includes(q));
    });
  }, [companies, query, filterField]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          <h2 className="text-2xl font-bold tracking-tight text-brand-black sm:text-3xl">
            Connecting Manufacturers &amp; Suppliers Across India &amp; Japan
          </h2>
        </div>

        {/* The frosted backdrop spans the full row so cards scrolling underneath
            cannot show through beside the (narrower) search controls. */}
        <div className="sticky top-20 z-30 -mx-4 mt-8 bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:top-36">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
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

        {loading ? (
          <p className="mt-10 text-center text-sm text-brand-slate">Loading member directory...</p>
        ) : pageItems.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-black/5 bg-brand-mist p-8 text-center text-sm text-brand-slate">
            {companies.length === 0
              ? 'No approved members yet — be the first to join.'
              : `No member companies match "${query}".`}
          </p>
        ) : (
          // A single grid (rather than two manually-split columns) keeps card
          // tops aligned row-by-row when descriptions differ in length.
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {pageItems.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
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
