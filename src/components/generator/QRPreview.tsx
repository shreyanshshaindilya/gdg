import React, { useRef, useEffect, useState } from 'react';
import { Download, Copy, Share2, BookmarkCheck, FileCode, Check } from 'lucide-react';
import { QRConfig } from '../../types';
import { renderQRToCanvas, generateQRSvg, downloadCanvasAsPng, downloadSvg, copyCanvasToClipboard } from '../../utils/canvasExport';

interface QRPreviewProps {
  config: QRConfig;
  onSaveToHistory: () => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ config, onSaveToHistory, onNotify }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloadResolution, setDownloadResolution] = useState<number>(1024);

  useEffect(() => {
    if (canvasRef.current && config.rawValue) {
      renderQRToCanvas(canvasRef.current, {
        ...config,
        size: 340, // Viewport display dimension
      });
    }
  }, [config]);

  const handleDownloadPng = async () => {
    if (!config.rawValue) return;
    try {
      // Create off-screen canvas at requested export resolution
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = downloadResolution;
      exportCanvas.height = downloadResolution;

      await renderQRToCanvas(exportCanvas, {
        ...config,
        size: downloadResolution,
      });

      downloadCanvasAsPng(exportCanvas, `qrcraft-${config.type}-${Date.now()}.png`);
      onNotify(`Downloaded high-res PNG (${downloadResolution}x${downloadResolution})!`, 'success');
      onSaveToHistory();
    } catch (err) {
      console.error(err);
      onNotify('Failed to generate PNG download.', 'error');
    }
  };

  const handleDownloadSvg = async () => {
    if (!config.rawValue) return;
    try {
      const svg = await generateQRSvg(config);
      downloadSvg(svg, `qrcraft-${config.type}-${Date.now()}.svg`);
      onNotify('Downloaded scalable SVG file!', 'success');
      onSaveToHistory();
    } catch (err) {
      console.error(err);
      onNotify('Failed to generate SVG download.', 'error');
    }
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current || !config.rawValue) return;
    const ok = await copyCanvasToClipboard(canvasRef.current);
    if (ok) {
      setCopied(true);
      onNotify('Copied QR code image to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
      onSaveToHistory();
    } else {
      onNotify('Clipboard copy not supported on this browser.', 'error');
    }
  };

  const handleShare = async () => {
    if (!navigator.share || !canvasRef.current) {
      handleCopyClipboard();
      return;
    }

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        await navigator.share({
          title: 'QR Code from QRCraft',
          text: config.rawValue,
          files: [file],
        });
        onNotify('Shared successfully!', 'success');
      });
    } catch {
      // User cancelled or share failed
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between space-y-5 sticky top-24">
      <div className="w-full flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Live QR Preview
        </span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {config.type.toUpperCase()}
        </span>
      </div>

      {/* QR Code Canvas Canvas Frame */}
      <div className="relative p-4 rounded-2xl bg-white border border-slate-200/80 dark:border-slate-700/60 shadow-lg shadow-indigo-500/5 flex items-center justify-center">
        {config.rawValue ? (
          <canvas
            ref={canvasRef}
            className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] object-contain rounded-lg"
          />
        ) : (
          <div className="w-[260px] h-[260px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="text-xs font-medium">Enter details in the form to generate QR code</p>
          </div>
        )}
      </div>

      {/* Resolution Selector */}
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Export Resolution:</span>
          <span className="font-mono font-semibold">{downloadResolution} x {downloadResolution}px</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[512, 1024, 2048].map((res) => (
            <button
              key={res}
              type="button"
              onClick={() => setDownloadResolution(res)}
              className={`py-1 rounded-lg text-xs font-semibold border transition ${
                downloadResolution === res
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {res === 512 ? 'Standard' : res === 1024 ? 'HD (1K)' : 'Print (2K)'}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2">
        <button
          onClick={handleDownloadPng}
          disabled={!config.rawValue}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadSvg}
            disabled={!config.rawValue}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50 transition"
          >
            <FileCode className="w-4 h-4 text-indigo-500" />
            <span>Vector SVG</span>
          </button>

          <button
            onClick={handleCopyClipboard}
            disabled={!config.rawValue}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
            <span>{copied ? 'Copied!' : 'Copy Image'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleShare}
            disabled={!config.rawValue}
            className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => {
              onSaveToHistory();
              onNotify('Saved to history record!', 'success');
            }}
            disabled={!config.rawValue}
            className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50 transition"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
