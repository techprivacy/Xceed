'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { getAdminToken, updateOrder } from '@/lib/api';
import { toast } from '@/lib/toast';
import { formatINR } from '@/lib/format';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from '@/lib/orderStatus';
import { Order, OrderStatus } from '@/types';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdated: (order: Order) => void;
}

export default function OrderDetailModal({ order, onClose, onUpdated }: OrderDetailModalProps) {
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (status: OrderStatus) => {
    const token = getAdminToken();
    if (!token) return;
    setSaving(true);
    try {
      const res = await updateOrder(token, order._id, { status });
      onUpdated(res.data);
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-brand-black">
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-brand-slate hover:bg-brand-mist"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 rounded-xl bg-brand-mist p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Customer</p>
            <p className="font-semibold text-brand-black">{order.customerName}</p>
            {order.companyName && <p className="text-brand-slate">{order.companyName}</p>}
            <p className="text-brand-slate">{order.mobileNumber}</p>
            {order.email && <p className="text-brand-slate">{order.email}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Delivery</p>
            <p className="text-brand-slate">{order.address || '—'}</p>
            <p className="text-brand-slate">
              {[order.city, order.state].filter(Boolean).join(', ') || '—'}
            </p>
            {order.notes && <p className="mt-1 italic text-brand-slate">&ldquo;{order.notes}&rdquo;</p>}
          </div>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-slate">Items</p>
        <div className="mb-5 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-2.5 text-sm">
              <div>
                <p className="font-semibold text-brand-black">{item.name}</p>
                <p className="text-xs text-brand-slate">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold text-brand-black">{formatINR(item.total)}</p>
            </div>
          ))}
        </div>

        <div className="mb-5 space-y-1 rounded-xl bg-brand-mist p-4 text-sm">
          <div className="flex justify-between text-brand-slate">
            <span>Subtotal</span>
            <span>{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-brand-slate">
            <span>GST</span>
            <span>{formatINR(order.gstTotal)}</span>
          </div>
          <div className="flex justify-between border-t border-black/5 pt-1 text-base font-bold text-brand-black">
            <span>Total</span>
            <span>{formatINR(order.grandTotal)}</span>
          </div>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-slate">Status</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUS_FLOW.map((s) => (
            <button
              key={s}
              type="button"
              disabled={saving}
              onClick={() => handleStatusChange(s)}
              className={`disabled:opacity-50 ${order.status === s ? '' : 'opacity-40 hover:opacity-100'}`}
            >
              <Badge tone={ORDER_STATUS_TONE[s]}>{ORDER_STATUS_LABELS[s]}</Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
