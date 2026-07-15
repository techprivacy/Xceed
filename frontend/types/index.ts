export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: Category | string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  price: number;
  priceUnit: 'per_letter' | 'per_piece' | 'per_set';
  currency: string;
  minOrderQty: number;
  inStock: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  tags?: string[];
}

export interface ProductInput {
  name: string;
  slug: string;
  category: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  price: number;
  priceUnit: 'per_letter' | 'per_piece' | 'per_set';
  currency?: string;
  minOrderQty?: number;
  inStock?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  tags?: string[];
}

export interface QuoteRequestInput {
  companyName: string;
  mobileNumber: string;
  productRequirement: string;
  quantity?: string;
  city?: string;
}

export type QuoteStatus = 'new' | 'follow_up' | 'negotiation' | 'quotation_sent' | 'won' | 'lost';

export interface AdminUser {
  _id: string;
  username: string;
  email?: string;
  role: 'admin' | 'staff';
}

export interface QuoteNote {
  _id: string;
  text: string;
  addedBy?: AdminUser | string;
  createdAt: string;
}

export interface QuoteRequest {
  _id: string;
  companyName: string;
  gstNumber?: string;
  industry?: string;
  contactPerson?: string;
  email?: string;
  mobileNumber: string;
  city?: string;
  state?: string;
  productRequirement: string;
  quantity?: string;
  specialRequirement?: string;
  drawingUrl?: string;
  salesExecutive?: AdminUser | string;
  status: QuoteStatus;
  internalNotes: QuoteNote[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}
