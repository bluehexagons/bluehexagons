// Typed client for the shop/account API. All requests send credentials so the
// session cookie flows; the API base is configurable per build via VITE_API_BASE
// (e.g. http://localhost:8080). Without an explicit override, local dev talks
// to the local API while production uses the same-origin /api path.
const configuredApiBase = import.meta.env.VITE_API_BASE?.trim();
const API_BASE = normalizeApiBase(configuredApiBase || defaultApiBase());

export interface User {
  id: number;
  email: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  kind: 'digital' | 'physical';
  previews: ProductAsset[];
}

export interface ProductAsset {
  id: number;
  product_id?: number;
  role: 'preview' | 'download';
  filename: string;
  content_type: string;
  size_bytes: number;
  sort_order: number;
  url: string;
}

export interface CheckoutItem {
  product_id: number;
  quantity: number;
}

export interface CheckoutResult {
  order_id: number;
  checkout_url: string;
}

export interface AdminProductInput {
  sku: string;
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  kind: 'digital' | 'physical';
  post_purchase_text: string;
  active: boolean;
}

export interface ProductKeyStats {
  total: number;
  remaining: number;
  claimed: number;
}

export interface AdminProductKey {
  id: number;
  product_id: number;
  key_text: string;
  claimed_order_item_id: number | null;
  claimed_user_id: number | null;
  claimed_user_email?: string;
  claimed_at: number | null;
  created_at: number;
}

export interface AdminProduct extends Product {
  active: boolean;
  post_purchase_text: string;
  downloads: ProductAsset[];
  key_stats: ProductKeyStats;
  keys?: AdminProductKey[];
}

export interface ClaimedKey {
  id: number;
  key_text: string;
  claimed_at: number;
}

export interface PurchasedKeyStats {
  total: number;
  remaining: number;
  claimable: number;
  claimed: ClaimedKey[];
}

export interface PurchasedItem {
  order_item_id: number;
  product_id: number;
  title: string;
  description: string;
  quantity: number;
  post_purchase_text: string;
  downloads: ProductAsset[];
  keys: PurchasedKeyStats;
}

export interface OrderDeliverables {
  order_id: number;
  status: string;
  created_at: number;
  items: PurchasedItem[];
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function defaultApiBase(): string {
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return 'http://localhost:8080';
  }
  return window.location.origin;
}

function normalizeApiBase(base: string): string {
  return base.replace(/\/+$/, '');
}

function messageFromErrorBody(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const message = (data as { error?: unknown }).error;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const res = await fetch(API_BASE + path, {
    method,
    credentials: 'include',
    headers: body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      if (!res.ok) throw new ApiError(res.status, res.statusText || 'Request failed');
      throw new Error('Invalid API response');
    }
  }
  if (!res.ok) {
    throw new ApiError(res.status, messageFromErrorBody(data, res.statusText || 'Request failed'));
  }
  return data as T;
}

export function apiURL(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return API_BASE + (path.startsWith('/') ? path : `/${path}`);
}

export const api = {
  register: (email: string, password: string) => request<User>('POST', '/api/register', { email, password }),
  login: (email: string, password: string) => request<User>('POST', '/api/login', { email, password }),
  logout: () => request<{ status: string }>('POST', '/api/logout'),
  me: () => request<User>('GET', '/api/me'),
  products: () => request<Product[]>('GET', '/api/products'),
  checkout: (items: CheckoutItem[]) => request<CheckoutResult>('POST', '/api/checkout', { items }),
  orderDeliverables: (orderId: number) => request<OrderDeliverables>('GET', `/api/orders/${orderId}/deliverables`),
  claimKey: (orderItemId: number) => request<ClaimedKey>('POST', `/api/order-items/${orderItemId}/claim-key`),
  adminProducts: () => request<AdminProduct[]>('GET', '/api/admin/products'),
  adminProduct: (id: number) => request<AdminProduct>('GET', `/api/admin/products/${id}`),
  createAdminProduct: (product: AdminProductInput) => request<AdminProduct>('POST', '/api/admin/products', product),
  updateAdminProduct: (id: number, product: AdminProductInput) =>
    request<AdminProduct>('PATCH', `/api/admin/products/${id}`, product),
  uploadProductAsset: (productId: number, form: FormData) =>
    request<ProductAsset>('POST', `/api/admin/products/${productId}/assets`, form),
  addProductKeys: (productId: number, text: string) => request<AdminProduct>('POST', `/api/admin/products/${productId}/keys`, { text }),
  deleteAdminAsset: (id: number) => request<{ status: string }>('DELETE', `/api/admin/assets/${id}`),
  deleteAdminKey: (id: number) => request<{ status: string }>('DELETE', `/api/admin/keys/${id}`),
};
