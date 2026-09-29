import { WiFiPayload, VCardPayload, EmailPayload, PhonePayload, UpiPayload } from '../types';

/**
 * Formats WiFi credentials according to standard meCard/ZXing format:
 * WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
 */
export function formatWiFiPayload(payload: WiFiPayload): string {
  const escape = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');
  const enc = payload.encryption;
  const ssid = escape(payload.ssid.trim());
  const pass = enc === 'nopass' ? '' : escape(payload.password);
  const hidden = payload.hidden ? 'true' : 'false';

  return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`;
}

/**
 * Formats Contact info according to RFC 6350 vCard 3.0 standard.
 */
export function formatVCardPayload(payload: VCardPayload): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const fn = `${payload.firstName} ${payload.lastName}`.trim();
  if (fn) {
    lines.push(`FN:${fn}`);
    lines.push(`N:${payload.lastName.trim()};${payload.firstName.trim()};;;`);
  }

  if (payload.organization.trim()) {
    lines.push(`ORG:${payload.organization.trim()}`);
  }

  if (payload.title.trim()) {
    lines.push(`TITLE:${payload.title.trim()}`);
  }

  if (payload.phone.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${payload.phone.trim()}`);
  }

  if (payload.email.trim()) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${payload.email.trim()}`);
  }

  if (payload.website.trim()) {
    const url = payload.website.startsWith('http') ? payload.website : `https://${payload.website}`;
    lines.push(`URL:${url.trim()}`);
  }

  if (payload.address.trim()) {
    lines.push(`ADR;TYPE=WORK:;;${payload.address.trim()};;;;`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Formats Email into a standard mailto: URI.
 */
export function formatEmailPayload(payload: EmailPayload): string {
  const to = encodeURIComponent(payload.to.trim());
  const params: string[] = [];
  if (payload.subject.trim()) {
    params.push(`subject=${encodeURIComponent(payload.subject.trim())}`);
  }
  if (payload.body.trim()) {
    params.push(`body=${encodeURIComponent(payload.body.trim())}`);
  }

  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${to}${query}`;
}

/**
 * Formats Phone call or SMS message.
 */
export function formatPhonePayload(payload: PhonePayload): string {
  const cleaned = payload.phone.replace(/\s+/g, '');
  if (payload.mode === 'sms') {
    const msg = encodeURIComponent(payload.smsMessage || '');
    return msg ? `smsto:${cleaned}:${msg}` : `smsto:${cleaned}`;
  }
  return `tel:${cleaned}`;
}

/**
 * Formats UPI Payment URI (Universal in Indian tech ecosystem).
 */
export function formatUpiPayload(payload: UpiPayload): string {
  const params: string[] = [`pa=${encodeURIComponent(payload.vpa.trim())}`];
  if (payload.name.trim()) params.push(`pn=${encodeURIComponent(payload.name.trim())}`);
  if (payload.amount.trim() && !isNaN(Number(payload.amount))) {
    params.push(`am=${encodeURIComponent(payload.amount.trim())}`);
    params.push('cu=INR');
  }
  if (payload.note.trim()) params.push(`tn=${encodeURIComponent(payload.note.trim())}`);

  return `upi://pay?${params.join('&')}`;
}
