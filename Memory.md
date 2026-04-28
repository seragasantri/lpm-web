# Memory - Frontend Documentation

## 1. Pages (Public - Non-Admin)

### `/` - Home
**File:** src/pages/Home.tsx

Halaman utama/landing page website LPM UIN Raden Fatah.

**Components yang digunakan:**
- Navbar (dari Layout)
- Footer (dari Layout)
- Mobile navigation menu
- Hero section dengan carousel galeri
- Quick access cards (SIAMI, BKD Online, Instrumen SPMI, Sertifikasi)
- Sambutan Ketua LPM section
- Berita terkini (Latest News)
- Sidebar widgets: Jadwal Sholat, Download, Jajak Pendapat
- Partner logos section
- Statistics section (Program Studi count, Akreditasi, Auditor, ISO)

**Data yang ditampilkan:** Static data (LATEST_NEWS, PRAYER_TIMES, DOWNLOADS, QUICK_ACTIVITIES, STATS)

**Fitur:**
- Mobile responsive navigation
- Page navigation dengan state management (currentPage)
- Dynamic page content switching
- News articles dengan category badges

---

### `/profil` - Profil LPM
**File:** src/pages/ProfilPage.tsx

Halaman profil Lembaga Penjaminan Mutu.

**Components:** Tidak ada (inline components)

**Data:**
- getHalaman() - konten dinamis (slug: 'profil')
- getVisiMisi() - visi dan misi
- getKontakData() - informasi kontak

**Tampilan:**
- Header dengan breadcrumb
- Konten dinamis dari database
- Card Visi dengan gradient background
- Grid Mission cards dengan numbered badges
- Info card kontak (alamat, gedung, telepon, email)

---

### `/sambutan-ketua` - Sambutan Ketua LPM
**File:** src/pages/SambutanPage.tsx

**Components:** Tidak ada (inline components)

**Data:**
- getSambutan() - data sambutandari database

**Tampilan:**
- Header dengan breadcrumb
- Quote card dengan foto Ketua LPM
- Sambutan text dengan styling italic
- Info nama dan jabatan

---

### `/visi-dan-misi` - Visi dan Misi
**File:** src/pages/VisiMisiPage.tsx

**Components:** Tidak ada (inline components)

**Data:** Static data (missions array)

**Tampilan:**
- Hero card Visi dengan gradient
- Grid Misi cards dengan numbered badges
- Capaian Akreditasi stats grid
- Badge untuk setiap level akreditasi

---

### `/struktur-organisasi` - Struktur Organisasi
**File:** src/pages/StrukturPage.tsx

**Components:** Tidak ada (inline components)

**Data:** Static placeholder

**Tampilan:**
- Placeholder untuk bagan organisasi
- Tombol download
- Info note

---

### `/pimpinan-dan-staf` - Pimpinan dan Staf
**File:** src/pages/StafPage.tsx

**Components:** Tidak ada (inline components)

**Data:** Static data (staffMembers array)

**Tampilan:**
- Grid staff cards dengan foto
- Badge department dengan warna
- Info nama, jabatan, dan departemen

---

### `/kontak` - Kontak
**File:** src/pages/KontakPage.tsx

**Components:** Tidak ada (inline components)

**Data:**
- getKontakData() - data kontak dari database

**Tampilan:**
- Alamat card dengan gradient header
- Kontak card (telepon, email, jam operasional)
- Google Maps iframe (jika mapsUrl ada)
- Fallback placeholder map

---

### `/berita` - Daftar Berita
**File:** src/pages/BeritaPage.tsx

**Components:** Tidak ada (inline components)

**Data:**
- getBerita() - semua berita
- getKategori() - daftar kategori

**Tampilan:**
- Header dengan gradient dan stats count
- Kategori filter buttons
- Search input
- News grid cards dengan:
  - Gambar dengan category badge
  - Tanggal dan view count
  - Judul dan excerpt
  - Link ke detail
