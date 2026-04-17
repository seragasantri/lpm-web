# Skill: Component Standards — TomSelect & Data Table

## Scope

Semua component select di project ini HARUS menggunakan **TomSelect**. Untuk table, wajib punya fitur sort, search, dan pagination.

---

## 1. TomSelect — Select Component

### Import
```tsx
import TomSelect from "@tom-select/vue3";
import "@tom-select/vue3/dist/scss/tom-select.scss";
```

### Penggunaan Dasar
```tsx
<TomSelect
  v-model="selected"
  :options="{
    plugins: ['dropdown_input'],
    create: false,
    searchField: ['text'],
  }"
  :settings="{
    placeholder: 'Pilih salah satu',
    allowEmpty: false,
  }"
>
  <option value="">Pilih...</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</TomSelect>
```

### With API / Remote Data
```tsx
<TomSelect
  v-model="selected"
  :options="{
    plugins: ['dropdown_input'],
    create: false,
    searchField: ['name'],
    valueField: 'id',
    labelField: 'name',
    load: 'loadFunction',
    loadThrottle: 400,
  }"
  :settings="{
    placeholder: 'Ketik untuk mencari...',
  }"
>
</TomSelect>
```

### Aturan Penting
- **Selalu** include plugin `dropdown_input`
- Buat option `create: false` kecuali perlu create baru
- Gunakan `searchField` yang sesuai dengan struktur data
- Untuk remote: gunakan `load` callback dengan debounce 400ms
- Style custom bisa lewat `:settings` atau global CSS override

### Instalasi & Setup
```bash
npm install tom-select
```

Tambahkan di `index.html` (bagian `<head>`):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css" />
<script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>
```

### Component SelectInput
 sudah ada di `src/admin/components/SelectInput.tsx` - menggunakan TomSelect secara native (tanpa wrapper Vue), langsung manipulate DOM.

### Aturan Penggunaan TomSelect
- **GaleriForm**: TomSelect untuk field `kategori` (Audit/Workshop/Pelatihan/Lainnya)
- **DownloadForm**: TomSelect untuk field `tipe` (PDF/DOC/XLS/ZIP/Link)
- **BeritaForm**: TomSelect untuk field `kategori` dan `status`
- **PeraturanForm**: TomSelect untuk field `kategori`
- **SertifikatForm**: TomSelect untuk field `jenjang` dan `nilai`
- **UsersIndex**: TomSelect untuk field `role` di modal create/edit user

### Install (jika belum ada)
```bash
npm install @tom-select/vue3
npm install --save-dev @types/tom-select  # untuk TS
```

---

## 2. Data Table — Sort, Search, Pagination

### Core Features
- **Search**: real-time filter per kolom atau global search
- **Sort**: klik header untuk sort ASC/DESC, support multi-column sort
- **Pagination**: tombol prev/next, nomor halaman, page size selector
- **Loading state**: skeleton/spinner saat fetch data

### Contoh Implementasi Hook/Composable
```tsx
// useDataTable.ts
import { ref, computed } from 'vue';

