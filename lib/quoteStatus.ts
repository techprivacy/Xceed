import { QuoteStatus } from '@/types';

export const STATUS_OPTIONS: { value: QuoteStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'quotation_sent', label: 'Quotation Sent' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export const STATUS_TONE: Record<QuoteStatus, 'gray' | 'amber' | 'purple' | 'blue' | 'green' | 'red'> = {
  new: 'gray',
  follow_up: 'amber',
  negotiation: 'purple',
  quotation_sent: 'blue',
  won: 'green',
  lost: 'red',
};

export const STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'New',
  follow_up: 'Follow Up',
  negotiation: 'Negotiation',
  quotation_sent: 'Quotation Sent',
  won: 'Won',
  lost: 'Lost',
};