- Loading state
- Empty state

**Fitur:**
- Filter berdasarkan kategori
- Search berita
- View counter dengan localStorage

---

### `/berita/:slug` - Detail Berita
**File:** src/pages/BeritaDetailPage.tsx

**Components:** Tidak ada (inline components)

**Data:**
- getBerita() - berdasarkan slug atau id

**Tampilan:**
- Back button
- Article card dengan:
  - Header image
  - Meta info (kategori, tanggal, author, views)
  - Judul
  - Excerpt
  - HTML konten (dengan dangerouslySetInnerHTML)
- Berita terkait (same category)
- View counter increment

---

### `/galeri-foto` - Galeri Foto
**File:** src/pages/GaleriPage.tsx

**Components:** Tidak ada (inline components)

**Data:** Static data (photos array)

**Tampilan:**
- Header
- Kategori filter (All, Audit, Workshop, Pelatihan)
- Photo grid dengan hover overlay
- Lightbox modal dengan:
  - Navigation buttons
  - Keyboard navigation (Escape, Arrow keys)
  - Image counter
  - Caption

---

### `/sertifikat` - Sertifikat Akreditasi
**File:** src/pages/SertifikatPage.tsx

**Components:** Tidak ada (inline components)

**Data:**
- getSertifikat() - data sertifikat
- getProdi() - daftar program studi
- getFaker() - daftar fakultas

**Tampilan:**
- Statistik akreditasi cards (Unggul, A, B, Baik Sekali)
- Bar chart visualisasi
- QR verification info
- Table dengan grouped by fakultas
- Download buttons

---

### `/peraturan` - Peraturan
**File:** src/pages/PeraturanPage.tsx

**Components:**
- RegulationCard - card untuk satu regulasi
- RegulationGroup - grup regulasi berdasarkan kategori

**Data:** Static data (regulations array)

**Tampilan:**
- Header
- Info banner
- Grouped regulations:
  - Undang-Undang (Scale icon, blue)
  - Peraturan Pemerintah (BookOpen icon, green)
  - Peraturan Presiden (Building2 icon, yellow)
  - Peraturan Menteri (Briefcase icon, purple)
  - Peraturan BAN-PT (Award icon, orange)

---

### `/spme/akreditasi-banpt` - Instrumen Akreditasi
**File:** src/pages/AkreditasiPage.tsx

**Components:**
- InstrumentCard - card untuk instrumen
- RelatedLink - link terkait

**Data:** Static data (instruments array)

**Tampilan:**
- Yellow info banner dengan download instructions
- Main content: Instrument cards
- Sidebar dengan related links

---

### `/spme/iso` - ISO 9001:2015
**File:** src/pages/ISOPage.tsx

**Components:**
- MilestoneCard - timeline card
- DocumentCard - dokumen card

**Data:** Static data (milestones, documents arrays)

**Tampilan:**
- ISO Badge section dengan status "Tersertifikasi"
- Download & external links
- Timeline milestone cards (2017, 2019, 2021, 2024)
- Documents grid
- Certificate placeholder

---

### `/spme/situs-terkait` - Situs Terkait
**File:** src/pages/SitusPage.tsx

**Components:**
- SiteCard - card untuk situs

**Data:** Static data (sites array - 14 sites)

**Tampilan:**
- Header
- Intro banner
- 4-column grid SiteCards

---

### `/spmi/gpmp` - GPMP
**File:** src/pages/GPMPPage.tsx

**Components:**
- FunctionCard - card fungsi GPMP

**Data:** Static data (functions, members arrays)

**Tampilan:**
- Tentang GPMP intro
- 4 Function cards (AMI, Pengendalian Mutu, Evaluasi Diri, Koordinasi)
- Members table (8 anggota)
- Download panduan card

---

### `/spmi/gpmf` - GPMF
**File:** src/pages/GPMFPage.tsx

**Components:**
- FunctionCard - card fungsi GPMF
- OrgMember - org chart member

