import { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddapmhhic';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'siwa_products';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * CloudinaryUploader — drag & drop + file picker that uploads directly to
 * Cloudinary (unsigned preset) and calls onUpload(secureUrl) on success.
 *
 * Props:
 *   currentUrl  — existing image URL to preview (string)
 *   onUpload    — callback(url: string) called when upload succeeds
 *   onClear     — callback() when user clears the image
 */
export default function CloudinaryUploader({ currentUrl, onUpload, onClear }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInputRef = useRef(null);

  const previewUrl = uploadedUrl || currentUrl || '';

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('يُقبل فقط: JPG, PNG, WEBP');
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`الحجم الأقصى ${MAX_SIZE_MB}MB`);
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'SIWA');

      // Use XHR for progress tracking
      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', UPLOAD_URL);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      setUploadedUrl(url);
      setProgress(100);
      onUpload(url);
    } catch (err) {
      setError('فشل الرفع. تأكد من الإعدادات وحاول مجدداً.');
      console.error('Cloudinary upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  // Drag events
  const onDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = () => setIsDragOver(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleClear = () => {
    setUploadedUrl('');
    setProgress(0);
    setError('');
    onClear?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative w-full aspect-square rounded-2xl border-2 border-dashed overflow-hidden
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-300 group select-none
          ${isDragOver
            ? 'border-olive-glow bg-olive/15 scale-[1.02] shadow-[0_0_30px_rgba(164,184,107,0.20)]'
            : 'border-olive/30 bg-olive-deep/10 hover:border-olive/50 hover:bg-olive-deep/20'
          }
          ${uploading ? 'pointer-events-none' : ''}
        `}
      >
        {/* Image Preview */}
        {previewUrl && !uploading && (
          <img
            src={previewUrl}
            alt="Product preview"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
          />
        )}

        {/* Overlay shown on hover or when no image */}
        <div className={`
          absolute inset-0 flex flex-col items-center justify-center gap-3
          transition-all duration-300 rounded-xl
          ${previewUrl && !uploading
            ? 'bg-shadow/70 backdrop-blur-sm opacity-0 group-hover:opacity-100'
            : 'bg-transparent opacity-100'
          }
        `}>
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-olive-glow animate-spin" />
              <span className="text-sm text-cream font-ar">{progress}%</span>
            </>
          ) : (
            <>
              <div className={`p-3 rounded-xl border transition-all ${isDragOver ? 'bg-olive/20 border-olive-glow' : 'bg-olive-deep/20 border-olive/30'}`}>
                <Upload className={`w-7 h-7 transition-colors ${isDragOver ? 'text-olive-glow' : 'text-sand opacity-60'}`} />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-bold text-cream">
                  {isDragOver ? 'أفلت الصورة هنا' : 'اسحب وأفلت الصورة'}
                </p>
                <p className="text-xs text-sand opacity-50 mt-1">أو اضغط للاختيار من الجهاز</p>
                <p className="text-xs text-sand opacity-35 mt-0.5">JPG, PNG, WEBP — حتى {MAX_SIZE_MB}MB</p>
              </div>
            </>
          )}
        </div>

        {/* Upload progress bar */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-olive-deep/40">
            <div
              className="h-full bg-olive-glow transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Success badge */}
        {previewUrl && !uploading && uploadedUrl && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-900/80 backdrop-blur-sm border border-emerald-500/40 rounded-full px-2.5 py-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-300 font-bold">تم الرفع</span>
          </div>
        )}

        {/* Clear button */}
        {previewUrl && !uploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="absolute top-3 left-3 p-1.5 bg-red-900/70 backdrop-blur-sm border border-red-500/40 rounded-full text-red-300 hover:text-red-100 hover:bg-red-800/80 transition-all opacity-0 group-hover:opacity-100"
            title="إزالة الصورة"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-900/20 px-3 py-2.5 text-sm text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