export function useDataTable(data: Ref<any[]>, options?: TableOptions) {
  const searchQuery = ref('');
  const sortColumn = ref(options?.defaultSort || '');
  const sortDirection = ref<'asc' | 'desc'>('asc');
  const currentPage = ref(1);
  const pageSize = ref(options?.defaultPageSize || 10);

  // Filtered data berdasarkan search
  const filteredData = computed(() => {
    if (!searchQuery.value) return data.value;
    const q = searchQuery.value.toLowerCase();
    return data.value.filter(row =>
      row.toString().toLowerCase().includes(q)
    );
  });

  // Sorted data
  const sortedData = computed(() => {
    if (!sortColumn.value) return filteredData.value;
    return [...filteredData.value].sort((a, b) => {
      const aVal = a[sortColumn.value];
      const bVal = b[sortColumn.value];
      const modifier = sortDirection.value === 'asc' ? 1 : -1;
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      return (aVal - bVal) * modifier;
    });
  });

  // Paginated data
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return sortedData.value.slice(start, start + pageSize.value);
  });

  // Total pages
  const totalPages = computed(() =>
    Math.ceil(sortedData.value.length / pageSize.value)
  );

  function setSort(column: string) {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
  }

  function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
  }

  function goToPage(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value));
  }

  function resetPagination() {
    currentPage.value = 1;
  }

  return {
    searchQuery,
    sortColumn,
    sortDirection,
    currentPage,
    pageSize,
    paginatedData,
    totalPages,
    totalItems: computed(() => sortedData.value.length),
    setSort,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
  };
}
```

### Template Table
```tsx
<div class="data-table-wrapper">
  {/* Search Bar */}
  <div class="table-toolbar">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      class="search-input"
      @input="resetPagination"
    />
    <span class="result-count">{{ totalItems }} hasil</span>
  </div>

  {/* Table */}
  <table class="data-table">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          @click="setSort(col.key)"
          :class="{ sortable: col.sortable !== false, sorted: sortColumn === col.key }"
        >
          {{ col.label }}
          <span v-if="sortColumn === col.key" class="sort-icon">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in paginatedData" :key="row.id">
        <td v-for="col in columns" :key="col.key">
          <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>

  {/* Pagination */}
  <div class="table-pagination">
    <div class="page-size-selector">
      <label>Show:</label>
      <select v-model="pageSize" @change="resetPagination">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <div class="pagination-info">
      Showing {{ (currentPage - 1) * pageSize + 1 }} –
      {{ Math.min(currentPage * pageSize, totalItems) }}
      of {{ totalItems }}
    </div>

    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <button
        v-for="p in visiblePages"
        :key="p"
        @click="goToPage(p)"
        :class="{ active: p === currentPage }"
      >
        {{ p }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</div>
```

### Aturan Penting
- Sort icon (▲/▼) hanya tampil di kolom yang sedang di-sort
- Search reset pagination ke halaman 1
- Page size change juga reset ke halaman 1
- Untuk table besar (>1000 rows), pertimbangkan server-side pagination
- Visible pages: tampilkan max 5 nomor halaman dengan ellipsis (...) di tengah

---

## Checklist sebelum commit
- [ ] Select field pakai TomSelect (bukan native `<select>`)
- [ ] TomSelect punya plugin `dropdown_input`
- [ ] Table punya search, sort per kolom, pagination
- [ ] Sort indicator visual (▲/▼) muncul di header
- [ ] Pagination include page size selector
- [ ] Empty state dan loading state sudah handled
- [ ] File/gambar upload pakai `FileUpload` component (drag & drop)
- [ ] Tidak ada `input[type=url]` untuk field gambar/file

---

## 3. File Upload — Drag & Drop

### Component
File upload menggunakan component `FileUpload` yang sudah ada di:
`src/admin/components/FileUpload.tsx`

### Import
```tsx
import FileUpload from '../../components/FileUpload';
```

### Penggunaan
```tsx
// Untuk gambar
<FileUpload
  value={form.gambar}
  onChange={(url) => setForm(prev => ({ ...prev, gambar: url }))}
  accept="image/*"
  label="URL Gambar"
  preview={true}
/>

// Untuk file (PDF, DOC, dll)
<FileUpload
  value={form.url}
  onChange={(url) => setForm(prev => ({ ...prev, url: url }))}
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  label="File"
  preview={false}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | URL/file data |
| `onChange` | `(url: string) => void` | - | Callback saat file dipilih |
| `accept` | `string` | `'image/*'` | MIME types atau extension yang diterima |
| `label` | `string` | - | Label field |
| `placeholder` | `string` | `'Seret file ke sini...'` | Teks placeholder |
| `helperText` | `string` | - | Teks bantuan di bawah placeholder |
| `preview` | `boolean` | `true` | Tampilkan preview gambar |
| `className` | `string` | `''` | Extra class |
| `disabled` | `boolean` | `false` | Disable component |

### Fitur
- **Drag & drop** file ke drop zone
- **Klik** untuk buka file picker
- **Preview** gambar secara inline
- **Remove** button untuk hapus file
- **Loading state** saat proses upload
- **Error handling** untuk file yang corrupt/rusak

### Aturan Penggunaan
- **GaleriForm**: Ganti `input[type=url]` dengan `FileUpload` untuk field `gambar` (accept: `image/*`)
- **DownloadForm**: Ganti `input[type=text]` dengan `FileUpload` untuk field `url` (accept: file sesuai tipe yang dipilih)
- **StafForm**: Ganti `input[type=url]` dengan `FileUpload` untuk field `foto` (accept: `image/*`)

### Preview di Form
Jika form sudah punya custom preview logic (seperti GaleriForm/StafForm yang pakai img tag), bisa dipertahankan dengan catatan:
- Drop zone tetap gunakan `FileUpload`
- Preview terpisah di bawah field tetap pertahankan
- Hilangkan logic `input[type=url]` duplikat

### Catatan Produksi
Untuk production (bukan demo/mock):
1. Ganti `FileReader.readAsDataURL()` dengan actual upload API (Cloudinary, S3, dll)
2. Return URL dari server, bukan base64
3. Contoh pattern:
```tsx
const handleFile = async (file: File) => {
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    onChange?.(url);
  } catch (err) {
    alert('Upload gagal');
  } finally {
    setUploading(false);
  }
};
```

---

## 4. Rich Editor — WYSIWYG (WordPress-like)

### Package
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-header @tiptap/extension-table-cell @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-placeholder
```

### Component
Rich editor ada di `src/admin/components/RichEditor.tsx` - menggunakan TipTap editor.

### Import
```tsx
import RichEditor from '../../components/RichEditor';
```

### Penggunaan
```tsx
<RichEditor
  value={form.konten}
  onChange={(html) => setForm(prev => ({ ...prev, konten: html }))}
  placeholder="Tulis konten di sini..."
  label="Konten"
/>
```

### Fitur
- **Drag & drop gambar** ke editor
- **Paste gambar** dari clipboard
- **Upload gambar** via toolbar button
- **Resize gambar** dengan mouse (nwse-resize)
- **Table** dengan resize kolom (drag border)
- **Toolbar**: Bold, Italic, Underline, Strike, Code, Heading (H1-H3), Align, List, Link, Image, Table, Undo/Redo, HR, Blockquote

### Image Resize
- Klik gambar, lalu drag corner untuk resize
- Klik untuk select, lalu tekan Delete untuk hapus

### Table Resize
- Insert table 3x3 default (bisa diubah)
- Drag border antar kolom untuk resize width
- Klik cell untuk select/edit konten

### Aturan Penggunaan
- Ganti semua `textarea` untuk konten (konten, deskripsi, dll) dengan `RichEditor`
-适用 Forms: BeritaForm, Halaman/[slug], StrukturIndex

### Textarea Component
Untuk textarea biasa (ringkasan, alamat, dll), gunakan `Textarea` component dari `src/admin/components/Textarea.tsx`.

### Import
```tsx
import Textarea from '../../components/Textarea';
```

### Penggunaan
```tsx
<Textarea
  label="Alamat"
  value={form.alamat}
  onChange={(e) => setAlamat(e.target.value)}
  placeholder="Jl. Pangeran Ratu..."
  rows={3}
  error="Wajib diisi"
  helperText="Maksimal 200 karakter"
/>
```

### Forms yang perlu diupdate
| Form | Field | Sebelum | Sesudah |
|------|-------|---------|---------|
| BeritaForm | konten | `textarea` | `RichEditor` |
| BeritaForm | excerpt | `textarea` | `Textarea` |
| Halaman/[slug] | konten | `textarea` | `RichEditor` |
| StrukturIndex | konten | `textarea` | `RichEditor` |
| FooterIndex | alamat | `textarea` | `Textarea` |
| FooterIndex | alamat | tetap `textarea` | - |