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
  const lang = localStorage.getItem('language') || 'id';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Language': lang,
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

// Permissions
export interface Permission {
  id: number;
  name: string;
  aplikasi: string;
  modul?: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export async function getPermissions(): Promise<Permission[]> {
  const response = await apiFetch('/permissions');
  const json: ApiResponse<Permission[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createPermission(data: { name: string; aplikasi?: string }): Promise<Permission> {
  const response = await apiFetch('/permissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Permission> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updatePermission(id: number, data: { name: string; aplikasi?: string }): Promise<Permission> {
  const response = await apiFetch(`/permissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Permission> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deletePermission(id: number): Promise<void> {
  const response = await apiFetch(`/permissions/${id}`, { method: 'DELETE' });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Activity Logs
export interface ActivityLog {
  id: number;
  user_id: number;
  username: string;
  action: string;
  module: string;
  detail: string | null;
  timestamp: string;
}

export async function getLogs(): Promise<ActivityLog[]> {
  const response = await apiFetch('/logs');
  if (!response.ok) {
    console.warn('API /logs tidak tersedia, menggunakan mock data');
    return getMockLogs();
  }
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    console.warn('API /logs mengembalikan HTML bukan JSON, menggunakan mock data');
    return getMockLogs();
  }
  const json: ApiResponse<ActivityLog[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

function getMockLogs(): ActivityLog[] {
  return [
    { id: 1, user_id: 1, username: 'admin', action: 'LOGIN', module: 'auth', detail: 'User login successful', timestamp: new Date().toISOString() },
    { id: 2, user_id: 1, username: 'admin', action: 'CREATE', module: 'berita', detail: 'Membuat berita baru: Selamat Datang', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, user_id: 1, username: 'admin', action: 'UPDATE', module: 'berita', detail: 'Mengupdate berita: Struktur Organisasi', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, user_id: 1, username: 'admin', action: 'PUBLISH', module: 'berita', detail: 'Mem-publish berita: GPMP 2026', timestamp: new Date(Date.now() - 10800000).toISOString() },
    { id: 5, user_id: 1, username: 'admin', action: 'LOGOUT', module: 'auth', detail: 'User logout', timestamp: new Date(Date.now() - 14400000).toISOString() },
  ];
}

export async function clearLogs(): Promise<void> {
  const response = await apiFetch('/logs', { method: 'DELETE' });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Roles
export interface RoleResponse {
  id: number;
  name: string;
  guard_name: string;
  permissions: { name: string }[];
  created_at: string;
  updated_at: string;
}

export async function getRoles(): Promise<RoleResponse[]> {
  const response = await apiFetch('/roles');
  const json: ApiResponse<RoleResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createRole(data: { name: string; permissions: string[] }): Promise<RoleResponse> {
  const response = await apiFetch('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<RoleResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateRole(id: number, data: { name: string; permissions: string[] }): Promise<RoleResponse> {
  const response = await apiFetch(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<RoleResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteRole(id: number): Promise<void> {
  const response = await apiFetch(`/roles/${id}`, { method: 'DELETE' });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Settings
export async function getSettings(): Promise<Record<string, string>> {
  const response = await apiFetch('/settings');
  const json: ApiResponse<Record<string, string>> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateSettings(data: { enabled_languages: string[] }): Promise<{ enabled_languages: string[] }> {
  const response = await apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<{ enabled_languages: string[] }> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Users
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role_ids: number[];
  roles: { id: number; name: string }[];
  permissions: string[];
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface CreateUserData {
  username: string;
  email: string;
  password?: string;
  role_ids: number[];
  is_active: boolean;
}

export async function getUsers(): Promise<UserResponse[]> {
  const response = await apiFetch('/users');
  const json: ApiResponse<UserResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getUserById(id: number): Promise<UserResponse> {
  const response = await apiFetch(`/users/${id}`);
  const json: ApiResponse<UserResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createUser(data: CreateUserData): Promise<UserResponse> {
  const response = await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<UserResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateUser(id: number, data: Partial<CreateUserData>): Promise<UserResponse> {
  const response = await apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<UserResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteUser(id: number): Promise<void> {
  const response = await apiFetch(`/users/${id}`, { method: 'DELETE' });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

export async function toggleUserActive(id: number): Promise<UserResponse> {
  const response = await apiFetch(`/users/${id}/toggle-active`, { method: 'PATCH' });
  const json: ApiResponse<UserResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Berita
export interface BeritaResponse {
  id: number;
  judul: string;
  slug: string;
  kategoris_id: number;
  kategori: {
    id: number;
    nama: string;
    slug: string;
  };
  tanggal: string;
  gambar?: string;
  excerpt?: string;
  konten: string;
  status: 'draft' | 'published' | 'archived';
  meta_title?: string;
  author_id: number;
  author: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface BeritaListResponse {
  data: BeritaResponse[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateBeritaData {
  judul: string;
  slug?: string;
  kategoris_id: number;
  tanggal: string;
  gambar?: string;
  excerpt?: string;
  konten: string;
  status?: 'draft' | 'published' | 'archived';
  meta_title?: string;
}

export interface GetBeritasParams {
  per_page?: number;
  page?: number;
  search?: string;
  status?: string;
  kategori_id?: number;
}

export async function getBeritas(params?: GetBeritasParams): Promise<BeritaListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.per_page) searchParams.set('per_page', String(params.per_page));
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.kategori_id) searchParams.set('kategori_id', String(params.kategori_id));

  const query = searchParams.toString();
  const response = await apiFetch(`/beritas${query ? `?${query}` : ''}`);
  const json: ApiResponse<BeritaListResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getBerita(id: number): Promise<BeritaResponse> {
  const response = await apiFetch(`/beritas/${id}`);
  const json: ApiResponse<BeritaResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createBerita(data: CreateBeritaData): Promise<BeritaResponse> {
  const response = await apiFetch('/beritas', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<BeritaResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateBerita(id: number, data: Partial<CreateBeritaData>): Promise<BeritaResponse> {
  const response = await apiFetch(`/beritas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<BeritaResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteBerita(id: number): Promise<void> {
  const response = await apiFetch(`/beritas/${id}`, { method: 'DELETE' });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

export { getToken, getUser as getStoredUser, setToken, setUser, clearAuth, apiFetch, API_BASE };