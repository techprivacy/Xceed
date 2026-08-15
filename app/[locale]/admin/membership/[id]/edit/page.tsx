'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import MembershipApplicationForm from '@/components/admin/MembershipApplicationForm';
import { getAdminToken, getMembershipApplication } from '@/lib/api';
import { MembershipApplication } from '@/types';

export default function EditMembershipApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await getMembershipApplication(token, id);
      setApplication(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-6">
      <AdminPageHeader title="Edit Application" subtitle={application?.companyName} />
      {loading && <p className="text-sm text-brand-slate/70">Loading...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && application && <MembershipApplicationForm application={application} />}
    </main>
  );
}
