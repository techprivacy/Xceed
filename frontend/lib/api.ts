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

export interface AiDescriptionParams {
  name: string;
  categoryName?: string;
  tags?: string[];
  priceUnit?: string;
}

export const generateProductDescription = (token: string, params: AiDescriptionParams) =>
  adminRequest<{ shortDescription: string; description: string }>('/products/ai/description', token, {
    method: 'POST',
    body: JSON.stringify(params),
  });

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
