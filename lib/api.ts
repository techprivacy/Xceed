import {
  ApiResponse,
  AdminUser,
  AdminRole,
  Product,
  ProductInput,
  Category,
  QuoteRequest,
  QuoteRequestInput,
  Member,
  PublicMember,
  MemberRegisterInput,
  MemberProfileInput,
  Account,
  AccountRegisterInput,
  MembershipApplication,
  MembershipApplicationInput,
  PublicMembershipApplication,
  Order,
  OrderInput,
  SavedCart,
  SavedCartInput,
  NewsArticle,
  NewsArticleInput,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ASSET_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export const getAssetUrl = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_ORIGIN}${path}`;
};

export async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // Home page data can be revalidated periodically
    next: { revalidate: 60 },
    ...options,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
}

// --- Admin (authenticated) requests ---

export const getAdminToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem('xceed_admin_token');

export async function adminRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
}

export const getTrendingProducts = () =>
  request<Product[]>('/products?trending=true&limit=6');

export const getCategories = () =>
  request<Category[]>('/categories', { cache: 'no-store', next: undefined });

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
}

export const createCategory = (token: string, payload: CategoryInput) =>
  adminRequest<Category>('/categories', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateCategory = (token: string, id: string, payload: Partial<CategoryInput>) =>
  adminRequest<Category>(`/categories/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteCategory = (token: string, id: string) =>
  adminRequest<null>(`/categories/${id}`, token, { method: 'DELETE' });

export interface ProductListParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export const getProducts = (params: ProductListParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return request<Product[]>(`/products${query ? `?${query}` : ''}`, { cache: 'no-store', next: undefined });
};

export const getProductBySlug = (slug: string) =>
  request<Product>(`/products/${slug}`);

export const getProductById = (token: string, id: string) =>
  adminRequest<Product>(`/products/id/${id}`, token);

