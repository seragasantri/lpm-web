import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './api';
import type { ApiResponse } from './api';

// Types
export interface Kategori {
  id: number;
  nama: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Berita {
  id: number;
  judul: string;
  slug: string;
  kategori_id: number;
  kategori?: Kategori;
  tanggal: string;
  gambar: string | null;
  excerpt: string | null;
  konten: string;
  status: 'draft' | 'published' | 'archived';
  meta_title: string | null;
  author_id: number;
  author?: { username: string };
  created_at: string;
  updated_at: string;
}

export interface Galeri {
  id: number;
  judul: string;
  gambar: string;
  kategori: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export interface DownloadFile {
  id: number;
  judul: string;
  tipe: string;
  ukuran: string | null;
  url: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export interface Staf {
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

export interface Sertifikat {
  id: number;
  prodi_id: number;
  prodi?: { nama_prodi: string; kode_prodi: string };
  jenjang: 'S1' | 'S2' | 'S3';
  mulai_aktif: string;
  akhir_aktif: string;
  nilai: string;
  skor: string;
  file_sk: string | null;
  created_at: string;
  updated_at: string;
}

export interface Peraturan {
  id: number;
  kategori: string;
  nomor: string;
  judul: string;
  tahun: string | null;
  url: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: number;
  pertanyaan: string;
  options: { id: number; label: string; votes: number }[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Footer {
  alamat: string;
  gedung: string;
  telepon: string;
  email: string;
  partners: { id: number; nama: string; url: string }[];
  socials: { facebook?: string; twitter?: string; instagram?: string; youtube?: string };
  copyright: string;
}

export interface Faker {
  id: number;
  kode_faker: string;
  nama_faker: string;
  created_at: string;
  updated_at: string;
}

export interface Prodi {
  id: number;
  kode_prodi: string;
  nama_prodi: string;
  faker_id: number;
  faker?: Faker;
  created_at: string;
  updated_at: string;
}

// API Functions
async function fetchList<T>(endpoint: string): Promise<T> {
  const response = await apiFetch(endpoint);
  const json: ApiResponse<T> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

async function fetchById<T>(endpoint: string): Promise<T> {
  const response = await apiFetch(endpoint);
  const json: ApiResponse<T> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

async function createItem<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<T> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

async function updateItem<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json: ApiResponse<T> = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

async function deleteItem(endpoint: string): Promise<void> {
  const response = await apiFetch(endpoint, { method: 'DELETE' });
  const json: ApiResponse<null> = await response.json();
  if (!json.success) throw new Error(json.message);
}

// ============ Kategori ============
export async function getKategori(): Promise<Kategori[]> {
  return fetchList<Kategori[]>('/kategoris');
}

export async function createKategoriItem(data: { nama: string; slug?: string }): Promise<Kategori> {
  return createItem<Kategori>('/kategoris', data);
}

export async function updateKategoriItem(id: number, data: { nama: string; slug?: string }): Promise<Kategori> {
  return updateItem<Kategori>(`/kategoris/${id}`, data);
}

export async function deleteKategoriItem(id: number): Promise<void> {
  return deleteItem(`/kategoris/${id}`);
}

export function useKategoris() {
  return useQuery({
    queryKey: ['kategoris'],
    queryFn: () => fetchList<Kategori[]>('/kategoris'),
  });
}

export function useCreateKategori() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { nama: string; slug?: string }) =>
      createItem<Kategori>('/kategoris', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kategoris'] }),
  });
}

export function useUpdateKategori() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { nama: string; slug?: string } }) =>
      updateItem<Kategori>(`/kategoris/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kategoris'] }),
  });
}

export function useDeleteKategori() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/kategoris/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kategoris'] }),
  });
}

// ============ Berita ============
export function useBeritas(params?: { status?: string; kategori_id?: number }) {
  const queryKey = params ? ['beritas', params] : ['beritas'];
  return useQuery({
    queryKey,
    queryFn: () => fetchList<Berita[]>('/beritas'),
  });
}

export function useBerita(id: number) {
  return useQuery({
    queryKey: ['berita', id],
    queryFn: () => fetchById<Berita>(`/beritas/${id}`),
    enabled: !!id,
  });
}

export function useCreateBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/beritas`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beritas'] }),
  });
}

export function useUpdateBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/beritas/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beritas'] }),
  });
}

export function useDeleteBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/beritas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beritas'] }),
  });
}