**Data:** Static data (functions, schedule arrays)

**Tampilan:**
- Tentang GPMF intro
- 4 Function cards
- Organizational structure chart (CSS-based)
- Meeting schedule table
- Download panduan card

---

## 2. Components (Public)

### Layout Components

#### src/components/Layout.tsx
Wrapper utama untuk semua halaman public.
- Props: children (ReactNode)
- Contains: Navbar, main content, Footer

#### src/components/Navbar.tsx
Navigation bar dengan:
- Top bar (date/time, language switcher, external links)
- Logo dan brand
- Desktop navigation dengan dropdown menus
- Mobile hamburger menu dengan slide-out drawer
- Sticky positioning dengan scroll effect
- Uses: navItems from src/data/navigation.ts
- Uses: LanguageSwitcher

#### src/components/Footer.tsx
Footer component:
- Brand info
- Location info
- Contact info
- Quick links
- Social media icons
- Copyright
- Uses: static data from src/data/navigation.ts

#### src/components/LanguageSwitcher.tsx
Language switcher dengan:
- 3 languages: Indonesian (ID), English (EN), Arabic (AR)
- Flag emojis
- LocalStorage untuk persistence
- Google Translate integration

---

### Section Components

#### src/components/HeroSection.tsx
Hero section dengan carousel:
- Background pattern
- Text content (badge, title, subtitle, description, buttons)
- Image carousel dengan auto-play, navigation, dots
- Wave SVG decoration
- CSS: HeroSection.css

#### src/components/NewsSection.tsx
News section untuk homepage:
- Section header
- News grid (featured + regular cards)
- CSS: NewsSection.css

#### src/components/GallerySection.tsx
Gallery section dengan lightbox:
- Section header
- Gallery grid dengan hover overlay
- Lightbox modal dengan navigation
- CSS: GallerySection.css

#### src/components/PollSection.tsx
Poll/jajak pendapat:
- Header dengan icon
- Question text
- Radio options
- Submit button dan success state
- CSS: PollSection.css

#### src/components/AccreditationSection.tsx
Akreditasi section:
- Section header dengan total count
- Accreditation cards dengan bar charts
- Donut chart SVG visualization
- CSS: AccreditationSection.css

#### src/components/DownloadSection.tsx
Download section:
- Header
- File list dengan icon
- Footer link
- CSS: DownloadSection.css

#### src/components/PrayerSection.tsx
Prayer times widget:
- Header dengan location
- List dengan icons
- Active highlight untuk Dzuhur
- CSS: PrayerSection.css

#### src/components/QuickLinksSection.tsx
Quick links grid:
- 6 link cards dengan icon, title, description
- Color-coded icons
- CSS: QuickLinksSection.css

#### src/components/ComingSoon.tsx
Coming soon placeholder:
- Props: { title: string }
- SVG clock icon
- Uses: Page wrapper component
- CSS: ComingSoon.css

#### src/components/Page.tsx
Generic page wrapper:
- Props: { title: string, children: ReactNode }
- Page header dengan title
- Page content container
- CSS: Page.css

---

## 3. Data Sources

### Static Data Files
- src/data/navigation.ts - Navigation items, contact info
- src/data/index.ts - Gallery items, news articles, poll options

### API Data (from mockData)
- getHalaman() - Static pages content
- getVisiMisi() - Visi misi data
- getKontakData() - Contact information
- getSambutan() - Sambutan data
- getBerita() - News articles
- getKategori() - News categories
- getSertifikat() - Accreditation certificates
- getProdi() - Program studi
- getFaker() - Faculties

---

## 4. Routing (App.tsx)

