import { ParsedQRData } from '../types';

/**
 * Intelligent parser that identifies the type and structure of scanned QR text.
 */
export function parseScannedQR(raw: string): ParsedQRData {
  const trimmed = raw.trim();

  // 1. WiFi format: WIFI:T:WPA;S:MyNetwork;P:Pass;;
  if (trimmed.startsWith('WIFI:') || trimmed.startsWith('wifi:')) {
    const details: Record<string, string> = {};
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const passMatch = trimmed.match(/P:([^;]+)/i);
    const typeMatch = trimmed.match(/T:([^;]+)/i);
    const hiddenMatch = trimmed.match(/H:([^;]+)/i);

    if (ssidMatch) details['Network (SSID)'] = ssidMatch[1];
    if (typeMatch) details['Security'] = typeMatch[1];
    if (passMatch) details['Password'] = passMatch[1];
    if (hiddenMatch) details['Hidden Network'] = hiddenMatch[1] === 'true' ? 'Yes' : 'No';

    return {
      type: 'wifi',
      title: `Wi-Fi: ${ssidMatch ? ssidMatch[1] : 'Network'}`,
      rawText: trimmed,
      details,
    };
  }

  // 2. vCard format
  if (trimmed.includes('BEGIN:VCARD')) {
    const details: Record<string, string> = {};
    const fnMatch = trimmed.match(/FN:(.+)/i);
    const telMatch = trimmed.match(/TEL[^:]*:(.+)/i);
    const emailMatch = trimmed.match(/EMAIL[^:]*:(.+)/i);
    const orgMatch = trimmed.match(/ORG:(.+)/i);
    const titleMatch = trimmed.match(/TITLE:(.+)/i);
    const urlMatch = trimmed.match(/URL:(.+)/i);

    if (fnMatch) details['Full Name'] = fnMatch[1].trim();
    if (orgMatch) details['Organization'] = orgMatch[1].trim();
    if (titleMatch) details['Title'] = titleMatch[1].trim();
    if (telMatch) details['Phone'] = telMatch[1].trim();
    if (emailMatch) details['Email'] = emailMatch[1].trim();
    if (urlMatch) details['Website'] = urlMatch[1].trim();

    return {
      type: 'vcard',
      title: fnMatch ? `Contact: ${fnMatch[1].trim()}` : 'Contact Card (vCard)',
      rawText: trimmed,
      details,
    };
  }

  // 3. UPI payment format: upi://pay?pa=...&pn=...
  if (trimmed.startsWith('upi://pay')) {
    const details: Record<string, string> = {};
    try {
      const url = new URL(trimmed);
      const pa = url.searchParams.get('pa');
      const pn = url.searchParams.get('pn');
      const am = url.searchParams.get('am');
      const tn = url.searchParams.get('tn');

      if (pa) details['UPI VPA'] = pa;
      if (pn) details['Payee Name'] = pn;
      if (am) details['Amount'] = `₹${am}`;
      if (tn) details['Note'] = tn;

      return {
        type: 'upi',
        title: pn ? `UPI Pay: ${pn}` : 'UPI Payment',
        rawText: trimmed,
        details,
      };
    } catch {
      // Fallback
    }
  }

  // 4. URL format
  if (/^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(trimmed)) {
    const fullUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    return {
      type: 'url',
      title: 'Web Link',
      rawText: fullUrl,
      isActionableUrl: true,
      details: { 'Destination': fullUrl }
    };
  }

  // 5. Email format: mailto: or email string
  if (trimmed.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    const details: Record<string, string> = {};
    if (trimmed.startsWith('mailto:')) {
      try {
        const mailUrl = new URL(trimmed);
        details['Recipient'] = mailUrl.pathname;
        const subject = mailUrl.searchParams.get('subject');
        const body = mailUrl.searchParams.get('body');
        if (subject) details['Subject'] = subject;
        if (body) details['Body'] = body;
      } catch {
        details['Recipient'] = trimmed.replace('mailto:', '');
      }
    } else {
      details['Recipient'] = trimmed;
    }
    return {
      type: 'email',
      title: 'Email Address',
      rawText: trimmed,
      details,
    };
  }

  // 6. Phone / SMS: tel: or smsto:
  if (trimmed.startsWith('tel:') || trimmed.startsWith('smsto:')) {
    const isSms = trimmed.startsWith('smsto:');
    const details: Record<string, string> = {};
    if (isSms) {
      const parts = trimmed.replace(/^smsto:/i, '').split(':');
      details['Phone Number'] = parts[0];
      if (parts[1]) details['Message'] = decodeURIComponent(parts[1]);
    } else {
      details['Phone Number'] = trimmed.replace(/^tel:/i, '');
    }
    return {
      type: 'phone',
      title: isSms ? 'SMS Message' : 'Phone Call',
      rawText: trimmed,
      details,
    };
  }

  // Default: Plain text
  return {
    type: 'text',
    title: 'Text Content',
    rawText: trimmed,
    details: { 'Characters': trimmed.length.toString() }
  };
}
