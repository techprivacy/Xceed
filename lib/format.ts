import { Product } from '@/types';

const UNIT_LABEL: Record<Product['priceUnit'], string> = {
  per_letter: 'per letter',
  per_piece: '',
  per_set: 'per set',
};

export function unitLabel(priceUnit?: Product['priceUnit']) {
  return priceUnit ? UNIT_LABEL[priceUnit] : '';
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}