```
/                           → Home
/profil                     → ProfilPage
/sambutan-ketua            → SambutanPage
/visi-dan-misi             → VisiMisiPage
/struktur-organisasi        → StrukturPage
/pimpinan-dan-staf         → StafPage
/kontak                    → KontakPage
/berita                     → BeritaPage
/berita/:slug              → BeritaDetailPage
/berita/:kategori          → BeritaPage (filtered)
/galeri-foto               → GaleriPage
/sertifikat                 → SertifikatPage
/peraturan                  → PeraturanPage
/spme/akreditasi-banpt      → AkreditasiPage
/spme/iso                  → ISOPage
/spme/situs-terkait        → SitusPage
/spmi/gpmp                 → GPMPPage
/spmi/gpmf                 → GPMFPage
```

---

## 5. Styling

- CSS Framework: Tailwind CSS
- Icons: Lucide React
- Fonts: System fonts
- CSS Files: Component-specific CSS files untuk complex styling

---

## 6. Key Patterns

### Page Component Pattern
```tsx
export default function PageName() {
  useEffect(() => { document.title = '...'; }, []);
  // Data fetching dengan useState/useEffect
  // Render dengan Tailwind classes
}
```

### Component Props Pattern
```tsx
interface ComponentProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

function Component({ title, description, icon }: ComponentProps) {
  return ( /* JSX */ );
}
```

### Data Fetching Pattern
```tsx
const [data, setData] = useState<DataType | null>(null);

useEffect(() => {
  fetchData().then(setData);
}, []);
```

---

## 8. Status Pengerjaan Fitur

### Keterangan Status
| Status | Arti |
|--------|------|
| ✅ DONE | Sudah selesai & berfungsi |
| ⚠️ PARTIAL | Ada namun belum lengkap |
| ❌ TODO | Belum dibuat |

---

## 9. Perbandingan Front vs Admin Panel

### 9.1 Berita (News)

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Daftar Berita dengan filter/search | ✅ DONE | ✅ DONE |
| Detail Berita | ✅ DONE | - |
| Create Berita | - | ✅ DONE |
| Edit Berita | - | ✅ DONE |
| Delete Berita | - | ✅ DONE |
| Upload Gambar | - | ✅ DONE |
| Rich Text Editor | - | ✅ DONE |
| Filter Kategori | ✅ DONE | ✅ DONE |
| View Counter | ✅ DONE | - |

**File Front:** `src/pages/BeritaPage.tsx`, `src/pages/BeritaDetailPage.tsx`
**File Admin:** `src/admin/pages/berita/List.tsx`, `src/admin/pages/berita/Form.tsx`, `src/admin/pages/berita/create.tsx`, `src/admin/pages/berita/edit/[id].tsx`

---

### 9.2 Galeri Foto (Gallery)

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Daftar Galeri dengan filter | ✅ DONE | ✅ DONE |
| Lightbox Preview | ✅ DONE | ✅ DONE |
| Create Galeri | - | ✅ DONE |
| Edit Galeri | - | ✅ DONE |
| Delete Galeri | - | ✅ DONE |
| Upload Multi-gambar | - | ⚠️ PARTIAL |
| Kategori (Audit/Workshop/Pelatihan) | ✅ DONE | ✅ DONE |

**File Front:** `src/pages/GaleriPage.tsx`
**File Admin:** `src/admin/pages/galeri/List.tsx`, `src/admin/pages/galeri/Form.tsx`

---

### 9.3 Download File

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Daftar Download | ✅ DONE | ✅ DONE |
| Download File | ✅ DONE | - |
| Create Download | - | ✅ DONE |
| Edit Download | - | ✅ DONE |
| Delete Download | - | ✅ DONE |

**File Front:** `src/components/DownloadSection.tsx` (widget di sidebar homepage)
**File Admin:** `src/admin/pages/download/List.tsx`, `src/admin/pages/download/Form.tsx`

---

### 9.4 Halaman Statis (Profil, Sambutan, Visi Misi, dll)

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan Konten | ✅ DONE | ✅ DONE |
| Edit Konten | - | ✅ DONE |

