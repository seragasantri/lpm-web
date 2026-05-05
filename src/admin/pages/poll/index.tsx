import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getPoll, updatePoll } from '../../../lib/api';
import { BarChart2, Plus, Trash2, Save, Loader } from 'lucide-react';

export default function PollIndex() {
  useEffect(() => { document.title = 'Manajemen Poll :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [pertanyaan, setPertanyaan] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [options, setOptions] = useState<Array<{ id: number; label: string; votes: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPoll();
        if (data) {
          setPertanyaan(data.pertanyaan || '');
          setIsActive(data.is_active ?? false);
          setOptions(data.options || []);
        }
      } catch (err) {
        console.error('Gagal memuat poll:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, []);

  const addOption = () => {
    setOptions(prev => [...prev, { id: Date.now(), label: `Opsi ${prev.length + 1}`, votes: 0 }]);
  };

  const removeOption = (id: number) => {
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  const updateOption = (id: number, field: 'label', value: string) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePoll({ pertanyaan, is_active: isActive, options });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Gagal menyimpan:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  if (!hasPermission('poll.update')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        Anda tidak memiliki akses untuk mengelola poll.
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Poll</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola pertanyaan dan opsi polling</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-6 p-6">
        {/* Pertanyaan */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pertanyaan</label>
          <input
            value={pertanyaan}
            onChange={e => setPertanyaan(e.target.value)}
            placeholder="Bagaimana pendapat Anda tentang..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
          <span className="text-sm font-semibold text-slate-700">Poll Aktif</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {isActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Opsi Jawaban</label>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium w-8 shrink-0 text-right">{idx + 1}.</span>
                <input
                  value={opt.label}
                  onChange={e => updateOption(opt.id, 'label', e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder={`Label opsi ${idx + 1}`}
                />
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 min-w-[80px] justify-center">
                  <span className="font-semibold text-slate-700">{opt.votes}</span>
                  <span className="text-xs">suara</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(opt.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOption}
            className="mt-3 flex items-center gap-2 px-4 py-2 border border-dashed border-sky-300 text-sky-600 hover:bg-sky-50 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={14} /> Tambah Opsi
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
            Poll berhasil disimpan!
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan Poll
          </button>
        </div>
      </form>
    </div>
  );
}
