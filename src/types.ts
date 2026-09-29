export type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone' | 'upi';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface WiFiPayload {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardPayload {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface PhonePayload {
  phone: string;
  smsMessage: string;
  mode: 'tel' | 'sms';
}

export interface UpiPayload {
  vpa: string;
  name: string;
  amount: string;
  note: string;
}

export interface QRConfig {
  type: QRType;
  rawValue: string;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  errorCorrectionLevel: ErrorCorrectionLevel;
  size: number;
  margin: number;
  logoDataUrl?: string;
  logoSizePercent: number; // 15 to 30
}

export interface ParsedQRData {
  type: QRType;
  title: string;
  rawText: string;
  details?: Record<string, string>;
  isActionableUrl?: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  direction: 'generated' | 'scanned';
  type: QRType;
  title: string;
  payload: string;
}