**Halaman yang editable:**
- Profil LPM (`/profil`)
- Sambutan Ketua (`/sambutan-ketua`)
- Visi dan Misi (`/visi-dan-misi`)
- Struktur Organisasi (`/struktur-organisasi`)

**File Front:** `src/pages/ProfilPage.tsx`, `src/pages/SambutanPage.tsx`, `src/pages/VisiMisiPage.tsx`, `src/pages/StrukturPage.tsx`
**File Admin:** `src/admin/pages/profil/lpm.tsx`, `src/admin/pages/profil/sambutan.tsx`, `src/admin/pages/profil/visimisi.tsx`, `src/admin/pages/profil/struktur.tsx`

---

### 9.5 Staf / Pejabat

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Grid Daftar Staf | ✅ DONE (static) | ✅ DONE |
| Detail Staf | ✅ DONE (static) | ✅ DONE |
| Create Staf | - | ✅ DONE |
| Edit Staf | - | ✅ DONE |
| Delete Staf | - | ✅ DONE |
| Upload Foto | - | ✅ DONE |

**File Front:** `src/pages/StafPage.tsx`
**File Admin:** `src/admin/pages/staf/List.tsx`, `src/admin/pages/staf/Form.tsx`

---

### 9.6 Sertifikat Akreditasi

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Daftar Sertifikat (table/grouped) | ✅ DONE | ✅ DONE |
| Statistik Akreditasi | ✅ DONE | ⚠️ PARTIAL |
| Create Sertifikat | - | ✅ DONE |
| Edit Sertifikat | - | ✅ DONE |
| Delete Sertifikat | - | ✅ DONE |
| Export PDF/Excel | - | ❌ TODO |
| Alarm Masa Berlaku | - | ❌ TODO |

**File Front:** `src/pages/SertifikatPage.tsx`
**File Admin:** `src/admin/pages/sertifikat/List.tsx`, `src/admin/pages/sertifikat/Form.tsx`

---

### 9.7 Peraturan

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Daftar Peraturan (grouped by kategori) | ✅ DONE | ✅ DONE |
| Filter Kategori | ✅ DONE | ✅ DONE |
| Create Peraturan | - | ✅ DONE |
| Edit Peraturan | - | ✅ DONE |
| Delete Peraturan | - | ✅ DONE |
| Drag & Drop Urutan | - | ❌ TODO |

**File Front:** `src/pages/PeraturanPage.tsx`
**File Admin:** `src/admin/pages/peraturan/List.tsx`, `src/admin/pages/peraturan/Form.tsx`

---

### 9.8 Poll / Jajak Pendapat

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Voting Poll | ✅ DONE | - |
| View Hasil (bar chart) | - | ❌ TODO |
| CRUD Pertanyaan | - | ⚠️ PARTIAL |
| CRUD Opsi Jawaban | - | ⚠️ PARTIAL |
| Toggle Aktif/Nonaktif | - | ❌ TODO |
| Reset Vote | - | ❌ TODO |

**File Front:** `src/components/PollSection.tsx`
**File Admin:** `src/admin/pages/poll/index.tsx`

---

### 9.9 Footer & Partner

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan Footer | ✅ DONE | - |
| Edit Info Kontak | - | ✅ DONE |
| Edit Tautan Partner | - | ⚠️ PARTIAL |
| Edit Social Media | - | ⚠️ PARTIAL |
| Edit Copyright | - | ✅ DONE |

**File Front:** `src/components/Footer.tsx`
**File Admin:** `src/admin/pages/footer/index.tsx`

---

### 9.10 SPMI - GPMP

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan Halaman | ✅ DONE | ⚠️ PARTIAL |
| Edit Konten | - | ⚠️ PARTIAL |
| Edit Fungsi | - | ❌ TODO |
| Edit Anggota | - | ❌ TODO |

**File Front:** `src/pages/GPMPPage.tsx`
**File Admin:** `src/admin/pages/spmi/gpmp.tsx`

---