export function usePublishBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => updateItem<Berita>(`/beritas/${id}/publish`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beritas'] }),
  });
}

// ============ Galeri ============
export function useGaleri() {
  return useQuery({
    queryKey: ['galeri'],
    queryFn: () => fetchList<Galeri[]>('/galeris'),
  });
}

export function useCreateGaleri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/galeris`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galeri'] }),
  });
}

export function useUpdateGaleri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/galeris/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galeri'] }),
  });
}

export function useDeleteGaleri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/galeris/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galeri'] }),
  });
}

// ============ Downloads ============
export function useDownloads() {
  return useQuery({
    queryKey: ['downloads'],
    queryFn: () => fetchList<DownloadFile[]>('/downloads'),
  });
}

export function useCreateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/downloads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  });
}

export function useUpdateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/downloads/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  });
}

export function useDeleteDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/downloads/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  });
}

// ============ Staf ============
export function useStafs() {
  return useQuery({
    queryKey: ['stafs'],
    queryFn: () => fetchList<Staf[]>('/stafs'),
  });
}

export function useCreateStaf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/stafs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stafs'] }),
  });
}

export function useUpdateStaf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/stafs/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stafs'] }),
  });
}

export function useDeleteStaf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/stafs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stafs'] }),
  });
}

// ============ Sertifikat ============
export function useSertifikats() {
  return useQuery({
    queryKey: ['sertifikats'],
    queryFn: () => fetchList<Sertifikat[]>('/sertifikats'),
  });
}

export function useCreateSertifikat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/sertifikats`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sertifikats'] }),
  });
}

export function useUpdateSertifikat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      fetch(`${import.meta.env.VITE_API_URL || 'http://api-lpm.test/api'}/sertifikats/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('lpm_token')}` },
        body: data,
      }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sertifikats'] }),
  });
}

export function useDeleteSertifikat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/sertifikats/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sertifikats'] }),
  });
}

// ============ Peraturan ============
export function usePeraturans() {
  return useQuery({
    queryKey: ['peraturans'],
    queryFn: () => fetchList<Peraturan[]>('/peraturans'),
  });
}

export function useCreatePeraturan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Peraturan, 'id' | 'created_at' | 'updated_at'>) =>
      createItem<Peraturan>('/peraturans', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['peraturans'] }),
  });
}

export function useUpdatePeraturan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Peraturan> }) =>
      updateItem<Peraturan>(`/peraturans/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['peraturans'] }),
  });
}

export function useDeletePeraturan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/peraturans/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['peraturans'] }),
  });
}

// ============ Poll ============
export function usePoll() {
  return useQuery({
    queryKey: ['poll'],
    queryFn: () => fetchById<Poll>('/poll'),
  });
}

export function useUpdatePoll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { pertanyaan: string; options: string[] }) =>
      updateItem<Poll>('/poll', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['poll'] }),
  });
}

export function useVotePoll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (optionId: number) =>
      updateItem<Poll>(`/poll/vote/${optionId}`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['poll'] }),
  });
}

// ============ Footer ============
export function useFooter() {
  return useQuery({
    queryKey: ['footer'],
    queryFn: () => fetchById<Footer>('/footer'),
  });
}

export function useUpdateFooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Footer) => updateItem<Footer>('/footer', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['footer'] }),
  });
}

// ============ Faker (Fakultas) ============
export function useFakers() {
  return useQuery({
    queryKey: ['fakers'],
    queryFn: () => fetchList<Faker[]>('/fakers'),
  });
}

export function useCreateFaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { kode_faker: string; nama_faker: string }) =>
      createItem<Faker>('/fakers', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fakers'] }),
  });
}

export function useUpdateFaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { kode_faker: string; nama_faker: string } }) =>
      updateItem<Faker>(`/fakers/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fakers'] }),
  });
}

export function useDeleteFaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/fakers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fakers'] }),
  });
}

// ============ Prodi ============
export function useProdis() {
  return useQuery({
    queryKey: ['prodis'],
    queryFn: () => fetchList<Prodi[]>('/prodis'),
  });
}

export function useCreateProdi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { kode_prodi: string; nama_prodi: string; faker_id: number }) =>
      createItem<Prodi>('/prodis', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prodis'] }),
  });
}

export function useUpdateProdi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { kode_prodi: string; nama_prodi: string; faker_id: number } }) =>
      updateItem<Prodi>(`/prodis/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prodis'] }),
  });
}

export function useDeleteProdi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(`/prodis/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prodis'] }),
  });
}
