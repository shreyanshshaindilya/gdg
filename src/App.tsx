import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QRGenerator } from './components/generator/QRGenerator';
import { QRScanner } from './components/scanner/QRScanner';
import { QRHistory } from './components/history/QRHistory';
import { ToastContainer, ToastMessage } from './components/Toast';
import { getStoredHistory, getStoredTheme, setStoredTheme } from './utils/storage';
import { HistoryItem, QRType } from './types';
import { ShieldCheck, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'scanner' | 'history'>('generator');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => getStoredTheme() === 'dark');

  // Generator pre-fill state when sending from Scanner or History
  const [generatorPreFill, setGeneratorPreFill] = useState<{ value: string; type: QRType } | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      setStoredTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setStoredTheme('light');
    }
  }, [darkMode]);

  // Load history on mount
  useEffect(() => {
    refreshHistory();
  }, []);

  const refreshHistory = () => {
    setHistory(getStoredHistory());
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSendToGenerator = (value: string, type: QRType) => {
    setGeneratorPreFill({ value, type });
    setActiveTab('generator');
    addToast('Loaded payload into QR Generator!', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Subtle Welcome Hero */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {activeTab === 'generator' && 'Custom QR Code Studio'}
              {activeTab === 'scanner' && 'Real-Time QR Scanner'}
              {activeTab === 'history' && 'Activity & Saved Records'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeTab === 'generator' &&
                'Design, customize, embed logos, and export vector or high-resolution QR codes.'}
              {activeTab === 'scanner' &&
                'Scan QR codes instantly using your web camera, mobile camera, or uploaded image files.'}
              {activeTab === 'history' &&
                'Review previously generated and scanned codes stored securely in your browser.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'generator' && (
          <QRGenerator
            key={generatorPreFill ? `${generatorPreFill.value}-${generatorPreFill.type}` : 'default'}
            initialValue={generatorPreFill?.value}
            initialType={generatorPreFill?.type}
            onNotify={addToast}
            onRefreshHistory={refreshHistory}
          />
        )}

        {activeTab === 'scanner' && (
          <QRScanner
            onNotify={addToast}
            onRefreshHistory={refreshHistory}
            onSendToGenerator={handleSendToGenerator}
          />
        )}

        {activeTab === 'history' && (
          <QRHistory
            history={history}
            onRefreshHistory={refreshHistory}
            onSendToGenerator={handleSendToGenerator}
            onNotify={addToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span>Built for</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Google Developer Groups on Campus • SRM IST
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Engineered with React, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;
