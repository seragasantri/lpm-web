# Issue: Integrasi Halaman Berita dengan API Backend

## Endpoint API

Base URL: `/api`

| Method | Endpoint        | Permission      | Description                   |
| ------ | --------------- | --------------- | ----------------------------- |
| GET    | `/beritas`      | `berita_read`   | List semua berita (paginated) |
| GET    | `/beritas/{id}` | `berita_read`   | Detail berita                 |
| POST   | `/beritas`      | `berita_create` | Buat berita baru              |
| PUT    | `/beritas/{id}` | `berita_update` | Update berita                 |
| DELETE | `/beritas/{id}` | `berita_delete` | Hapus berita                  |

## Field Berita

### Request Body (POST/PUT)

```json
{
  "judul": "string (required)",
  "slug": "string (optional, auto-generate dari judul jika kosong)",
  "kategoris_id": "number (required)",
  "tanggal": "date (required, format: YYYY-MM-DD)",
  "gambar": "string (optional, URL gambar)",
  "excerpt": "string (optional, ringkasan)",
  "konten": "string (required, HTML)",
  "status": "string (optional, enum: draft|published|archived, default: draft)",
  "meta_title": "string (optional)"
}
```

### Response JSON (GET /beritas)

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "judul": "Judul Berita",
        "slug": "judul-berita",
        "kategoris_id": 1,
        "kategori": {
          "id": 1,
          "nama": "Akreditasi",
          "slug": "akreditasi"
        },
        "tanggal": "2026-04-20",
        "gambar": "https://example.com/gambar.jpg",
        "excerpt": "Ringkasan berita...",
        "konten": "<p>Konten HTML...</p>",
        "status": "published",
        "meta_title": "SEO Title",
        "author_id": 1,
        "author": {
          "id": 1,
          "username": "admin",
          "email": "admin@example.com"
        },
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z"
      }
    ],
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "last_page": 5
  }
}
```

## Query Parameters (GET /beritas)

| Parameter     | Type   | Description                        |
| ------------- | ------ | ---------------------------------- |
| `per_page`    | number | Jumlah per halaman (default: 10)   |
| `page`        | number | Halaman ke-                        |
| `search`      | string | Cari berdasarkan judul             |
| `status`      | string | Filter: draft, published, archived |
| `kategori_id` | number | Filter berdasarkan kategori        |

## Catatan

- Field `kategori` di frontend perlu diubah menjadi `kategoris_id` untuk API
- Response API menggunakan `created_at`/`updated_at`, bukan `createdAt`/`updatedAt`
- Kategori dari API berupa object, bukan string
- Author dari API berupa object dengan `id`, `username`, `email`

## Files yang perlu diubah

1. `src/lib/api.ts` - Tambah fungsi API untuk berita
2. `src/lib/types.ts` - Update interface Berita
3. `src/admin/pages/berita/List.tsx` - Gunakan API instead of mockData
4. `src/admin/pages/berita/Form.tsx` - Gunakan API untuk create/update
5. `src/admin/pages/berita/create.tsx` - Import Form component
6. `src/admin/pages/berita/edit/[id].tsx` - Import Form component
