// Typed client for the shop/account API. All requests send credentials so the
// session cookie flows; the API base is configurable per build via VITE_API_BASE
// (e.g. https://api.bluehexagons.com). Without an explicit override, local dev
// talks to the local API while production talks to the deployed API subdomain.
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

function defaultApiBase(): string {
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return 'http://localhost:8080';
  }
  if (hostname === 'bluehexagons.com' || hostname === 'www.bluehexagons.com') {
    return 'https://api.bluehexagons.com';
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
  const res = await fetch(API_BASE + path, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
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

export const api = {
  register: (email: string, password: string) => request<User>('POST', '/api/register', { email, password }),
  login: (email: string, password: string) => request<User>('POST', '/api/login', { email, password }),
  logout: () => request<{ status: string }>('POST', '/api/logout'),
  me: () => request<User>('GET', '/api/me'),
  products: () => request<Product[]>('GET', '/api/products'),
  checkout: (items: CheckoutItem[]) => request<CheckoutResult>('POST', '/api/checkout', { items }),
};
