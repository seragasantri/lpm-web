# Fix Issue - Kategori Galeri

## Error
```
Failed to resolve import "../../../lib/api" from "src/admin/pages/galeri/kategori/index.tsx"
```

## Cause
Path import salah karena struktur folder.

## Solution
Perbaiki path import di `src/admin/pages/galeri/kategori/index.tsx`:

**Sebelum:**
```typescript
import { ... } from '../../../lib/api';
```

**Sesudah:**
```typescript
import { ... } from '../../../../lib/api';
```

## Detail
- File: `src/admin/pages/galeri/kategori/index.tsx`
- Line: 3
- Masalah: 3 level `../` padahal butuh 4 level untuk mencapai `lib/api`

## Struktur Folder
```
src/
├── lib/
│   └── api.ts          (target)
└── admin/
    └── pages/
        └── galeri/
            └── kategori/
                └── index.tsx  (dari sini: ../../../ = lib, ../../../../ = lib)
```

Dari `src/admin/pages/galeri/kategori/index.tsx`:
- `../` → `src/admin/pages/galeri/`
- `../../` → `src/admin/pages/`
- `../../../` → `src/admin/`
- `../../../../` → `src/` → baru bisa ke `lib/api`