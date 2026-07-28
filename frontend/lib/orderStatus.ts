import { OrderStatus, SavedCartStatus } from '@/types';

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'new',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const ORDER_STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const ORDER_STATUS_TONE: Record<OrderStatus, 'gray' | 'amber' | 'purple' | 'blue' | 'green' | 'red'> = {
  new: 'gray',
  confirmed: 'blue',
  processing: 'purple',
  shipped: 'amber',
  delivered: 'green',
  cancelled: 'red',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const SAVED_CART_STATUS_TONE: Record<SavedCartStatus, 'gray' | 'amber' | 'green'> = {
  new: 'gray',
  contacted: 'amber',
  converted: 'green',
};

export const SAVED_CART_STATUS_LABELS: Record<SavedCartStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted',
};
