import { getSession } from 'next-auth/react';
import type { ApiResponseShape } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

function isApiResponseShape<T>(value: unknown): value is ApiResponseShape<T> {
  if (typeof value !== 'object' || value === null) return false;
  return 'success' in value && 'statusCode' in value && 'data' in value;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const token = session?.user?.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiClient<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const authHeaders = skipAuth ? {} : await getAuthHeaders();

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const json: unknown = await response.json();

  // BE wrap theo ApiResponseShape<T> => FE nhận trực tiếp data
  if (isApiResponseShape<T>(json)) {
    if (!json.success) {
      throw new Error(json.message || `API Error: ${response.status}`);
    }
    return json.data as T;
  }

  return json as T;
}

// Server-side version (for route handlers like NextAuth)
export async function serverApiClient<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const json: unknown = await response.json();

  if (isApiResponseShape<T>(json)) {
    if (!json.success) {
      throw new Error(json.message || `API Error: ${response.status}`);
    }
    return json.data as T;
  }

  return json as T;
}
