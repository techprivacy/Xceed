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
  isActive: boolean;
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
  isActive?: boolean;
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

// Mirrors backend/src/models/Member.js MEMBERSHIP_TYPES.
export type MembershipType =
  | 'Indian Company'
  | 'Japanese Company'
  | 'Foundry / Manufacturer'
  | 'Technology / Machinery Supplier'
  | 'Industry Professional';

export interface Member {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  industry?: string;
  products?: string;
  location?: string;
  country?: string;
  website?: string;
  membershipType?: MembershipType | '';
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
  industry?: string;
  products?: string;
  location?: string;
  country?: string;
  website?: string;
  membershipType?: MembershipType | '';
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
  country?: string;
  website?: string;
  membershipType?: MembershipType | '';
  companyLogo?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  officeAddress?: string;
}

// --- Account (self-service login) + MembershipApplication (the separate,
// admin-approved business flow) — replaces Member above for new signups;
// see backend/src/models/Account.js and MembershipApplication.js. Member
// itself is left in place for whatever data hasn't been migrated yet.

export interface Account {
  _id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountRegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface MembershipApplication {
  _id: string;
  account: Account | string;
  companyName: string;
  contactPerson: string;
  industry?: string;
  products?: string;
  location?: string;
  country?: string;
  website?: string;
  membershipType?: MembershipType | '';
  companyLogo?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  officeAddress?: string;
  status: ApplicationStatus;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

// Fields shown on the public directory only, same shape as PublicMember.
export type PublicMembershipApplication = Pick<
  MembershipApplication,
  'companyName' | 'contactPerson' | 'industry' | 'products' | 'location' | 'companyLogo'
> & { _id: string };

export interface MembershipApplicationInput {
  companyName: string;
  contactPerson: string;
  industry?: string;
  products?: string;
  location?: string;
  country?: string;
  website?: string;
  membershipType?: MembershipType | '';
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

export type NewsIcon =
  | 'Newspaper'
  | 'Factory'
  | 'Handshake'
  | 'Building2'
  | 'Package'
  | 'Trophy'
  | 'Award'
  | 'Rocket'
  | 'TrendingUp';

export type NewsStatus = 'draft' | 'published';

export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  date: string;
  icon: NewsIcon;
  featured: boolean;
  status: NewsStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticleInput {
  title: string;
  slug?: string;
  category: string;
  excerpt: string;
  body: string;
  date?: string;
  icon: NewsIcon;
  featured?: boolean;
  status?: NewsStatus;
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

export type OrderItemKind = 'letters' | 'numbers' | 'holder' | 'product';

export interface OrderItem {
  kind: OrderItemKind;
  name: string;
  quantity: number;
  total: number;
  productId?: string;
  image?: string;
  details?: Record<string, unknown>;
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  customerName: string;
  companyName?: string;
  email?: string;
  mobileNumber: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  status: OrderStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderInput {
  items: OrderItem[];
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  customerName: string;
  companyName?: string;
  email?: string;
  mobileNumber: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  source?: string;
}

export type SavedCartStatus = 'new' | 'contacted' | 'converted';

export interface SavedCartItem {
  kind: OrderItemKind;
  name: string;
  quantity: number;
  total: number;
  image?: string;
  details?: Record<string, unknown>;
}

export interface SavedCart {
  _id: string;
  items: SavedCartItem[];
  grandTotal: number;
  name: string;
  email: string;
  mobileNumber: string;
  status: SavedCartStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SavedCartInput {
  items: SavedCartItem[];
  grandTotal: number;
  name: string;
  email: string;
  mobileNumber: string;
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
  // Set by PUT /api/members/:id/approve only.
  emailStatus?: 'sent' | 'not_configured' | 'failed' | 'skipped';
  temporaryPassword?: string;
}
