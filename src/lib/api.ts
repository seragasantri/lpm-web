const API_BASE = import.meta.env.VITE_API_URL || 'http://api-lpm.test/api';

function getToken(): string | null {
  return localStorage.getItem('lpm_token');
}

function getUser(): string | null {
  return localStorage.getItem('lpm_user');
}

function setToken(token: string) {
  localStorage.setItem('lpm_token', token);
}

function setUser(user: string) {
  localStorage.setItem('lpm_user', user);
}

function clearAuth() {
  localStorage.removeItem('lpm_token');
  localStorage.removeItem('lpm_user');
}

async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    roles: string[];
    permissions: string[];
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const json: ApiResponse<LoginResponse> = await response.json();

  if (!json.success) {
    throw new Error(json.message || 'Login gagal');
  }

  // Simpan token dan user (normalized for frontend use)
  setToken(json.data.access_token);
  const normalizedUser = {
    ...json.data.user,
    isActive: json.data.user.is_active,
    permissions: (json.data.user.permissions || []).map((p: string) => p.replace(/_/g, '.')),
  };
  setUser(JSON.stringify(normalizedUser));

  return json.data;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    // ignore error
  }
  clearAuth();
}

export async function getMe(): Promise<LoginResponse['user']> {
  const response = await apiFetch('/auth/me');
  const json: ApiResponse<LoginResponse['user']> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function refreshToken(): Promise<string> {
  const response = await apiFetch('/auth/refresh', { method: 'POST' });
  const json: ApiResponse<{ access_token: string }> = await response.json();
  if (!json.success) throw new Error(json.message);
  const token = json.data.access_token;
  setToken(token);
  return token;
}

export { getToken, getUser, setToken, setUser, clearAuth, apiFetch, API_BASE };