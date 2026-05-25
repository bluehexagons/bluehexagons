// Typed client for the shop/account API. All requests send credentials so the
// session cookie flows; the API base is configurable per build via VITE_API_BASE
// (e.g. https://api.bluehexagons.com), defaulting to the local dev server.
const API_BASE: string = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

export interface User {
  id: number;
  email: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
}

export interface CheckoutItem {
  product_id: number;
  quantity: number;
}

export interface CheckoutResult {
  order_id: number;
  checkout_url: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(API_BASE + path, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? res.statusText);
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string) => request<User>('POST', '/api/register', { email, password }),
  login: (email: string, password: string) => request<User>('POST', '/api/login', { email, password }),
  logout: () => request<{ status: string }>('POST', '/api/logout'),
  me: () => request<User>('GET', '/api/me'),
  products: () => request<Product[]>('GET', '/api/products'),
  checkout: (items: CheckoutItem[]) => request<CheckoutResult>('POST', '/api/checkout', { items }),
};
