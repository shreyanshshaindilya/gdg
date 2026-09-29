import React, { useState, useEffect } from 'react';
import { QRType, QRConfig, WiFiPayload, VCardPayload, EmailPayload, PhonePayload, UpiPayload } from '../../types';
import { TypeSelector } from './TypeSelector';
import { PayloadForms } from './PayloadForms';
import { DesignCustomizer } from './DesignCustomizer';
import { QRPreview } from './QRPreview';
import {
  formatWiFiPayload,
  formatVCardPayload,
  formatEmailPayload,
  formatPhonePayload,
  formatUpiPayload,
} from '../../utils/qrPayloads';
import { saveHistoryItem } from '../../utils/storage';

interface QRGeneratorProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRefreshHistory: () => void;
  initialValue?: string;
  initialType?: QRType;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  onNotify,
  onRefreshHistory,
  initialValue,
  initialType = 'url',
}) => {
  const [currentType, setCurrentType] = useState<QRType>(initialType);

  // Payload form states
  const [urlValue, setUrlValue] = useState(initialValue || 'https://gdg.community.dev');
  const [textValue, setTextValue] = useState('');
  const [wifiPayload, setWifiPayload] = useState<WiFiPayload>({
    ssid: 'SRM_Campus_WiFi',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [vcardPayload, setVcardPayload] = useState<VCardPayload>({
    firstName: 'Shreyansh',
    lastName: 'Shaindilya',
    organization: 'GDG on Campus SRM',
    title: 'Developer',
    phone: '+91 9876543210',
    email: 'shreyansh@example.com',
    website: 'https://github.com/shreyanshshaindilya/gdg',
    address: 'SRM Institute of Science and Technology, Kattankulathur',
  });
  const [emailPayload, setEmailPayload] = useState<EmailPayload>({
    to: 'technical@gdgsrm.com',
    subject: 'GDG Technical Recruitment 2026 Submission',
    body: 'Hello Team,\nHere is my recruitment project submission.',
  });
  const [phonePayload, setPhonePayload] = useState<PhonePayload>({
    phone: '+919876543210',
    smsMessage: 'Hello, checking out QRCraft application!',
    mode: 'tel',
  });
  const [upiPayload, setUpiPayload] = useState<UpiPayload>({
    vpa: 'user@okaxis',
    name: 'Shreyansh Shaindilya',
    amount: '100',
    note: 'Registration Fee',
  });

  // QR Design config state
  const [config, setConfig] = useState<QRConfig>({
    type: 'url',
    rawValue: '',
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    transparentBg: false,
    errorCorrectionLevel: 'M',
    size: 512,
    margin: 2,
    logoDataUrl: undefined,
    logoSizePercent: 22,
  });

  // Automatically update rawValue whenever the active type or respective form field changes
  useEffect(() => {
    let payload = '';
    switch (currentType) {
      case 'url':
        if (urlValue.trim()) {
          payload = urlValue.startsWith('http://') || urlValue.startsWith('https://')
            ? urlValue.trim()
            : `https://${urlValue.trim()}`;
        }
        break;
      case 'text':
        payload = textValue;
        break;
      case 'wifi':
        if (wifiPayload.ssid.trim()) {
          payload = formatWiFiPayload(wifiPayload);
        }
        break;
      case 'vcard':
        if (vcardPayload.firstName.trim() || vcardPayload.phone.trim()) {
          payload = formatVCardPayload(vcardPayload);
        }
        break;
      case 'email':
        if (emailPayload.to.trim()) {
          payload = formatEmailPayload(emailPayload);
        }
        break;
      case 'phone':
        if (phonePayload.phone.trim()) {
          payload = formatPhonePayload(phonePayload);
        }
        break;
      case 'upi':
        if (upiPayload.vpa.trim()) {
          payload = formatUpiPayload(upiPayload);
        }
        break;
    }

    setConfig((prev) => ({
      ...prev,
      type: currentType,
      rawValue: payload,
    }));
  }, [
    currentType,
    urlValue,
    textValue,
    wifiPayload,
    vcardPayload,
    emailPayload,
    phonePayload,
    upiPayload,
  ]);

  const handleSaveToHistory = () => {
    if (!config.rawValue) return;
    let title = 'Generated QR Code';
    if (currentType === 'url') title = urlValue;
    else if (currentType === 'wifi') title = `Wi-Fi: ${wifiPayload.ssid}`;
    else if (currentType === 'vcard') title = `Contact: ${vcardPayload.firstName} ${vcardPayload.lastName}`;
    else if (currentType === 'email') title = `Email: ${emailPayload.to}`;
    else if (currentType === 'phone') title = `Phone: ${phonePayload.phone}`;
    else if (currentType === 'upi') title = `UPI Pay: ${upiPayload.name || upiPayload.vpa}`;
    else title = textValue.slice(0, 30) || 'Text Note';

    saveHistoryItem({
      direction: 'generated',
      type: currentType,
      title,
      payload: config.rawValue,
    });
    onRefreshHistory();
  };

  return (
    <div className="space-y-6">
      {/* Category selector row */}
      <TypeSelector currentType={currentType} onSelectType={setCurrentType} />

      {/* Main two-column editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form inputs & Design Customizer */}
        <div className="lg:col-span-7 space-y-6">
          <PayloadForms
            type={currentType}
            urlValue={urlValue}
            setUrlValue={setUrlValue}
            textValue={textValue}
            setTextValue={setTextValue}
            wifiPayload={wifiPayload}
            setWifiPayload={setWifiPayload}
            vcardPayload={vcardPayload}
            setVcardPayload={setVcardPayload}
            emailPayload={emailPayload}
            setEmailPayload={setEmailPayload}
            phonePayload={phonePayload}
            setPhonePayload={setPhonePayload}
            upiPayload={upiPayload}
            setUpiPayload={setUpiPayload}
          />

          <DesignCustomizer config={config} setConfig={setConfig} />
        </div>

        {/* Right Column: Live Sticky Preview & Exports */}
        <div className="lg:col-span-5">
          <QRPreview
            config={config}
            onSaveToHistory={handleSaveToHistory}
            onNotify={onNotify}
          />
        </div>
      </div>
    </div>
  );
};
