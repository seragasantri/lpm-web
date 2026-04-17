import { useRef, useState, useCallback } from 'react';
import { Upload, File, Image, X, Loader } from 'lucide-react';

export interface FileUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  accept?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  preview?: boolean;
  disabled?: boolean;
}

export default function FileUpload({
  value = '',
  onChange,
  accept = 'image/*',
  label,
  placeholder = 'Seret file ke sini atau klik untuk memilih',
  helperText,
  className = '',
  preview = true,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const isImage = accept.startsWith('image') || accept.includes('image');
  const hasFile = Boolean(value);

  const handleFile = useCallback((file: File) => {
    if (!file) return;
    setUploading(true);

    // For demo/mock: convert to base64 data URL
    // In production, replace with actual upload API call
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setUploading(false);
      onChange?.(url);
    };
    reader.onerror = () => {
      setUploading(false);
      alert('Gagal membaca file.');
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [disabled, handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleRemove = () => {
    onChange?.('');
    setPreviewError(false);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
          ${dragOver
            ? 'border-sky-400 bg-sky-50'
            : hasFile
              ? 'border-slate-200 bg-slate-50'
              : 'border-slate-300 bg-white hover:border-sky-300 hover:bg-sky-50/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Loader className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm">Mengunggah...</span>
          </div>
        ) : hasFile && preview && isImage && !previewError ? (
          <div className="relative p-4">
            <img
              src={value}
              alt="Preview"
              className="w-full max-h-48 object-contain rounded-lg"
              onError={() => setPreviewError(true)}
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : hasFile && preview && !isImage ? (
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              {isImage ? <Image size={20} className="text-sky-500" /> : <File size={20} className="text-sky-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">File selected</p>
              <p className="text-xs text-slate-400 truncate">{value.substring(0, 50)}...</p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : previewError ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Image size={32} className="mb-2 opacity-50" />
            <span className="text-sm">Preview tidak tersedia</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="mt-2 text-xs text-sky-600 hover:text-sky-700"
            >
              Hapus & coba lagi
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Upload size={32} className="mb-3 opacity-60" />
            <p className="text-sm font-medium text-slate-500 mb-1">{placeholder}</p>
            {helperText && <p className="text-xs text-slate-400">{helperText}</p>}
          </div>
        )}
      </div>
    </div>
  );
}