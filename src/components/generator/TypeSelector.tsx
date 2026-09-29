import React from 'react';
import { Globe, AlignLeft, Wifi, UserCheck, Mail, Phone, IndianRupee } from 'lucide-react';
import { QRType } from '../../types';

interface TypeSelectorProps {
  currentType: QRType;
  onSelectType: (type: QRType) => void;
}

const TYPES: { id: QRType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'url', label: 'Website / URL', icon: Globe },
  { id: 'text', label: 'Plain Text', icon: AlignLeft },
  { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
  { id: 'vcard', label: 'Contact (vCard)', icon: UserCheck },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone / SMS', icon: Phone },
  { id: 'upi', label: 'UPI Payment', icon: IndianRupee },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ currentType, onSelectType }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
      {TYPES.map((t) => {
        const Icon = t.icon;
        const isSelected = currentType === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectType(t.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 select-none ${
              isSelected
                ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div
              className={`p-2 rounded-lg mb-1.5 transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold tracking-tight">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
