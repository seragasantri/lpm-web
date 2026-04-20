import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getKategori } from '../../../lib/hooks-data';
import { getBerita, createBerita, updateBerita, type CreateBeritaData } from '../../../lib/api';
import FileUpload from '../../components/FileUpload';
import RichEditor from '../../components/RichEditor';
import Textarea from '../../components/Textarea';
import SelectInput from '../../components/SelectInput';

interface Props {
  editId?: string;
}

export default function BeritaForm({ editId }: Props) {
  const params = useParams<{ id: string }>();
  const id = editId || params.id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [kategoriList, setKategoriList] = useState<{ id: number; nama: string }[]>([]);
  const [form, setForm] = useState<CreateBeritaData>({
    judul: '',
    slug: '',
    kategoris_id: 0,
    tanggal: new Date().toISOString().split('T')[0],
    gambar: '',
    excerpt: '',
    konten: '',
    status: 'draft',
    meta_title: '',
  });

  useEffect(() => {
    // Load kategori list
    getKategori().then(data => {
      setKategoriList(data);
      if (data.length > 0 && !form.kategoris_id) {
        setForm(prev => ({ ...prev, kategoris_id: data[0].id }));
      }
    });
  }, []);

  useEffect(() => {
    if (id) {
      const numId = parseInt(id);
      getBerita(numId).then(b => {
        setForm({
          judul: b.judul,
          slug: b.slug,
          kategoris_id: b.kategoris_id,
          tanggal: b.tanggal,
          gambar: b.gambar || '',
          excerpt: b.excerpt || '',
          konten: b.konten,
          status: b.status,
          meta_title: b.meta_title || '',
        });
        setLoading(false);
      }).catch(() => {
        alert('Gagal memuat data berita');
        navigate('/admin/berita');
      });
    }
  }, [id, navigate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'judul' && !id) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        const numId = parseInt(id);
        await updateBerita(numId, form);
      } else {
        await createBerita(form);
      }
      navigate('/admin/berita');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-8 px-6 mb-6 rounded-b-2xl shadow-lg">
        <button onClick={() => navigate('/admin/berita')} className="flex items-center gap-2 mb-2 text-sky-100 hover:text-white transition">
          <ArrowLeft size={18} /> Kembali
        </button>
        <h1 className="text-2xl font-bold">{id ? 'Edit Berita' : 'Tambah Berita Baru'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Judul <span className="text-red-500">*</span></label>
            <input name="judul" value={form.judul} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="Judul berita..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori <span className="text-red-500">*</span></label>
            <SelectInput
              name="kategoris_id"
              value={String(form.kategoris_id)}
              onChange={(val) => setForm(prev => ({ ...prev, kategoris_id: parseInt(val) }))}
              options={kategoriList.map(k => ({ value: String(k.id), label: k.nama }))}
              placeholder="Pilih Kategori"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal</label>
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
          <div className="md:col-span-2">
            <FileUpload
              label="Gambar"
              value={form.gambar || ''}
              onChange={(url) => setForm(prev => ({ ...prev, gambar: url }))}
              accept="image/*"
              placeholder="Seret gambar ke sini atau klik untuk memilih"
              helperText="Format: JPG, PNG, WebP. Maks 5MB."
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Excerpt / Ringkasan"
              value={form.excerpt || ''}
              onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Ringkasan berita..."
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <RichEditor
              label="Konten"
              value={form.konten}
              onChange={(html) => setForm(prev => ({ ...prev, konten: html }))}
              placeholder="Tulis konten berita di sini..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <SelectInput
              name="status"
              value={form.status || 'draft'}
              onChange={(val) => setForm(prev => ({ ...prev, status: val as 'draft' | 'published' | 'archived' }))}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ]}
              placeholder="Pilih Status"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="auto-generate dari judul" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={() => navigate('/admin/berita')} className="px-5 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition">Batal</button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 disabled:opacity-50 transition flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
