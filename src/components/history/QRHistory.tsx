import React, { useState } from 'react';
import {
  Search,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { HistoryItem, QRType } from '../../types';
import { removeHistoryItem, clearAllHistory } from '../../utils/storage';

interface QRHistoryProps {
  history: HistoryItem[];
  onRefreshHistory: () => void;
  onSendToGenerator: (value: string, type: QRType) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const QRHistory: React.FC<QRHistoryProps> = ({
  history,
  onRefreshHistory,
  onSendToGenerator,
  onNotify,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'generated' | 'scanned'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.payload.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDirection =
      directionFilter === 'all' || item.direction === directionFilter;
    return matchesSearch && matchesDirection;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify('Copied payload to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    removeHistoryItem(id);
    onRefreshHistory();
    onNotify('Item removed from history.', 'info');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire QR code history?')) {
      clearAllHistory();
      onRefreshHistory();
      onNotify('All history cleared.', 'info');
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qrcraft-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onNotify('Exported history as JSON!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved QR codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Direction Filter Buttons & Bulk Actions */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setDirectionFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                directionFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setDirectionFilter('generated')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                directionFilter === 'generated'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Generated
            </button>
            <button
              onClick={() => setDirectionFilter('scanned')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                directionFilter === 'scanned'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Scanned
            </button>
          </div>

          {history.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleExportJson}
                title="Export History to JSON"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearAll}
                title="Clear All History"
                className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No records found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No items match your search term.'
              : 'Codes you generate or scan will automatically appear in this local history for easy access.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    item.direction === 'generated'
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {item.direction === 'generated' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                    {item.payload}
                  </p>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleCopy(item.id, item.payload)}
                  title="Copy content"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => onSendToGenerator(item.payload, item.type)}
                  title="Open in Generator"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 transition"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete from history"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
