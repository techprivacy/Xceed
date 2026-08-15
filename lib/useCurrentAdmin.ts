'use client';

import { useEffect, useState } from 'react';
import { getAdminToken, getCurrentAdmin } from '@/lib/api';
import { AdminUser } from '@/types';

// Login only ever stored the raw token (see app/[locale]/login/page.tsx),
// so nothing client-side knew the logged-in admin's role until now. Used to
// filter admin nav/pages by permission — the API enforces the real boundary
// regardless of what this returns.
export function useCurrentAdmin() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentAdmin(token)
      .then((res) => setAdmin(res.data))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  return { admin, loading };
}
