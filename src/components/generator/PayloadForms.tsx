import React from 'react';
import { QRType, WiFiPayload, VCardPayload, EmailPayload, PhonePayload, UpiPayload } from '../../types';

interface PayloadFormsProps {
  type: QRType;
  urlValue: string;
  setUrlValue: (val: string) => void;
  textValue: string;
  setTextValue: (val: string) => void;
  wifiPayload: WiFiPayload;
  setWifiPayload: React.Dispatch<React.SetStateAction<WiFiPayload>>;
  vcardPayload: VCardPayload;
  setVcardPayload: React.Dispatch<React.SetStateAction<VCardPayload>>;
  emailPayload: EmailPayload;
  setEmailPayload: React.Dispatch<React.SetStateAction<EmailPayload>>;
  phonePayload: PhonePayload;
  setPhonePayload: React.Dispatch<React.SetStateAction<PhonePayload>>;
  upiPayload: UpiPayload;
  setUpiPayload: React.Dispatch<React.SetStateAction<UpiPayload>>;
}

export const PayloadForms: React.FC<PayloadFormsProps> = ({
  type,
  urlValue,
  setUrlValue,
  textValue,
  setTextValue,
  wifiPayload,
  setWifiPayload,
  vcardPayload,
  setVcardPayload,
  emailPayload,
  setEmailPayload,
  phonePayload,
  setPhonePayload,
  upiPayload,
  setUpiPayload,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* URL Form */}
      {type === 'url' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter a destination link. Browsers and camera apps will automatically open this webpage when scanned.
          </p>
        </div>
      )}

      {/* Text Form */}
      {type === 'text' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Plain Text or Notes
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {textValue.length} characters
            </span>
          </div>
          <textarea
            rows={4}
            placeholder="Type or paste any text, memo, or raw data here..."
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition resize-none"
          />
        </div>
      )}

      {/* WiFi Form */}
      {type === 'wifi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Network Name (SSID) *
              </label>
              <input
                type="text"
                placeholder="e.g. Home_5G"
                value={wifiPayload.ssid}
                onChange={(e) => setWifiPayload({ ...wifiPayload, ssid: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Security Protocol
              </label>
              <select
                value={wifiPayload.encryption}
                onChange={(e) =>
                  setWifiPayload({
                    ...wifiPayload,
                    encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>

          {wifiPayload.encryption !== 'nopass' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Wi-Fi Password
              </label>
              <input
                type="text"
                placeholder="Enter network password"
                value={wifiPayload.password}
                onChange={(e) => setWifiPayload({ ...wifiPayload, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="hiddenSsid"
              checked={wifiPayload.hidden}
              onChange={(e) => setWifiPayload({ ...wifiPayload, hidden: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="hiddenSsid" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              Hidden Network (SSID is not broadcasting)
            </label>
          </div>
        </div>
      )}

      {/* vCard Contact Form */}
      {type === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                First Name *
              </label>
              <input
                type="text"
                placeholder="John"
                value={vcardPayload.firstName}
                onChange={(e) => setVcardPayload({ ...vcardPayload, firstName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={vcardPayload.lastName}
                onChange={(e) => setVcardPayload({ ...vcardPayload, lastName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={vcardPayload.phone}
                onChange={(e) => setVcardPayload({ ...vcardPayload, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={vcardPayload.email}
                onChange={(e) => setVcardPayload({ ...vcardPayload, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="Acme Corp"
                value={vcardPayload.organization}
                onChange={(e) => setVcardPayload({ ...vcardPayload, organization: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Job Title
              </label>
              <input
                type="text"
                placeholder="Software Engineer"
                value={vcardPayload.title}
                onChange={(e) => setVcardPayload({ ...vcardPayload, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Website or Portfolio
            </label>
            <input
              type="url"
              placeholder="https://portfolio.me"
              value={vcardPayload.website}
              onChange={(e) => setVcardPayload({ ...vcardPayload, website: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Email Form */}
      {type === 'email' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Recipient Email *
            </label>
            <input
              type="email"
              placeholder="hello@company.com"
              value={emailPayload.to}
              onChange={(e) => setEmailPayload({ ...emailPayload, to: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Subject Line
            </label>
            <input
              type="text"
              placeholder="Inquiry / Feedback"
              value={emailPayload.subject}
              onChange={(e) => setEmailPayload({ ...emailPayload, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Pre-filled Message Body
            </label>
            <textarea
              rows={3}
              placeholder="Write pre-filled message text..."
              value={emailPayload.body}
              onChange={(e) => setEmailPayload({ ...emailPayload, body: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* Phone / SMS Form */}
      {type === 'phone' && (
        <div className="space-y-3">
          <div className="flex space-x-4 mb-2">
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="phoneMode"
                checked={phonePayload.mode === 'tel'}
                onChange={() => setPhonePayload({ ...phonePayload, mode: 'tel' })}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Direct Phone Call</span>
            </label>
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="phoneMode"
                checked={phonePayload.mode === 'sms'}
                onChange={() => setPhonePayload({ ...phonePayload, mode: 'sms' })}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Send SMS Text</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Phone Number with Country Code *
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phonePayload.phone}
              onChange={(e) => setPhonePayload({ ...phonePayload, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {phonePayload.mode === 'sms' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Pre-filled SMS Text
              </label>
              <textarea
                rows={2}
                placeholder="Hi, I am reaching out regarding..."
                value={phonePayload.smsMessage}
                onChange={(e) => setPhonePayload({ ...phonePayload, smsMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          )}
        </div>
      )}

      {/* UPI Payment Form */}
      {type === 'upi' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                UPI ID (VPA) *
              </label>
              <input
                type="text"
                placeholder="username@okhdfcbank"
                value={upiPayload.vpa}
                onChange={(e) => setUpiPayload({ ...upiPayload, vpa: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Payee Name
              </label>
              <input
                type="text"
                placeholder="Merchant / Personal Name"
                value={upiPayload.name}
                onChange={(e) => setUpiPayload({ ...upiPayload, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Amount (INR ₹, Optional)
              </label>
              <input
                type="number"
                placeholder="100"
                min="0"
                step="0.01"
                value={upiPayload.amount}
                onChange={(e) => setUpiPayload({ ...upiPayload, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Note / Remarks
              </label>
              <input
                type="text"
                placeholder="Dinner payment, etc."
                value={upiPayload.note}
                onChange={(e) => setUpiPayload({ ...upiPayload, note: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compatible with all Indian UPI applications (Google Pay, PhonePe, Paytm, BHIM, etc.).
          </p>
        </div>
      )}
    </div>
  );
};