### 9.11 SPMI - GPMF

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan Halaman | ✅ DONE | ⚠️ PARTIAL |
| Edit Konten | - | ⚠️ PARTIAL |
| Edit Struktur | - | ❌ TODO |
| Edit Jadwal | - | ❌ TODO |

**File Front:** `src/pages/GPMFPage.tsx`
**File Admin:** `src/admin/pages/spmi/gpmf.tsx`

---

### 9.12 SPMI - Jadwal Sholat

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan Jadwal | ✅ DONE | - |
| Edit Waktu Sholat | - | ❌ TODO |

**File Front:** `src/components/PrayerSection.tsx`
**File Admin:** ❌ TODO

---

### 9.13 SPME - Akreditasi BAN-PT

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan Instrumen | ✅ DONE | ⚠️ PARTIAL |
| CRUD Instrumen | - | ✅ DONE |
| Edit Instrumen | - | ✅ DONE |

**File Front:** `src/pages/AkreditasiPage.tsx`
**File Admin:** `src/admin/pages/spme/akreditasi/List.tsx`, `src/admin/pages/spme/akreditasi/Form.tsx`

---

### 9.14 SPME - ISO 9001:2015

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan ISO | ✅ DONE | ⚠️ PARTIAL |
| CRUD ISO | - | ✅ DONE |
| Edit ISO | - | ✅ DONE |

**File Front:** `src/pages/ISOPage.tsx`
**File Admin:** `src/admin/pages/spme/iso/List.tsx`, `src/admin/pages/spme/iso/Form.tsx`

---

### 9.15 SPME - Situs Terkait

| Fitur | Front | Admin Panel |
|-------|-------|-------------|
| Tampilkan Situs | ✅ DONE | ⚠️ PARTIAL |
| CRUD Situs | - | ✅ DONE |
| Edit Situs | - | ✅ DONE |

**File Front:** `src/pages/SitusPage.tsx`
**File Admin:** `src/admin/pages/spme/situs/List.tsx`, `src/admin/pages/spme/situs/Form.tsx`

---

### 9.16 User & Permission Management

| Fitur | Admin Panel |
|-------|-------------|
| CRUD User | ✅ DONE |
| Create User | ✅ DONE |
| Edit User | ✅ DONE |
| Delete User | ✅ DONE |
| Reset Password | ⚠️ PARTIAL |
| Toggle Aktif/Nonaktif | ✅ DONE |
| CRUD Permission | ✅ DONE |
| Atur Permission Per User | ✅ DONE |

**File Admin:** `src/admin/pages/users/index.tsx`, `src/admin/pages/permission/index.tsx`, `src/admin/pages/role/index.tsx`

---

### 9.17 Log Aktivitas

| Fitur | Admin Panel |
|-------|-------------|
| Tampilkan Log | ✅ DONE |
| Filter by User | ✅ DONE |
| Filter by Action | ✅ DONE |
| Filter by Modul | ✅ DONE |
| Filter by Date | ⚠️ PARTIAL |

**File Admin:** `src/admin/pages/log/index.tsx`

---

### 9.18 Kategori Berita

| Fitur | Admin Panel |
|-------|-------------|
| CRUD Kategori | ✅ DONE |
| List Kategori | ✅ DONE |

**File Admin:** `src/admin/pages/kategori/index.tsx`

---

### 9.19 Program Studi & Faker

| Fitur | Admin Panel |
|-------|-------------|
| CRUD Program Studi | ✅ DONE |
| CRUD Faker | ✅ DONE |

**File Admin:** `src/admin/pages/prodi/index.tsx`, `src/admin/pages/faker/index.tsx`

---

### 9.20 Settings General

| Fitur | Admin Panel |
|-------|-------------|
| Edit Settings | ⚠️ PARTIAL |

**File Admin:** `src/admin/pages/settings/general.tsx`

---

### 9.21 Halaman Dinamis

| Fitur | Admin Panel |
|-------|-------------|
| List Halaman | ✅ DONE |
| Edit Halaman (by slug) | ✅ DONE |

