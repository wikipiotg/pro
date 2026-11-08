import QRCode from 'qrcode';

export async function generateQrDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 8,
      color: {
        dark: '#3B82F6',
        light: '#0B1020',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}
