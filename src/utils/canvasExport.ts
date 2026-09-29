import QRCode from 'qrcode';
import { QRConfig } from '../types';

/**
 * Draws high-resolution QR code onto a canvas, including optional centered logo/icon.
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  config: QRConfig
): Promise<void> {
  const {
    rawValue,
    fgColor,
    bgColor,
    transparentBg,
    errorCorrectionLevel,
    size,
    margin,
    logoDataUrl,
    logoSizePercent,
  } = config;

  if (!rawValue) return;

  const actualBgColor = transparentBg ? '#00000000' : bgColor;

  // Render QR matrix onto canvas
  await QRCode.toCanvas(canvas, rawValue, {
    width: size,
    margin: margin,
    color: {
      dark: fgColor,
      light: actualBgColor,
    },
    errorCorrectionLevel: logoDataUrl ? 'H' : errorCorrectionLevel, // Logo requires High error correction
  });

  // If a center logo is provided, draw it cleanly in the center with a background badge
  if (logoDataUrl) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const logoDimension = Math.floor((size * (logoSizePercent || 22)) / 100);
        const centerPos = (size - logoDimension) / 2;
        const padding = Math.max(6, Math.floor(logoDimension * 0.12));

        // Draw rounded white badge background behind logo so QR modules don't clash
        ctx.save();
        ctx.fillStyle = transparentBg ? '#ffffff' : bgColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        const badgeX = centerPos - padding;
        const badgeY = centerPos - padding;
        const badgeSize = logoDimension + padding * 2;
        const radius = 12;

        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, radius)
          : ctx.rect(badgeX, badgeY, badgeSize, badgeSize);
        ctx.fill();
        ctx.restore();

        // Draw image clipped inside
        ctx.save();
        ctx.beginPath();
        const innerRadius = 8;
        ctx.roundRect
          ? ctx.roundRect(centerPos, centerPos, logoDimension, logoDimension, innerRadius)
          : ctx.rect(centerPos, centerPos, logoDimension, logoDimension);
        ctx.clip();
        ctx.drawImage(img, centerPos, centerPos, logoDimension, logoDimension);
        ctx.restore();

        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoDataUrl;
    });
  }
}

/**
 * Generates an SVG string representation of the QR code.
 */
export async function generateQRSvg(config: QRConfig): Promise<string> {
  const { rawValue, fgColor, bgColor, transparentBg, errorCorrectionLevel, margin } = config;
  return QRCode.toString(rawValue, {
    type: 'svg',
    margin: margin,
    color: {
      dark: fgColor,
      light: transparentBg ? '#00000000' : bgColor,
    },
    errorCorrectionLevel: config.logoDataUrl ? 'H' : errorCorrectionLevel,
  });
}

/**
 * Downloads the current canvas content as a high quality PNG file.
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename = 'qrcode.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads raw SVG string as an svg file.
 */
export function downloadSvg(svgString: string, filename = 'qrcode.svg'): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the canvas image data to system clipboard.
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}