export const createProduct = (token: string, payload: ProductInput) =>
  adminRequest<Product>('/products', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateProduct = (token: string, id: string, payload: Partial<ProductInput>) =>
  adminRequest<Product>(`/products/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteProduct = (token: string, id: string) =>
  adminRequest<null>(`/products/${id}`, token, { method: 'DELETE' });

export const uploadProductImages = (token: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return adminRequest<string[]>('/products/upload', token, {
    method: 'POST',
    body: formData,
  });
};

export const submitQuoteRequest = (payload: QuoteRequestInput) =>
  request<QuoteRequestInput>('/quotes', {
    method: 'POST',
    body: JSON.stringify(payload),
    // Don't cache write requests
    next: undefined,
    cache: 'no-store',
  });

export interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  user: AdminUser;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Login failed');
  }
  return json;
};

// GET /api/auth/me predates this file's ApiResponse<T> convention and
// returns { success, user }, not { success, data } — verified no other
// caller exists (it was dead code until useCurrentAdmin), so this adapts to
// the endpoint's real shape rather than changing an already-shipped contract.
export const getCurrentAdmin = async (token: string): Promise<{ success: boolean; data: AdminUser }> => {
  const res = await fetch(`${API_URL}/auth/me`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return { success: json.success, data: json.user };
};

export const getUsers = (token: string) => adminRequest<AdminUser[]>('/auth/users', token);

export interface CreateUserInput {
  username: string;
  email?: string;
  password: string;
  role: AdminRole;
}

export const createUser = (token: string, payload: CreateUserInput) =>
  adminRequest<{ id: string; username: string; email?: string; role: AdminRole }>('/auth/users', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateUser = (token: string, id: string, payload: { role?: AdminRole; email?: string }) =>
  adminRequest<AdminUser>(`/auth/users/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteUser = (token: string, id: string) =>
  adminRequest<null>(`/auth/users/${id}`, token, { method: 'DELETE' });

// --- Members (public directory + registration, member self-service, admin management) ---

// Separate localStorage key from getAdminToken() so an admin and a member
// session can coexist in the same browser without clobbering each other.
export const getMemberToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem('xceed_member_token');

async function memberRequest<T>(path: string, token: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
}

export const getPublicMemberDirectory = () =>
  request<PublicMember[]>('/members/directory', { cache: 'no-store', next: undefined });

export const registerMember = (payload: MemberRegisterInput) =>
  request<{ id: string; status: string }>('/members/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    next: undefined,
    cache: 'no-store',
  });

export interface MemberLoginResponse {
  success: boolean;
  message?: string;
  token: string;
  member: { id: string; companyName: string; email: string };
}

export const memberLogin = async (email: string, password: string): Promise<MemberLoginResponse> => {
  const res = await fetch(`${API_URL}/members/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Login failed');
  }
  return json;
};

// Always resolves with the backend's generic message (never throws for
// "email not found") — the endpoint itself is deliberately non-revealing
// about whether an email is registered, see memberController.forgotPassword.
export const forgotMemberPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_URL}/members/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Something went wrong. Please try again.');
  }
  return json;
};

export const getMyMemberProfile = (token: string) => memberRequest<Member>('/members/me', token);

export const updateMyMemberProfile = (token: string, payload: MemberProfileInput) =>
  memberRequest<Member>('/members/me', token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export interface MemberListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getMembers = (token: string, params: MemberListParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return adminRequest<Member[]>(`/members${query ? `?${query}` : ''}`, token);
};

export const getMemberStats = (token: string) =>
  adminRequest<{ totalMembers: number; approvedMembers: number; pendingApprovals: number }>('/members/stats', token);

export const getMember = (token: string, id: string) => adminRequest<Member>(`/members/${id}`, token);

export interface AdminMemberUpdateInput extends MemberProfileInput {
  status?: Member['status'];
  subscriptionStatus?: Member['subscriptionStatus'];
}

export const updateMember = (token: string, id: string, payload: AdminMemberUpdateInput) =>
  adminRequest<Member>(`/members/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const approveMember = (token: string, id: string) =>
  adminRequest<Member>(`/members/${id}/approve`, token, { method: 'PUT' });

export const rejectMember = (token: string, id: string) =>
  adminRequest<Member>(`/members/${id}/reject`, token, { method: 'PUT' });

export const deleteMember = (token: string, id: string) =>
  adminRequest<null>(`/members/${id}`, token, { method: 'DELETE' });

// --- Accounts (self-service signup/login) + Membership Applications (the
// separate, admin-approved business flow) — the new system replacing
// Members above for anything going forward. See backend/src/models/
// Account.js + MembershipApplication.js for why they're split. ---

// Separate localStorage key from both getAdminToken() and getMemberToken()
// so all three kinds of session can coexist in the same browser.
export const getAccountToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem('xceed_account_token');

async function accountRequest<T>(path: string, token: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
}

export const registerAccount = async (
  payload: AccountRegisterInput
): Promise<{ success: boolean; message: string; emailStatus: string }> => {
  const res = await fetch(`${API_URL}/accounts/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Something went wrong. Please try again.');
  }
  return json;
};

export const verifyAccountEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_URL}/accounts/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'This verification link is invalid or has expired.');
  }
  return json;
};

export const resendAccountVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_URL}/accounts/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Something went wrong. Please try again.');
  }
  return json;
};

export interface AccountLoginResponse {
  success: boolean;
  message?: string;
  token: string;
  account: { id: string; fullName: string; email: string };
}

export const accountLogin = async (email: string, password: string): Promise<AccountLoginResponse> => {
  const res = await fetch(`${API_URL}/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Login failed');
  }
  return json;
};

// Always resolves with the backend's generic message — deliberately
// non-revealing about whether an email is registered, see
// accountController.forgotPassword.
export const forgotAccountPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_URL}/accounts/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Something went wrong. Please try again.');
  }
  return json;
};

export const resetAccountPassword = async (
  token: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_URL}/accounts/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'This reset link is invalid or has expired.');
  }
  return json;
};

export const getMyAccountProfile = (token: string) => accountRequest<Account>('/accounts/me', token);

export const updateMyAccountProfile = (token: string, payload: { fullName?: string }) =>
  accountRequest<Account>('/accounts/me', token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

// Admin — the "Users" list: every directly-registered account, no approval
// concept at all (contrast with getMembershipApplications below).
export const getAccounts = (token: string, params: { page?: number; limit?: number } = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined) acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return adminRequest<Account[]>(`/accounts${query ? `?${query}` : ''}`, token);
};

// --- Membership Applications ---

export const getPublicMembershipDirectory = () =>
  request<PublicMembershipApplication[]>('/membership-applications/directory', { cache: 'no-store', next: undefined });

