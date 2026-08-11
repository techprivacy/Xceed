'use client';

import { useEffect, useRef } from 'react';
import { getAdminToken, getQuoteRequests, getOrders, getSavedCarts } from '@/lib/api';
import { toast } from '@/lib/toast';
import { AdminRole } from '@/types';

const POLL_MS = 20000;

// Lightweight "real-time" notifications without standing up websockets: every
// 20s, re-check each admin-only inbox's total count and toast the delta. The
// first poll only records a baseline — it never toasts for a backlog that was
// already sitting there when the admin logged in.
export function useAdminNotifications(role: AdminRole | undefined) {
  const baseline = useRef<{ quotes: number; orders: number; savedCarts: number } | null>(null);

  useEffect(() => {
    if (role !== 'admin') return;
    const token = getAdminToken();
    if (!token) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const [quotesRes, ordersRes, cartsRes] = await Promise.all([
          getQuoteRequests(token, { limit: 1 }),
          getOrders(token, { limit: 1 }),
          getSavedCarts(token, { limit: 1 }),
        ]);
        if (cancelled) return;

        const next = {
          quotes: quotesRes.total ?? 0,
          orders: ordersRes.total ?? 0,
          savedCarts: cartsRes.total ?? 0,
        };

        if (baseline.current) {
          const prev = baseline.current;
          if (next.orders > prev.orders) {
            toast.success(`${next.orders - prev.orders} new order${next.orders - prev.orders > 1 ? 's' : ''} received`);
          }
          if (next.quotes > prev.quotes) {
            toast.success(`${next.quotes - prev.quotes} new enquir${next.quotes - prev.quotes > 1 ? 'ies' : 'y'} received`);
          }
          if (next.savedCarts > prev.savedCarts) {
            toast.success(`${next.savedCarts - prev.savedCarts} cart${next.savedCarts - prev.savedCarts > 1 ? 's' : ''} saved for follow-up`);
          }
        }
        baseline.current = next;
      } catch {
        // Silent — this is a background poll, not a user-initiated action.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [role]);
}
