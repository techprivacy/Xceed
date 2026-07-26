'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import MemberForm from '@/components/admin/MemberForm';
import { getAdminToken, getMember } from '@/lib/api';
import { Member } from '@/types';

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await getMember(token, id);
      setMember(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load member');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-6">
      <AdminPageHeader title="Edit Member" subtitle={member?.companyName} />
      {loading && <p className="text-sm text-brand-slate/70">Loading...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && member && <MemberForm member={member} />}
    </main>
  );
}
