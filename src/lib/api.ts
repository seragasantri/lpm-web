const API_BASE = import.meta.env.VITE_API_URL || "https://api-lpm.test/api";

function getToken(): string | null {
  return localStorage.getItem("lpm_token");
}

function getUser(): string | null {
  return localStorage.getItem("lpm_user");
}

function setToken(token: string) {
  localStorage.setItem("lpm_token", token);
}

function setUser(user: string) {
  localStorage.setItem("lpm_user", user);
}

function clearAuth() {
  localStorage.removeItem("lpm_token");
  localStorage.removeItem("lpm_user");
}

async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  const lang = localStorage.getItem("language") || "id";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Language": lang,
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    clearAuth();
    // Redirect to login if not already on login page
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }

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

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const json: ApiResponse<LoginResponse> = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Login gagal");
  }

  // Simpan token dan user (normalized for frontend use)
  setToken(json.data.access_token);
  const normalizedUser = {
    ...json.data.user,
    isActive: json.data.user.is_active,
    permissions: (json.data.user.permissions || []).map((p: string) =>
      p.replace(/_/g, "."),
    ),
  };
  setUser(JSON.stringify(normalizedUser));

  return json.data;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // ignore error
  }
  clearAuth();
}

export async function getMe(): Promise<LoginResponse["user"]> {
  const response = await apiFetch("/auth/me");
  const json: ApiResponse<LoginResponse["user"]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function refreshToken(): Promise<string> {
  const response = await apiFetch("/auth/refresh", { method: "POST" });
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
  const response = await apiFetch("/permissions");
  const json: ApiResponse<Permission[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createPermission(data: {
  name: string;
  aplikasi?: string;
}): Promise<Permission> {
  const response = await apiFetch("/permissions", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Permission> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updatePermission(
  id: number,
  data: { name: string; aplikasi?: string },
): Promise<Permission> {
  const response = await apiFetch(`/permissions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Permission> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deletePermission(id: number): Promise<void> {
  const response = await apiFetch(`/permissions/${id}`, { method: "DELETE" });
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
  const response = await apiFetch("/logs");
  if (!response.ok) {
    console.warn("API /logs tidak tersedia, menggunakan mock data");
    return getMockLogs();
  }
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    console.warn(
      "API /logs mengembalikan HTML bukan JSON, menggunakan mock data",
    );
    return getMockLogs();
  }
  const json: ApiResponse<ActivityLog[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

function getMockLogs(): ActivityLog[] {
  return [
    {
      id: 1,
      user_id: 1,
      username: "admin",
      action: "LOGIN",
      module: "auth",
      detail: "User login successful",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      user_id: 1,
      username: "admin",
      action: "CREATE",
      module: "berita",
      detail: "Membuat berita baru: Selamat Datang",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      user_id: 1,
      username: "admin",
      action: "UPDATE",
      module: "berita",
      detail: "Mengupdate berita: Struktur Organisasi",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 4,
      user_id: 1,
      username: "admin",
      action: "PUBLISH",
      module: "berita",
      detail: "Mem-publish berita: GPMP 2026",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 5,
      user_id: 1,
      username: "admin",
      action: "LOGOUT",
      module: "auth",
      detail: "User logout",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
  ];
}

export async function clearLogs(): Promise<void> {
  const response = await apiFetch("/logs", { method: "DELETE" });
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
  const response = await apiFetch("/roles");
  const json: ApiResponse<RoleResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createRole(data: {
  name: string;
  permissions: string[];
}): Promise<RoleResponse> {
  const response = await apiFetch("/roles", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<RoleResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateRole(
  id: number,
  data: { name: string; permissions: string[] },
): Promise<RoleResponse> {
  const response = await apiFetch(`/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<RoleResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteRole(id: number): Promise<void> {
  const response = await apiFetch(`/roles/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Settings
export async function getSettings(): Promise<Record<string, string>> {
  const response = await apiFetch("/settings");
  const json: ApiResponse<Record<string, string>> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Public Settings (no auth, no redirect)
export async function getPublicSettings(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${API_BASE}/public/settings`);
    if (!response.ok) return {};
    const json: ApiResponse<Record<string, string>> = await response.json();
    if (!json.success) return {};
    return json.data || {};
  } catch {
    return {};
  }
}

// Settings - Logo & Favicon
export async function updateSettingImage(
  key: string,
  imageUrl: string,
): Promise<Record<string, string>> {
  const response = await apiFetch("/settings/image", {
    method: "POST",
    body: JSON.stringify({ key, image_url: imageUrl }),
  });
  const json: ApiResponse<Record<string, string>> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateSettings(data: {
  enabled_languages?: string[];
  logo_url?: string;
  favicon_url?: string;
}): Promise<Record<string, string>> {
  const response = await apiFetch("/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Record<string, string>> = await response.json();
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
  const response = await apiFetch("/users");
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
  const response = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<UserResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateUser(
  id: number,
  data: Partial<CreateUserData>,
): Promise<UserResponse> {
  const response = await apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<UserResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteUser(id: number): Promise<void> {
  const response = await apiFetch(`/users/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

export async function toggleUserActive(id: number): Promise<UserResponse> {
  const response = await apiFetch(`/users/${id}/toggle-active`, {
    method: "PATCH",
  });
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
    created_at: string;
    updated_at: string;
  };
  tanggal: string;
  gambar: string | null;
  excerpt: string | null;
  konten: string;
  status: "draft" | "published" | "archived";
  meta_title: string | null;
  author_id: number;
  author: {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at: string | null;
    is_active: boolean;
    last_login: string | null;
    created_at: string;
    updated_at: string;
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
  status?: "draft" | "published" | "archived";
  meta_title?: string;
}

export interface GetBeritasParams {
  per_page?: number;
  page?: number;
  search?: string;
  status?: string;
  kategori_id?: number;
}

export async function getBeritas(
  params?: GetBeritasParams,
): Promise<BeritaListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.kategori_id)
    searchParams.set("kategori_id", String(params.kategori_id));

  const query = searchParams.toString();
  const response = await apiFetch(`/beritas${query ? `?${query}` : ""}`);
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

export async function createBerita(
  data: CreateBeritaData,
  tagIds?: number[],
): Promise<BeritaResponse> {
  const body: CreateBeritaData & { tag_ids?: number[] } = { ...data };
  if (tagIds && tagIds.length > 0) {
    body.tag_ids = tagIds;
  }
  const response = await apiFetch("/beritas", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json: ApiResponse<BeritaResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateBerita(
  id: number,
  data: Partial<CreateBeritaData>,
  tagIds?: number[],
): Promise<BeritaResponse> {
  const body: Partial<CreateBeritaData> & { tag_ids?: number[] } = { ...data };
  if (tagIds !== undefined) {
    body.tag_ids = tagIds;
  }
  const response = await apiFetch(`/beritas/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const json: ApiResponse<BeritaResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteBerita(id: number): Promise<void> {
  const response = await apiFetch(`/beritas/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

export async function getBeritaBySlug(slug: string): Promise<BeritaResponse> {
  const response = await fetch(`${API_BASE}/public/beritas/${slug}`);
  const json: ApiResponse<BeritaResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getPublicBeritas(params?: GetBeritasParams): Promise<{
  data: BeritaResponse[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.kategori_id)
    searchParams.set("kategori_id", String(params.kategori_id));

  const query = searchParams.toString();
  const response = await fetch(
    `${API_BASE}/public/beritas${query ? `?${query}` : ""}`,
  );
  const json: ApiResponse<{
    data: BeritaResponse[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export interface UploadResponse {
  url: string;
  original_name: string;
  size: number;
  mime_type: string;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();
  const lang = localStorage.getItem("language") || "id";
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Language": lang,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/upload/image`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json: ApiResponse<UploadResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ============ Galeri ============
export interface GaleriResponse {
  id: number;
  judul: string;
  gambar: string;
  kategori: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGaleriData {
  judul: string;
  gambar: string;
  kategori: string;
  tanggal: string;
}

export async function getGaleris(params?: {
  per_page?: number;
  page?: number;
  search?: string;
  kategori?: string;
}): Promise<{
  data: GaleriResponse[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.kategori) searchParams.set("kategori", params.kategori);

  const query = searchParams.toString();
  const response = await apiFetch(`/galeris${query ? `?${query}` : ""}`);
  const json: ApiResponse<{
    data: GaleriResponse[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getGaleri(id: number): Promise<GaleriResponse> {
  const response = await apiFetch(`/galeris/${id}`);
  const json: ApiResponse<GaleriResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createGaleri(
  data: CreateGaleriData,
): Promise<GaleriResponse> {
  const response = await apiFetch("/galeris", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<GaleriResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateGaleri(
  id: number,
  data: Partial<CreateGaleriData>,
): Promise<GaleriResponse> {
  const response = await apiFetch(`/galeris/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<GaleriResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getPublicGaleris(params?: {
  per_page?: number;
}): Promise<GaleriResponse[]> {
  const searchParams = new URLSearchParams();
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));

  const query = searchParams.toString();
  const response = await fetch(
    `${API_BASE}/public/galeris${query ? `?${query}` : ""}`,
  );
  const json: ApiResponse<GaleriResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteGaleri(id: number): Promise<void> {
  const response = await apiFetch(`/galeris/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// ============ Kategori Galeri ============
export interface KategoriGaleriResponse {
  id: number;
  nama: string;
  slug: string;
  warna: string;
  created_at: string;
  updated_at: string;
}

export async function getKategoriGaleris(): Promise<KategoriGaleriResponse[]> {
  const response = await apiFetch("/kategori-galeris");
  const json: ApiResponse<KategoriGaleriResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createKategoriGaleri(data: {
  nama: string;
  warna?: string;
}): Promise<KategoriGaleriResponse> {
  const response = await apiFetch("/kategori-galeris", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<KategoriGaleriResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateKategoriGaleri(
  id: number,
  data: { nama: string; warna?: string },
): Promise<KategoriGaleriResponse> {
  const response = await apiFetch(`/kategori-galeris/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<KategoriGaleriResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteKategoriGaleri(id: number): Promise<void> {
  const response = await apiFetch(`/kategori-galeris/${id}`, {
    method: "DELETE",
  });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// ============ Profil / Sambutan ============
export interface SambutanResponse {
  id?: number;
  nama: string;
  jabatan: string;
  konten: string;
  foto: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getSambutan(): Promise<SambutanResponse> {
  const response = await apiFetch("/profil/sambutan");
  const json: ApiResponse<SambutanResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data || { nama: '', jabatan: '', konten: '', foto: null };
}

export async function updateSambutan(data: {
  nama: string;
  jabatan: string;
  konten?: string;
  foto?: string;
}): Promise<SambutanResponse> {
  const response = await apiFetch("/profil/sambutan", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<SambutanResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Public endpoints (no auth required)
export async function getPublicSambutan(): Promise<SambutanResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/public/profil/sambutan`);
    const json: ApiResponse<SambutanResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch {
    return null;
  }
}

// ============ Halaman (Profil LPM) ============
export interface HalamanResponse {
  id: number;
  slug: string;
  judul: string;
  konten: string;
  created_at: string;
  updated_at: string;
}

export async function getHalaman(slug: string): Promise<HalamanResponse | null> {
  try {
    const response = await apiFetch(`/halamans/${slug}`);
    const json: ApiResponse<HalamanResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch {
    return null;
  }
}

export async function updateHalaman(slug: string, data: { konten: string }): Promise<HalamanResponse> {
  const response = await apiFetch(`/halamans/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<HalamanResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Public Halaman (no auth)
export async function getPublicHalaman(slug: string): Promise<{ judul: string; konten: string } | null> {
  try {
    const response = await fetch(`${API_BASE}/public/halamans/${slug}`);
    const json: ApiResponse<{ judul: string; konten: string }> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch {
    return null;
  }
}

// ============ Visi Misi ============
export interface VisiMisiResponse {
  id: number;
  visi: string;
  items: Array<{
    id: number;
    no: number;
    judul: string;
    deskripsi: string | null;
  }>;
  created_at: string;
  updated_at: string;
}

export async function getVisiMisi(): Promise<VisiMisiResponse | null> {
  try {
    const response = await apiFetch("/profil/visimisi");
    const json: ApiResponse<VisiMisiResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch {
    return null;
  }
}

export async function updateVisiMisi(data: { visi: string; misi: Array<{ id?: number; no: number; judul: string; deskripsi?: string }> }): Promise<VisiMisiResponse> {
  const response = await apiFetch("/profil/visimisi", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<VisiMisiResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Public Visi Misi (no auth)
export async function getPublicVisiMisi(): Promise<{ visi: string; items: Array<{ no: number; judul: string; deskripsi: string }> } | null> {
  try {
    const response = await fetch(`${API_BASE}/public/profil/visimisi`);
    const json: ApiResponse<VisiMisiResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    const data = json.data;
    return {
      visi: data.visi || '',
      items: (data.items || []).map((item) => ({
        no: item.no,
        judul: item.judul,
        deskripsi: item.deskripsi || '',
      })),
    };
  } catch {
    return null;
  }
}

// ============ Kontak ============
export interface KontakResponse {
  id: number;
  alamat: string;
  gedung: string | null;
  telepon: string;
  email: string;
  maps_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getKontak(): Promise<KontakResponse | null> {
  try {
    const response = await apiFetch("/profil/kontak");
    const json: ApiResponse<KontakResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch {
    return null;
  }
}

export async function updateKontak(data: {
  alamat: string;
  gedung?: string;
  telepon: string;
  email?: string;
  maps_url?: string;
}): Promise<KontakResponse> {
  const response = await apiFetch("/profil/kontak", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<KontakResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Public Kontak (no auth)
export async function getPublicKontak(): Promise<{ alamat: string; gedung?: string; telepon: string; email: string } | null> {
  try {
    const response = await fetch(`${API_BASE}/public/profil/kontak`);
    const json: ApiResponse<KontakResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    const data = json.data;
    return {
      alamat: data.alamat || '',
      gedung: data.gedung || undefined,
      telepon: data.telepon || '',
      email: data.email || '',
    };
  } catch {
    return null;
  }
}

// ============ Struktur ============
export interface StrukturResponse {
  id: number;
  deskripsi: string | null;
  gambar: string | null;
  file_pdf: string | null;
  created_at: string;
  updated_at: string;
}

export async function getStruktur(): Promise<StrukturResponse | null> {
  try {
    const response = await apiFetch("/profil/struktur");
    const json: ApiResponse<StrukturResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch {
    return null;
  }
}

export async function updateStruktur(data: { deskripsi?: string; gambar?: string; file_pdf?: string }): Promise<StrukturResponse> {
  const response = await apiFetch("/profil/struktur", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<StrukturResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Public Struktur (no auth)
export async function getPublicStruktur(): Promise<{ deskripsi?: string; gambar?: string } | null> {
  try {
    const response = await fetch(`${API_BASE}/public/profil/struktur`);
    const json: ApiResponse<StrukturResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    const data = json.data;
    return {
      deskripsi: data.deskripsi || undefined,
      gambar: data.gambar || undefined,
    };
  } catch {
    return null;
  }
}

// ============ Staf ============
export interface StafResponse {
  id: number;
  nama: string;
  jabatan: string;
  foto: string | null;
  program_studi: string | null;
  email: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export async function getStafs(): Promise<StafResponse[]> {
  const response = await apiFetch("/stafs");
  const json: ApiResponse<{ data: StafResponse[] }> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data.data || [];
}

// Public Stafs (no auth)
export async function getPublicStafs(): Promise<StafResponse[]> {
  try {
    const response = await fetch(`${API_BASE}/public/stafs`);
    const json: ApiResponse<StafResponse[]> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getStafById(id: number): Promise<StafResponse> {
  const response = await apiFetch(`/stafs/${id}`);
  const json: ApiResponse<StafResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createStaf(data: {
  nama: string;
  jabatan: string;
  foto?: string;
  program_studi?: string;
  email?: string;
  urutan?: number;
}): Promise<StafResponse> {
  const response = await apiFetch("/stafs", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<StafResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateStaf(id: number, data: Partial<{
  nama: string;
  jabatan: string;
  foto: string;
  program_studi: string;
  email: string;
  urutan: number;
}>): Promise<StafResponse> {
  const response = await apiFetch(`/stafs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<StafResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteStaf(id: number): Promise<void> {
  const response = await apiFetch(`/stafs/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// ============ Download ============
export interface DownloadResponse {
  id: number;
  judul: string;
  tipe: string;
  ukuran: string | null;
  url: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export async function getDownloads(): Promise<DownloadResponse[]> {
  const response = await apiFetch("/downloads");
  const json: ApiResponse<{ data: DownloadResponse[] }> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data.data || [];
}

export async function getDownloadById(id: number): Promise<DownloadResponse> {
  const response = await apiFetch(`/downloads/${id}`);
  const json: ApiResponse<DownloadResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createDownload(data: {
  judul: string;
  tipe: string;
  url: string;
  tanggal: string;
  ukuran?: string;
}): Promise<DownloadResponse> {
  const response = await apiFetch("/downloads", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<DownloadResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateDownload(id: number, data: Partial<{
  judul: string;
  tipe: string;
  url: string;
  tanggal: string;
  ukuran: string;
}>): Promise<DownloadResponse> {
  const response = await apiFetch(`/downloads/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<DownloadResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteDownload(id: number): Promise<void> {
  const response = await apiFetch(`/downloads/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Public Downloads (no auth)
export async function getPublicDownloads(): Promise<DownloadResponse[]> {
  try {
    const response = await fetch(`${API_BASE}/public/downloads`);
    const json: ApiResponse<DownloadResponse[]> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data || [];
  } catch {
    return [];
  }
}

// ============ Poll ============
export interface PollOptionResponse {
  id: number;
  label: string;
  votes: number;
}

export interface PollResponse {
  id: number;
  pertanyaan: string;
  is_active: boolean;
  options: PollOptionResponse[];
}

export async function getPoll(): Promise<PollResponse | null> {
  const response = await apiFetch("/polls");
  const json: ApiResponse<PollResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updatePoll(data: {
  pertanyaan: string;
  is_active: boolean;
  options: Array<{ id?: number; label: string }>;
}): Promise<PollResponse> {
  const response = await apiFetch("/poll", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<PollResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function votePoll(optionId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/poll/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ option_id: optionId }),
  });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Public Poll (no auth)
export async function getPublicPoll(): Promise<{ pertanyaan: string; options: PollOptionResponse[] } | null> {
  try {
    const response = await fetch(`${API_BASE}/public/polls`);
    const json: ApiResponse<PollResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    const data = json.data;
    if (!data) return null;
    return {
      pertanyaan: data.pertanyaan || '',
      options: (data.options || []).map((o) => ({ id: o.id, label: o.label, votes: o.votes })),
    };
  } catch {
    return null;
  }
}

// ============ Partner / Sertifikasi ============
export interface PartnerResponse {
  id: number;
  nama: string;
  logo_url: string | null;
  link_url: string;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export async function getPartners(): Promise<PartnerResponse[]> {
  const response = await apiFetch("/partners");
  const json: ApiResponse<PartnerResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createPartner(data: {
  nama: string;
  logo_url?: string;
  link_url: string;
  urutan?: number;
}): Promise<PartnerResponse> {
  const response = await apiFetch("/partners", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<PartnerResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updatePartner(id: number, data: Partial<{
  nama: string;
  logo_url: string;
  link_url: string;
  urutan: number;
}>): Promise<PartnerResponse> {
  const response = await apiFetch(`/partners/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<PartnerResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deletePartner(id: number): Promise<void> {
  const response = await apiFetch(`/partners/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Public Partners (no auth)
export async function getPublicPartners(): Promise<PartnerResponse[]> {
  try {
    const response = await fetch(`${API_BASE}/public/partners`);
    if (!response.ok) return [];
    const json: ApiResponse<PartnerResponse[]> = await response.json();
    if (!json.success) return [];
    return json.data || [];
  } catch {
    return [];
  }
}

// ============ Tags ============
export interface TagResponse {
  id: number;
  nama: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export async function getTags(): Promise<TagResponse[]> {
  const response = await apiFetch("/tags");
  const json: ApiResponse<TagResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data || [];
}

export async function createTag(data: { nama: string; slug?: string }): Promise<TagResponse> {
  const response = await apiFetch("/tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<TagResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateTag(id: number, data: { nama: string; slug?: string }): Promise<TagResponse> {
  const response = await apiFetch(`/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<TagResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteTag(id: number): Promise<void> {
  const response = await apiFetch(`/tags/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

export async function getPublicTags(): Promise<TagResponse[]> {
  try {
    const response = await fetch(`${API_BASE}/public/tags`);
    if (!response.ok) return [];
    const json: ApiResponse<TagResponse[]> = await response.json();
    if (!json.success) return [];
    return json.data || [];
  } catch {
    return [];
  }
}

// ============ Hero Settings ============
export interface HeroSettingsResponse {
  id: number;
  title: string;
  subtitle: string;
  background_url: string | null;
  video_url: string | null;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
}

export async function getHeroSettings(): Promise<HeroSettingsResponse | null> {
  try {
    const response = await apiFetch("/hero");
    const json: ApiResponse<HeroSettingsResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch {
    return null;
  }
}

export async function updateHeroSettings(data: {
  title?: string;
  subtitle?: string;
  background_url?: string;
  video_url?: string;
  cta_text?: string;
  cta_link?: string;
  is_active?: boolean;
}): Promise<HeroSettingsResponse> {
  const response = await apiFetch("/hero", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<HeroSettingsResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// Public Hero (no auth)
export async function getPublicHeroSettings(): Promise<{
  title: string;
  subtitle: string;
  background_url: string | null;
  video_url: string | null;
  cta_text: string;
  cta_link: string;
} | null> {
  try {
    const response = await fetch(`${API_BASE}/public/hero`);
    const json: ApiResponse<HeroSettingsResponse> = await response.json();
    if (!json.success) throw new Error(json.message);
    const data = json.data;
    if (!data) return null;
    return {
      title: data.title || '',
      subtitle: data.subtitle || '',
      background_url: data.background_url,
      video_url: data.video_url,
      cta_text: data.cta_text || '',
      cta_link: data.cta_link || '',
    };
  } catch {
    return null;
  }
}

// ============ Quick Access ============
export interface QuickAccessResponse {
  id: number;
  judul: string;
  deskripsi: string;
  icon: string;
  link_url: string;
  urutan: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getQuickAccessItems(): Promise<QuickAccessResponse[]> {
  const response = await apiFetch("/quick-access");
  const json: ApiResponse<QuickAccessResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createQuickAccessItem(data: {
  judul: string;
  deskripsi?: string;
  icon?: string;
  link_url: string;
  urutan?: number;
}): Promise<QuickAccessResponse> {
  const response = await apiFetch("/quick-access", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<QuickAccessResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateQuickAccessItem(id: number, data: Partial<{
  judul: string;
  deskripsi: string;
  icon: string;
  link_url: string;
  urutan: number;
  is_active: boolean;
}>): Promise<QuickAccessResponse> {
  const response = await apiFetch(`/quick-access/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<QuickAccessResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteQuickAccessItem(id: number): Promise<void> {
  const response = await apiFetch(`/quick-access/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Public Quick Access (no auth)
export async function getPublicQuickAccessItems(): Promise<QuickAccessResponse[]> {
  try {
    const response = await fetch(`${API_BASE}/public/quick-access`);
    const json: ApiResponse<QuickAccessResponse[]> = await response.json();
    if (!json.success) throw new Error(json.message);
    return json.data || [];
  } catch {
    return [];
  }
}

// ============ Info Terkini (Marquee) ============
export interface InfoTerkininResponse {
  id: number;
  teks: string;
  is_active: boolean;
  urutan: number;
}

export async function getInfoTerkini(): Promise<InfoTerkininResponse[]> {
  const response = await apiFetch("/info-terkini");
  const json: ApiResponse<InfoTerkininResponse[]> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createInfoTerkinin(data: {
  teks: string;
  urutan?: number;
}): Promise<InfoTerkininResponse> {
  const response = await apiFetch("/info-terkini", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<InfoTerkininResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function updateInfoTerkinin(id: number, data: Partial<{
  teks: string;
  urutan: number;
  is_active: boolean;
}>): Promise<InfoTerkininResponse> {
  const response = await apiFetch(`/info-terkini/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json: ApiResponse<InfoTerkininResponse> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function deleteInfoTerkinin(id: number): Promise<void> {
  const response = await apiFetch(`/info-terkini/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// Public Info Terkini (no auth)
export async function getPublicInfoTerkini(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/public/info-terkini`);
    if (!response.ok) return [];
    const json: ApiResponse<InfoTerkininResponse[]> = await response.json();
    if (!json.success) return [];
    return (json.data || []).map(item => item.teks);
  } catch {
    return [];
  }
}

export {
  getToken,
  getUser as getStoredUser,
  setToken,
  setUser,
  clearAuth,
  apiFetch,
  API_BASE,
};
