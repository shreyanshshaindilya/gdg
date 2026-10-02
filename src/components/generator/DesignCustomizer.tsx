import React, { useRef } from 'react';
import { Palette, Shield, Sliders, Image as ImageIcon, X, Upload } from 'lucide-react';
import { QRConfig, ErrorCorrectionLevel } from '../../types';

interface DesignCustomizerProps {
  config: QRConfig;
  setConfig: React.Dispatch<React.SetStateAction<QRConfig>>;
}

const COLOR_PRESETS = [
  { name: 'Classic Dark', fg: '#0f172a', bg: '#ffffff' },
  { name: 'Pure Dark', fg: '#ffffff', bg: '#09090b' },
  { name: 'Slate Minimal', fg: '#1e293b', bg: '#f1f5f9' },
  { name: 'Onyx Monochrome', fg: '#18181b', bg: '#fafafa' },
  { name: 'Cyber Sky', fg: '#0284c7', bg: '#f0f9ff' },
  { name: 'Emerald Forest', fg: '#065f46', bg: '#ecfdf5' },
];

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({ config, setConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setConfig((prev) => ({
            ...prev,
            logoDataUrl: event.target!.result as string,
            errorCorrectionLevel: 'H', // Required for scannability with logo
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setConfig((prev) => ({ ...prev, logoDataUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
        <Sliders className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        <span>Design & Styling Options</span>
      </h3>

      {/* Color Presets */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Color Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  fgColor: preset.fg,
                  bgColor: preset.bg,
                  transparentBg: false,
                }))
              }
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-xs transition"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: preset.fg }}
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center space-x-1">
            <Palette className="w-3.5 h-3.5" />
            <span>QR Dots Color</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={config.fgColor}
              onChange={(e) => setConfig({ ...config, fgColor: e.target.value })}
              className="w-10 h-10 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={config.fgColor}
              onChange={(e) => setConfig({ ...config, fgColor: e.target.value })}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center space-x-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Background Color</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              disabled={config.transparentBg}
              value={config.bgColor}
              onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
              className="w-10 h-10 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer disabled:opacity-40"
            />
            <input
              type="text"
              disabled={config.transparentBg}
              value={config.transparentBg ? 'Transparent' : config.bgColor}
              onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
            />
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="transBg"
              checked={config.transparentBg}
              onChange={(e) => setConfig({ ...config, transparentBg: e.target.checked })}
              className="w-4 h-4 rounded accent-slate-900 dark:accent-white border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="transBg" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              Transparent background (PNG/SVG)
            </label>
          </div>
        </div>
      </div>

      {/* Error Correction & Margins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>Error Correction Level</span>
          </label>
          <select
            value={config.logoDataUrl ? 'H' : config.errorCorrectionLevel}
            disabled={!!config.logoDataUrl}
            onChange={(e) =>
              setConfig({
                ...config,
                errorCorrectionLevel: e.target.value as ErrorCorrectionLevel,
              })
            }
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 disabled:opacity-60"
          >
            <option value="L">Low (7% recovery, denser modules)</option>
            <option value="M">Medium (15% recovery - Standard)</option>
            <option value="Q">Quartile (25% recovery)</option>
            <option value="H">High (30% recovery - Recommended for logos)</option>
          </select>
          {config.logoDataUrl && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              Locked to High (30%) to ensure QR remains scannable with center logo.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Quiet Zone / Border Margin: {config.margin} blocks
          </label>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={config.margin}
            onChange={(e) => setConfig({ ...config, margin: Number(e.target.value) })}
            className="w-full accent-slate-900 dark:accent-white cursor-pointer"
          />
        </div>
      </div>

      {/* Center Logo Upload */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center space-x-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          <span>Center Logo / Brand Icon (Optional)</span>
        </label>

        {config.logoDataUrl ? (
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <img
              src={config.logoDataUrl}
              alt="Center logo"
              className="w-12 h-12 rounded-lg object-contain bg-white dark:bg-slate-900 border p-1"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Custom Logo Attached
              </span>
              <p className="text-[11px] text-slate-400">Centered with automatic high error-tolerance.</p>
            </div>
            <button
              onClick={removeLogo}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Remove logo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 transition"
            >
              <Upload className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Upload Custom Brand Logo (PNG, JPG, SVG)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
