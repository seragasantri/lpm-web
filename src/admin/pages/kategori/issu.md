# Issue: Integrasi Halaman Kategori dengan API Backend

## Endpoint API

Base URL: `/api`

| Method | Endpoint          | Permission        | Description              |
| ------ | ----------------- | ----------------- | ------------------------ |
| GET    | `/kategoris`      | `kategori_read`   | List semua kategori      |
| GET    | `/kategoris/{id}` | `kategori_read`   | Detail kategori          |
| POST   | `/kategoris`      | `kategori_create` | Buat kategori baru       |
| PUT    | `/kategoris/{id}` | `kategori_update` | Update kategori          |
| DELETE | `/kategoris/{id}` | `kategori_delete` | Hapus kategori           |

## Field Kategori

### Request Body (POST/PUT)

```json
{
  "nama": "string (required)",
  "slug": "string (optional, auto-generate dari nama jika kosong)"
}
```

### Response JSON (GET /kategoris)

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama": "Akreditasi",
      "slug": "akreditasi",
      "created_at": "2026-04-20T10:00:00.000000Z",
      "updated_at": "2026-04-20T10:00:00.000000Z"
    }
  ]
}
```

### Response JSON (POST - Create)

```json
{
  "success": true,
  "message": "Kategori berhasil dibuat",
  "data": {
    "id": 1,
    "nama": "Akreditasi",
    "slug": "akreditasi",
    "created_at": "2026-04-20T10:00:00.000000Z",
    "updated_at": "2026-04-20T10:00:00.000000Z"
  }
}
```

## Catatan

- Field API: `id` (number), `nama`, `slug`, `created_at`, `updated_at`
- Slug auto-generate dari nama jika kosong (backend)
- Frontend menggunakan `id: number` (bukan string)

## Files yang diubah

1. `src/lib/types.ts` - Update interface Kategori sesuai API
2. `src/lib/hooks-data.ts` - Tambah fungsi:
   - `getKategori()` - list semua kategori
   - `createKategoriItem()` - buat kategori baru
   - `updateKategoriItem()` - update kategori
   - `deleteKategoriItem()` - hapus kategori
3. `src/admin/pages/kategori/index.tsx` - Update untuk gunakan API:
   - Import dari `hooks-data` bukan `mockData`
   - Auto-generate slug saat edit nama
   - Track manual slug edit agar tidak overwritten