// Requires an already-signed-in, already-verified Account — this step no
// longer creates any login credentials of its own, unlike the old
// registerMember it replaces.
export const submitMembershipApplication = (accountToken: string, payload: MembershipApplicationInput) =>
  accountRequest<{ id: string; status: string }>('/membership-applications', accountToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getMyMembershipApplication = (accountToken: string) =>
  accountRequest<MembershipApplication | null>('/membership-applications/mine', accountToken);

export interface MembershipApplicationListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getMembershipApplications = (token: string, params: MembershipApplicationListParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return adminRequest<MembershipApplication[]>(`/membership-applications${query ? `?${query}` : ''}`, token);
};

export const getMembershipApplicationStats = (token: string) =>
  adminRequest<{ approvedCompanies: number; pendingApplications: number; totalApplications: number }>(
    '/membership-applications/stats',
    token
  );

export const getMembershipApplication = (token: string, id: string) =>
  adminRequest<MembershipApplication>(`/membership-applications/${id}`, token);

export const updateMembershipApplication = (
  token: string,
  id: string,
  payload: Partial<MembershipApplicationInput> & { status?: string; subscriptionStatus?: string }
) =>
  adminRequest<MembershipApplication>(`/membership-applications/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const approveMembershipApplication = (token: string, id: string) =>
  adminRequest<MembershipApplication>(`/membership-applications/${id}/approve`, token, { method: 'PUT' });

export const rejectMembershipApplication = (token: string, id: string) =>
  adminRequest<MembershipApplication>(`/membership-applications/${id}/reject`, token, { method: 'PUT' });

export const deleteMembershipApplication = (token: string, id: string) =>
  adminRequest<null>(`/membership-applications/${id}`, token, { method: 'DELETE' });

export interface QuoteListParams {
  status?: string;
  industry?: string;
  productRequirement?: string;
  source?: string;
  salesExecutive?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getQuoteRequests = (token: string, params: QuoteListParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return adminRequest<QuoteRequest[]>(`/quotes${query ? `?${query}` : ''}`, token);
};

export const getQuoteRequest = (token: string, id: string) =>
  adminRequest<QuoteRequest>(`/quotes/${id}`, token);

export const updateQuoteRequest = (token: string, id: string, payload: Partial<QuoteRequest>) =>
  adminRequest<QuoteRequest>(`/quotes/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteQuoteRequest = (token: string, id: string) =>
  adminRequest<null>(`/quotes/${id}`, token, { method: 'DELETE' });

export const addQuoteNote = (token: string, id: string, text: string) =>
  adminRequest<QuoteRequest>(`/quotes/${id}/notes`, token, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

export const uploadCompanyLogo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/quotes/upload-logo`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to upload logo');
  }
  return json as ApiResponse<{ url: string; originalName: string }>;
};

export const uploadQuoteDrawing = (token: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return adminRequest<{ url: string; originalName: string }>('/quotes/upload', token, {
    method: 'POST',
    body: formData,
  });
};

export const emailQuotePdf = (token: string, id: string) =>
  adminRequest<null>(`/quotes/${id}/email`, token, { method: 'POST' });

// --- Orders (cart checkout) ---

export const createOrder = (payload: OrderInput) =>
  request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    next: undefined,
    cache: 'no-store',
  });

export interface OrderListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getOrders = (token: string, params: OrderListParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return adminRequest<Order[]>(`/orders${query ? `?${query}` : ''}`, token);
};

export const getOrder = (token: string, id: string) => adminRequest<Order>(`/orders/${id}`, token);

export const updateOrder = (token: string, id: string, payload: { status: Order['status'] }) =>
  adminRequest<Order>(`/orders/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteOrder = (token: string, id: string) =>
  adminRequest<null>(`/orders/${id}`, token, { method: 'DELETE' });

// --- Saved Carts ("Save Cart" popup) ---

export const createSavedCart = (payload: SavedCartInput) =>
  request<SavedCart>('/saved-carts', {
    method: 'POST',
    body: JSON.stringify(payload),
    next: undefined,
    cache: 'no-store',
  });

export interface SavedCartListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getSavedCarts = (token: string, params: SavedCartListParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return adminRequest<SavedCart[]>(`/saved-carts${query ? `?${query}` : ''}`, token);
};

export const updateSavedCart = (token: string, id: string, payload: { status: SavedCart['status'] }) =>
  adminRequest<SavedCart>(`/saved-carts/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteSavedCart = (token: string, id: string) =>
  adminRequest<null>(`/saved-carts/${id}`, token, { method: 'DELETE' });

export const downloadQuotePdf = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/quotes/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to download quotation PDF');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `XCEED-Quote-${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

// --- News & Awards articles ---

export interface NewsListParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
}

export const getNewsArticles = (params: NewsListParams = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== '') acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return request<NewsArticle[]>(`/news${query ? `?${query}` : ''}`, { cache: 'no-store', next: undefined });
};

export const getNewsArticleBySlug = (slug: string) => request<NewsArticle>(`/news/${slug}`);

export const getNewsArticleById = (token: string, id: string) => adminRequest<NewsArticle>(`/news/id/${id}`, token);

export const createNewsArticle = (token: string, payload: NewsArticleInput) =>
  adminRequest<NewsArticle>('/news', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateNewsArticle = (token: string, id: string, payload: Partial<NewsArticleInput>) =>
  adminRequest<NewsArticle>(`/news/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteNewsArticle = (token: string, id: string) =>
  adminRequest<null>(`/news/${id}`, token, { method: 'DELETE' });
