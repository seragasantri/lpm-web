import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Save, RotateCcw } from 'lucide-react';
import Textarea from '../../components/Textarea';
import FileUpload from '../../components/FileUpload';
import { getGpmp, updateGpmp } from '../../../lib/mockData';
import type { Gpmp, GpmpTugas } from '../../../lib/types';

const ICON_OPTIONS = [
  'ClipboardCheck', 'Target', 'BookUser', 'Users', 'ShieldCheck',
  'FileText', 'BarChart', 'TrendingUp', 'Award', 'CheckCircle',
  'Settings', 'Layers', 'GitBranch', 'Gauge', 'Database',
];

const ICON_EMOJI: Record<string, string> = {
  ClipboardCheck: '✅', Target: '🎯', BookUser: '📖', Users: '👥',
  ShieldCheck: '🛡️', FileText: '📄', BarChart: '📊', TrendingUp: '📈',
  Award: '🏆', CheckCircle: '✔️', Settings: '⚙️', Layers: '📚',
  GitBranch: '🔀', Gauge: '📉', Database: '💾',
};

export default function GpmpPage() {
  useEffect(() => { document.title = 'Manajemen GPMP :: LPM Admin'; }, []);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalData, setOriginalData] = useState<Gpmp | null>(null);
  const [form, setForm] = useState<Gpmp | null>(null);

  useEffect(() => {
    getGpmp().then(data => {
      setForm({ ...data });
      setOriginalData({ ...data });
      setLoading(false);
    });
  }, []);

  function handleEdit() {
    if (form) {
      setOriginalData({ ...form });
      setMode('edit');
    }
  }

  function handleCancel() {
    if (originalData) {
      setForm({ ...originalData });
    }
    setMode('view');
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await updateGpmp({
        tentang: form.tentang,
        tugas: form.tugas,
        panduan: form.panduan,
        linkPanduan: form.linkPanduan,
      });
      setOriginalData({ ...form });
      setMode('view');
    } finally {
      setSaving(false);
    }
  }

  function addTugas() {
    if (!form) return;
    const newTugas: GpmpTugas = {
      id: `t_${Date.now()}`,
      icon: 'ClipboardCheck',
      judul: '',
      deskripsi: '',
    };
    setForm(prev => prev ? { ...prev, tugas: [...prev.tugas, newTugas] } : null);
  }

  function removeTugas(index: number) {
    if (!form) return;
    setForm(prev => prev ? { ...prev, tugas: prev.tugas.filter((_, i) => i !== index) } : null);
  }

  function updateTugas(index: number, field: keyof GpmpTugas, value: string) {
    if (!form) return;
    setForm(prev => prev ? {
      ...prev,
      tugas: prev.tugas.map((t, i) => i === index ? { ...t, [field]: value } : t),
    } : null);
  }

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-8 px-6 mb-6 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={24} />
            <div>
              <h1 className="text-2xl font-bold">Manajemen GPMP</h1>
              <p className="text-sky-100 text-sm mt-0.5">Gugus Pengendalian Mutu Program Studi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'view' ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
              >
                <Edit2 size={16} /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
                >
                  <RotateCcw size={16} /> Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 hover:bg-sky-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-sky-700 border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tentang */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-700 mb-4">Tentang GPMP</h2>
          {mode === 'view' ? (
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {form.tentang || 'Belum ada deskripsi.'}
            </p>
          ) : (
            <Textarea
              value={form.tentang}
              onChange={(e) => setForm(prev => prev ? { ...prev, tentang: e.target.value } : null)}
              placeholder="Masukkan deskripsi tentang GPMP..."
              rows={4}
            />
          )}
        </div>

        {/* Tugas & Fungsi */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-700">Tugas & Fungsi GPMP</h2>
            {mode === 'edit' && (
              <button
                onClick={addTugas}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus size={14} /> Tambah Tugas
              </button>
            )}
          </div>

          <div className="space-y-3">
            {form.tugas.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Belum ada tugas & fungsi.</p>
            ) : (
              form.tugas.map((tugas, index) => (
                <div key={tugas.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  {mode === 'view' ? (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-lg shrink-0 mt-0.5">
                        {ICON_EMOJI[tugas.icon] || '📋'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 text-sm">{tugas.judul}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{tugas.deskripsi}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-lg shrink-0 mt-6">
                          {ICON_EMOJI[tugas.icon] || '📋'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">Tugas #{index + 1}</span>
                            <button
                              onClick={() => removeTugas(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1">Icon</label>
                              <select
                                value={tugas.icon}
                                onChange={(e) => updateTugas(index, 'icon', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                              >
                                {ICON_OPTIONS.map(icon => (
                                  <option key={icon} value={icon}>{ICON_EMOJI[icon]} {icon}</option>
                                ))}
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-slate-600 mb-1">Judul</label>
                              <input
                                type="text"
                                value={tugas.judul}
                                onChange={(e) => updateTugas(index, 'judul', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                placeholder="Judul tugas..."
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi</label>
                            <input
                              type="text"
                              value={tugas.deskripsi}
                              onChange={(e) => updateTugas(index, 'deskripsi', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                              placeholder="Deskripsi tugas..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panduan */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-700 mb-4">Panduan & Link</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Panduan PDF</label>
              {mode === 'view' ? (
                form.panduan ? (
                  <a
                    href={form.panduan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors"
                  >
                    📄 Lihat Panduan PDF
                  </a>
                ) : (
                  <p className="text-sm text-slate-400 italic">Belum ada panduan PDF.</p>
                )
              ) : (
                <FileUpload
                  value={form.panduan || ''}
                  onChange={(url) => setForm(prev => prev ? { ...prev, panduan: url } : null)}
                  accept=".pdf,application/pdf"
                  placeholder="Seret file PDF ke sini atau klik untuk memilih"
                  helperText="Format: PDF. Maks 10MB."
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link Panduan Eksternal</label>
              {mode === 'view' ? (
                form.linkPanduan ? (
                  <a
                    href={form.linkPanduan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors"
                  >
                    🔗 {form.linkPanduan}
                  </a>
                ) : (
                  <p className="text-sm text-slate-400 italic">Belum ada link panduan.</p>
                )
              ) : (
                <input
                  type="url"
                  value={form.linkPanduan || ''}
                  onChange={(e) => setForm(prev => prev ? { ...prev, linkPanduan: e.target.value } : null)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="https://..."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
