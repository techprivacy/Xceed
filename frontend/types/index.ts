export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
}

export type ConfiguratorType = 'none' | 'cast_letters' | 'cast_numbers' | 'holder';

export interface SizePrice {
  size: string;
  price: number;
}

// { [size]: { GLUE | SCREW: { [capacity]: price } } }
export type HolderPriceMatrix = Record<string, Record<string, Record<string, number>>>;

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
  configuratorType?: ConfiguratorType;
  sizePricing?: SizePrice[];
  holderPriceMatrix?: HolderPriceMatrix;
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
  configuratorType?: ConfiguratorType;
  sizePricing?: SizePrice[];
  holderPriceMatrix?: HolderPriceMatrix;
}

export interface QuoteRequestInput {
  companyName: string;
  mobileNumber: string;
  productRequirement: string;
  quantity?: string;
  city?: string;
  state?: string;
  whatsappNumber?: string;
  officeAddress?: string;
  industry?: string;
  specialRequirement?: string;
  contactPerson?: string;
  email?: string;
  source?: string;
  companyLogo?: string;
}

export type QuoteStatus = 'new' | 'follow_up' | 'negotiation' | 'quotation_sent' | 'won' | 'lost';

// Keep in sync with backend/src/config/permissions.js ASSIGNABLE_ROLES (+'admin').
export type AdminRole = 'admin' | 'staff' | 'product_manager' | 'directory_manager';

export interface AdminUser {
  _id: string;
  username: string;
  email?: string;
  role: AdminRole;
}

export type MemberStatus = 'pending' | 'approved' | 'rejected';
export type SubscriptionStatus = 'none' | 'active' | 'expired';

export interface Member {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  industry?: string;
  products?: string;
  location?: string;
  companyLogo?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  officeAddress?: string;
  status: MemberStatus;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

// Fields shown on the public directory only — no email, matching what
// GET /api/members/directory actually returns.
export type PublicMember = Pick<
  Member,
  'companyName' | 'contactPerson' | 'industry' | 'products' | 'location' | 'companyLogo'
> & { _id: string };

export interface MemberRegisterInput {
  companyName: string;
  contactPerson: string;
  email: string;
  password: string;
  industry?: string;
  products?: string;
  location?: string;
  companyLogo?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  officeAddress?: string;
}

export interface MemberProfileInput {
  companyName?: string;
  contactPerson?: string;
  industry?: string;
  products?: string;
  location?: string;
  companyLogo?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  officeAddress?: string;
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
  whatsappNumber?: string;
  city?: string;
  state?: string;
  officeAddress?: string;
  companyLogo?: string;
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

export interface ThemePalette {
  primary: string;
  primaryDark: string;
  secondary: string;
  dark: string;
  surface: string;
  muted: string;
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
