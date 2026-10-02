import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Wifi,
  UserCheck,
  Mail,
  Phone,
  IndianRupee,
  AlignLeft,
  Share2,
} from 'lucide-react';
import { ParsedQRData } from '../../types';

interface ScanResultCardProps {
  result: ParsedQRData;
  onClear: () => void;
  onSendToGenerator: (value: string, type: ParsedQRData['type']) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  result,
  onClear,
  onSendToGenerator,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string, label = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onNotify(label, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (result.type) {
      case 'url':
        return <ExternalLink className="w-5 h-5 text-sky-500" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-emerald-500" />;
      case 'vcard':
        return <UserCheck className="w-5 h-5 text-blue-500" />;
      case 'email':
        return <Mail className="w-5 h-5 text-amber-500" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-cyan-500" />;
      case 'upi':
        return <IndianRupee className="w-5 h-5 text-emerald-500" />;
      default:
        return <AlignLeft className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 animate-slide-in">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">{getIcon()}</div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{result.title}</h4>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
              Detected: {result.type} Payload
            </span>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
        >
          Scan Another
        </button>
      </div>

      {/* Structured Details Grid */}
      {result.details && Object.keys(result.details).length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 divide-y divide-slate-200 dark:divide-slate-700/50">
          {Object.entries(result.details).map(([key, value]) => (
            <div key={key} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">{key}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-right max-w-[65%] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Raw Payload Preview */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Decoded Content
        </label>
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 break-all select-all border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
          {result.rawText}
        </div>
      </div>

      {/* Smart Quick Actions */}
      <div className="space-y-2">
        {result.isActionableUrl && (
          <a
            href={result.rawText}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-slate-900/10 dark:shadow-white/10 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Link in New Tab</span>
          </a>
        )}

        {result.type === 'wifi' && result.details?.['Password'] && (
          <button
            onClick={() => handleCopy(result.details!['Password'], 'Wi-Fi Password copied!')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Wi-Fi Password</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleCopy(result.rawText)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
            <span>{copied ? 'Copied!' : 'Copy Decoded Text'}</span>
          </button>

          <button
            onClick={() => onSendToGenerator(result.rawText, result.type)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>Edit in Generator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
