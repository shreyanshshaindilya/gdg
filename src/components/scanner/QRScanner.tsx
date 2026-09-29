import React, { useState } from 'react';
import { Camera, UploadCloud, Sparkles } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { FileScanner } from './FileScanner';
import { ScanResultCard } from './ScanResultCard';
import { parseScannedQR } from '../../utils/qrParser';
import { saveHistoryItem } from '../../utils/storage';
import { ParsedQRData } from '../../types';

interface QRScannerProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRefreshHistory: () => void;
  onSendToGenerator: (value: string, type: ParsedQRData['type']) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onNotify,
  onRefreshHistory,
  onSendToGenerator,
}) => {
  const [scanMode, setScanMode] = useState<'camera' | 'file'>('camera');
  const [scanResult, setScanResult] = useState<ParsedQRData | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    const parsed = parseScannedQR(decodedText);
    setScanResult(parsed);

    // Save to history storage
    saveHistoryItem({
      direction: 'scanned',
      type: parsed.type,
      title: parsed.title,
      payload: decodedText,
    });
    onRefreshHistory();
    onNotify('QR Code detected and parsed successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Scanner Mode Toggle */}
      {!scanResult && (
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                scanMode === 'camera'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera</span>
            </button>

            <button
              onClick={() => setScanMode('file')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                scanMode === 'file'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload / Paste Image</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Scanner Body */}
      {scanResult ? (
        <ScanResultCard
          result={scanResult}
          onClear={() => setScanResult(null)}
          onSendToGenerator={onSendToGenerator}
          onNotify={onNotify}
        />
      ) : scanMode === 'camera' ? (
        <CameraScanner onScanSuccess={handleScanSuccess} />
      ) : (
        <FileScanner onScanSuccess={handleScanSuccess} onNotify={onNotify} />
      )}
    </div>
  );
};
