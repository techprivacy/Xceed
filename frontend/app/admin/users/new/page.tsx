'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Button from '@/components/ui/Button';
import { getAdminToken, createUser } from '@/lib/api';
import { toast } from '@/lib/toast';
import { ASSIGNABLE_ROLES, ROLE_LABELS } from '@/lib/permissions';
import { AdminRole } from '@/types';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20';
const LABEL_CLASSES = 'mb-1 block text-xs font-semibold text-brand-charcoal';

export default function NewUserPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>(ASSIGNABLE_ROLES[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setError('');
    try {
      await createUser(token, { username, email: email || undefined, password, role });
      toast.success(`"${username}" created as ${ROLE_LABELS[role]}`);
      router.push('/admin/users');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      <AdminPageHeader title="New User" subtitle="Create a staff account with a fixed role" />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASSES}>Username</label>
            <input required value={username} onChange={(e) => setUsername(e.target.value)} className={INPUT_CLASSES} />
          </div>
          <div>
            <label className={LABEL_CLASSES}>Email (optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT_CLASSES} />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASSES}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>

        <div>
          <label className={LABEL_CLASSES}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as AdminRole)} className={INPUT_CLASSES}>
            {ASSIGNABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-brand-slate">
            Full Admin access isn&apos;t offered here — that&apos;s granted directly in the database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} variant="primary" size="sm">
            {saving && <Loader2 size={14} className="animate-spin" />}
            Create User
          </Button>
          <Button type="button" onClick={() => router.push('/admin/users')} variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
