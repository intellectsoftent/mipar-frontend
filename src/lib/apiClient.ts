export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
export const API_URL = `${BASE_URL}/api`;

/**
 * Resolves the correct token based on the endpoint being called.
 * Admin endpoints use 'admin_token'; all other authenticated endpoints use 'token'.
 * This allows a user to be logged in simultaneously as a customer AND as admin
 * without their sessions conflicting.
 */
function resolveToken(endpoint: string): string | null {
  if (endpoint.startsWith('/admin/') || endpoint.startsWith('/auth/admin/')) {
    return localStorage.getItem('admin_token');
  }
  return localStorage.getItem('token');
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = resolveToken(endpoint);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle No Content response
  if (response.status === 204) {
    return {} as T;
  }

  // Sometimes response is not JSON
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(data?.message || data || 'API Error');
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }

  return data as T;
}