**File Admin:** `src/admin/pages/halaman/index.tsx`, `src/admin/pages/halaman/[slug].tsx`

---

### 9.22 Dashboard Admin

| Fitur | Admin Panel |
|-------|-------------|
| Statistik (total berita, galeri, dll) | ✅ DONE |
| Recent Activity | ✅ DONE |
| Quick Actions | ✅ DONE |
| Notifikasi | ❌ TODO |

**File Admin:** `src/admin/pages/Dashboard.tsx`

---

## 10. Ringkasan Status

### Frontend (Public Pages)
| Modul | Status |
|-------|--------|
| Home | ✅ DONE |
| Profil | ✅ DONE |
| Sambutan Ketua | ✅ DONE |
| Visi dan Misi | ✅ DONE |
| Struktur Organisasi | ✅ DONE |
| Pimpinan dan Staf | ✅ DONE |
| Kontak | ✅ DONE |
| Berita (list + detail) | ✅ DONE |
| Galeri Foto | ✅ DONE |
| Sertifikat Akreditasi | ✅ DONE |
| Peraturan | ✅ DONE |
| SPMI/GPMP | ✅ DONE |
| SPMI/GPMF | ✅ DONE |
| SPMI/Jadwal Sholat | ✅ DONE |
| SPMI/Survey | ❌ TODO |
| SPMI/Audit | ❌ TODO |
| SPMI/Penjaminan Mutu | ❌ TODO |
| SPMI/Peningkatan Mutu | ❌ TODO |
| SPME/Akreditasi BAN-PT | ✅ DONE |
| SPME/ISO | ✅ DONE |
| SPME/Situs Terkait | ✅ DONE |

### Admin Panel
| Modul | Status |
|-------|--------|
| Login/Auth | ✅ DONE |
| Dashboard | ✅ DONE |
| Berita | ✅ DONE |
| Galeri | ⚠️ PARTIAL (bulk upload) |
| Download | ✅ DONE |
| Halaman Statis | ✅ DONE |
| Staf | ✅ DONE |
| Sertifikat | ⚠️ PARTIAL (no export/alarm) |
| Peraturan | ⚠️ PARTIAL (no drag-drop) |
| Poll | ⚠️ PARTIAL (no toggle/reset) |
| Footer | ⚠️ PARTIAL (partner/social) |
| User Management | ✅ DONE |
| Permission Management | ✅ DONE |
| Log Aktivitas | ✅ DONE |
| Kategori | ✅ DONE |
| Program Studi | ✅ DONE |
| Faker | ✅ DONE |
| Settings | ⚠️ PARTIAL |
| SPMI GPMP | ⚠️ PARTIAL |
| SPMI GPMF | ⚠️ PARTIAL |
| SPMI Jadwal Sholat | ❌ TODO |
| SPMI Survey | ❌ TODO |
| SPMI Audit | ❌ TODO |
| SPME Akreditasi | ✅ DONE |
| SPME ISO | ✅ DONE |
| SPME Situs | ✅ DONE |

---

## 11. Priority Pengerjaan Sisa

| Priority | Modul | Fitur yang Belum |
|----------|-------|------------------|
| 🔴 P1 | Sertifikat | Alarm masa berlaku, Export PDF/Excel |
| 🔴 P1 | Poll | Toggle aktif/nonaktif, Reset vote |
| 🟡 P2 | Galeri | Bulk upload multi-gambar |
| 🟡 P2 | Peraturan | Drag & drop urutan |
| 🟡 P2 | Footer | Edit partner links, social media |
| 🟡 P2 | SPMI GPMP/GPMF | Edit fungsi, anggota, jadwal |
| 🟡 P2 | Settings | Completeness |
| 🟢 P3 | Dashboard | Notifikasi |
| 🟢 P3 | SPMI Jadwal Sholat | Edit jadwal sholat |
| 🟢 P3 | Log | Filter by date |
