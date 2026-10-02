import React, { useRef, useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { UploadCloud, Image, AlertCircle, Loader2 } from 'lucide-react';

interface FileScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FileScanner: React.FC<FileScannerProps> = ({ onScanSuccess, onNotify }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenScannerId = 'html5-file-scanner-worker';

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onNotify('Please upload a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const html5QrCode = new Html5Qrcode(hiddenScannerId);
      const result = await html5QrCode.scanFile(file, true);
      onScanSuccess(result);
    } catch (err) {
      console.warn('Scan failed on image file:', err);
      setErrorMessage('No valid QR code could be detected in this image. Try another angle or higher contrast photo.');
      onNotify('No QR code detected in image.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Support Ctrl+V paste from clipboard directly on the page!
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
      {/* Hidden container for Html5Qrcode file worker */}
      <div id={hiddenScannerId} className="hidden" />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full aspect-square sm:h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 ring-4 ring-slate-900/10 dark:ring-white/20'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processImageFile(e.target.files[0]);
            }
          }}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 text-slate-900 dark:text-white animate-spin" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Scanning image content...
            </span>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img
              src={previewUrl}
              alt="Uploaded scan preview"
              className="max-h-56 max-w-full object-contain rounded-xl shadow-md border"
            />
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Click or drop another image to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Drag & Drop QR Image Here
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                or click to browse files from your computer
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <Image className="w-3 h-3" />
                <span>Supports PNG, JPG, WebP, or Ctrl+V paste</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="w-full p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start space-x-2.5 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
