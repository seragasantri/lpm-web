import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettingImage, uploadImage } from '../../../lib/api';
import { Settings, Upload, Image, Check, Loader, X, AlertCircle } from 'lucide-react';

interface ImageUploadState {
  logo: {
    preview: string | null;
    uploading: boolean;
    error: string | null;
  };
  favicon: {
    preview: string | null;
    uploading: boolean;
    error: string | null;
  };
}

export default function GeneralSettings() {
  useEffect(() => { document.title = 'Pengaturan :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragActive, setDragActive] = useState<{ logo: boolean; favicon: boolean }>({ logo: false, favicon: false });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [imageState, setImageState] = useState<ImageUploadState>({
    logo: { preview: null, uploading: false, error: null },
    favicon: { preview: null, uploading: false, error: null },
  });

  useEffect(() => {
    if (!hasPermission('user.read')) { setLoading(false); return; }

    getSettings().then(data => {
      setSettings(data);
      // Set initial previews from saved settings
      setImageState({
        logo: { preview: data.logo_url || null, uploading: false, error: null },
        favicon: { preview: data.favicon_url || null, uploading: false, error: null },
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [hasPermission]);

  const handleFileUpload = async (type: 'logo' | 'favicon', file: File) => {
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setImageState(prev => ({
        ...prev,
        [type]: { ...prev[type], error: 'Format file tidak valid. Gunakan JPG, PNG, WebP, atau SVG.' }
      }));
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setImageState(prev => ({
        ...prev,
        [type]: { ...prev[type], error: 'Ukuran file terlalu besar. Maksimal 2MB.' }
      }));
      return;
    }

    setImageState(prev => ({
      ...prev,
      [type]: { preview: URL.createObjectURL(file), uploading: true, error: null }
    }));

    try {
      // Upload to server
      const result = await uploadImage(file);

      // Update setting in database
      await updateSettingImage(type === 'logo' ? 'logo_url' : 'favicon_url', result.url);

      // Update local state
      setSettings(prev => ({
        ...prev,
        [type === 'logo' ? 'logo_url' : 'favicon_url']: result.url
      }));

      setImageState(prev => ({
        ...prev,
        [type]: { preview: result.url, uploading: false, error: null }
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setImageState(prev => ({
        ...prev,
        [type]: { preview: null, uploading: false, error: 'Gagal mengunggah file.' }
      }));
    }
  };

  const handleDrag = (type: 'logo' | 'favicon') => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (type: 'logo' | 'favicon') => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileUpload(type, files[0]);
    }
  };

  const handleInputChange = (type: 'logo' | 'favicon') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(type, files[0]);
    }
  };

  const removeImage = (type: 'logo' | 'favicon') => {
    setImageState(prev => ({
      ...prev,
      [type]: { preview: null, uploading: false, error: null }
    }));
    setSettings(prev => {
      const newSettings = { ...prev };
      delete newSettings[type === 'logo' ? 'logo_url' : 'favicon_url'];
      return newSettings;
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Both images are already saved individually via handleFileUpload
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (!hasPermission('user.read')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        <p className="font-semibold">Akses Ditolak</p>
        <p className="text-sm mt-1">Halaman ini hanya dapat diakses oleh Super Admin.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-xl p-5 flex items-center gap-4 shadow-lg">
        <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shadow-sm">
          <Settings className="w-6 h-6 text-yellow-900" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-yellow-900">Pengaturan Website</h1>
          <p className="text-yellow-800/80 text-sm mt-0.5">Kelola logo dan favicon website</p>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 shadow-sm">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold">Berhasil disimpan!</p>
            <p className="text-sm text-green-700">Pengaturan telah berhasil diperbarui.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Logo Website</h2>
                  <p className="text-blue-200 text-sm mt-0.5">Upload logo utama website</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag('logo')}
                onDragLeave={handleDrag('logo')}
                onDragOver={handleDrag('logo')}
                onDrop={handleDrop('logo')}
                onClick={() => logoInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
                  ${dragActive.logo
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                    : imageState.logo.preview
                      ? 'border-green-300 bg-green-50'
                      : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                {imageState.logo.uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Mengunggah...</p>
                  </div>
                ) : imageState.logo.preview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={imageState.logo.preview}
                      alt="Logo Preview"
                      className="max-h-24 max-w-full object-contain rounded-lg shadow-sm"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
                        Logo terunggah
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage('logo');
                      }}
                      className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Drag & Drop Logo</p>
                      <p className="text-sm text-slate-500 mt-1">atau klik untuk memilih file</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP, atau SVG (maksimal 2MB)</p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {imageState.logo.error && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {imageState.logo.error}
                </div>
              )}

              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleInputChange('logo')}
                className="sr-only"
              />
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a10 10 0 0 1 10 10"/>
                    <path d="M12 8a2 2 0 1 0 0 4"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Favicon Website</h2>
                  <p className="text-sky-200 text-sm mt-0.5">Upload ikon untuk tab browser</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag('favicon')}
                onDragLeave={handleDrag('favicon')}
                onDragOver={handleDrag('favicon')}
                onDrop={handleDrop('favicon')}
                onClick={() => faviconInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
                  ${dragActive.favicon
                    ? 'border-sky-500 bg-sky-50 scale-[1.02]'
                    : imageState.favicon.preview
                      ? 'border-green-300 bg-green-50'
                      : 'border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50'
                  }
                `}
              >
                {imageState.favicon.uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-10 h-10 text-sky-500 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Mengunggah...</p>
                  </div>
                ) : imageState.favicon.preview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={imageState.favicon.preview}
                      alt="Favicon Preview"
                      className="max-h-16 max-w-16 object-contain rounded-lg shadow-sm p-2 bg-slate-100"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
                        Favicon terunggah
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage('favicon');
                      }}
                      className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Drag & Drop Favicon</p>
                      <p className="text-sm text-slate-500 mt-1">atau klik untuk memilih file</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP, atau SVG (maksimal 2MB)</p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {imageState.favicon.error && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {imageState.favicon.error}
                </div>
              )}

              <input
                ref={faviconInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleInputChange('favicon')}
                className="sr-only"
              />
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Tips Upload</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Logo disarankan menggunakan format PNG dengan background transparan
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Favicon sebaiknya berupa gambar square (1:1) minimal 64x64 pixel
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Maksimal ukuran file adalah 2MB
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}