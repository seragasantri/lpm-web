import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { getKategori } from '../../../lib/hooks-data';
import { getBerita, createBerita, updateBerita, getTags, createTag, type CreateBeritaData, type TagResponse } from '../../../lib/api';
import FileUpload from '../../components/FileUpload';
import RichEditor from '../../components/RichEditor';
import Textarea from '../../components/Textarea';

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
  const [tagList, setTagList] = useState<TagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  const filteredTags = tagList.filter(tag =>
    tag.nama.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !selectedTags.includes(tag.id)
  );

  const exactMatchExists = tagList.some(t => t.nama.toLowerCase() === tagSearch.toLowerCase().trim());
  const canCreateNew = tagSearch.trim().length > 0 && !exactMatchExists && !selectedTags.some(id => tagList.find(t => t.id === id)?.nama.toLowerCase() === tagSearch.toLowerCase().trim());
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
    // Load tags
    getTags().then(data => setTagList(data)).catch(() => {});
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
          gambar: b.gambar ? `${b.gambar}` : '',
          excerpt: b.excerpt || '',
          konten: b.konten,
          status: b.status,
          meta_title: b.meta_title || '',
        });
        // Load tags for this berita if available
        if ((b as any).tags && Array.isArray((b as any).tags)) {
          setSelectedTags((b as any).tags.map((t: TagResponse) => t.id));
        }
        setLoading(false);
      }).catch(() => {
        alert('Gagal memuat data berita');
        navigate('/admin/berita');
      });
    }
  }, [id, navigate]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateInlineTag = async () => {
    if (!tagSearch.trim()) return;
    setCreatingTag(true);
    try {
      const newTag = await createTag({ nama: tagSearch.trim() });
      setTagList(prev => [...prev, newTag]);
      setSelectedTags(prev => [...prev, newTag.id]);
      setTagSearch('');
      setShowTagDropdown(false);
    } catch (err) {
      console.error('Gagal membuat tag:', err);
      alert('Gagal membuat tag baru.');
    } finally {
      setCreatingTag(false);
    }
  };

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
      const dataToSubmit = {
        ...form,
        gambar: form.gambar?.slice(0, 200) || '',
      };
      if (id) {
        const numId = parseInt(id);
        await updateBerita(numId, dataToSubmit, selectedTags);
      } else {
        await createBerita(dataToSubmit, selectedTags);
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
            <select
              name="kategoris_id"
              value={form.kategoris_id || ''}
              onChange={(e) => setForm(prev => ({ ...prev, kategoris_id: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              required
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
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
            <select
              name="status"
              value={form.status || 'draft'}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="auto-generate dari judul" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tags</label>
            <div className="relative" ref={tagDropdownRef}>
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tagId => {
                    const tag = tagList.find(t => t.id === tagId);
                    return tag ? (
                      <span key={tagId} className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                        {tag.nama}
                        <button type="button" onClick={() => handleTagToggle(tagId)} className="hover:text-sky-900">
                          <X size={14} />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              {/* Tag Dropdown */}
              <div className="relative">
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  onFocus={() => setShowTagDropdown(true)}
                  onBlur={() => setTimeout(() => setShowTagDropdown(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canCreateNew && !creatingTag) {
                      e.preventDefault();
                      handleCreateInlineTag();
                    }
                  }}
                  placeholder="Cari atau buat tag..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                {showTagDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredTags.length > 0 && (
                      <>
                        {filteredTags.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleTagToggle(tag.id);
                              setTagSearch('');
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-sky-50 transition-colors flex items-center justify-between"
                          >
                            <span>{tag.nama}</span>
                            <span className="text-slate-400 text-xs">{tag.slug}</span>
                          </button>
                        ))}
                        {canCreateNew && (
                          <div className="border-t border-slate-100" />
                        )}
                      </>
                    )}
                    {canCreateNew && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCreateInlineTag();
                        }}
                        disabled={creatingTag}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-sky-50 transition-colors flex items-center gap-2 text-sky-600 font-medium disabled:opacity-50"
                      >
                        {creatingTag ? (
                          <>
                            <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                            Membuat...
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Buat tag baru: "{tagSearch.trim()}"
                          </>
                        )}
                      </button>
                    )}
                    {!canCreateNew && filteredTags.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">Tidak ada tag yang cocok</div>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400">Ketik untuk mencari atau membuat tag baru.</p>
            </div>
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
