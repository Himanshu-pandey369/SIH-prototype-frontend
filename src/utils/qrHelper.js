import QRCode from 'qrcode';

export const PUBLIC_PRODUCTION_URL = 'https://sih-prototype-frontend.vercel.app';

/**
 * Returns a publicly accessible verification URL for the given certificate ID.
 * - Prevents redirection to Vercel login by avoiding private preview deployment hashes.
 * - Always routes external devices (e.g. mobile phones scanning QR codes) to the public verification endpoint.
 */
export const getVerificationUrl = (certificateId) => {
  if (!certificateId) return '';

  const configuredUrl = (import.meta.env.VITE_PUBLIC_CLIENT_URL || import.meta.env.VITE_CLIENT_URL || '').trim().replace(/\/+$/, '');
  
  if (configuredUrl) {
    // If configured URL is a protected preview deployment hash, default to public production URL
    if (configuredUrl.includes('-projects.vercel.app')) {
      return `${PUBLIC_PRODUCTION_URL}/verify/${certificateId}`;
    }
    return `${configuredUrl}/verify/${certificateId}`;
  }

  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const isPreviewDeployment = hostname.includes('-projects.vercel.app');

    // If running locally or on a protected Vercel preview URL, use the public production URL
    if (isLocalhost || isPreviewDeployment) {
      return `${PUBLIC_PRODUCTION_URL}/verify/${certificateId}`;
    }

    return `${window.location.origin}/verify/${certificateId}`;
  }

  return `${PUBLIC_PRODUCTION_URL}/verify/${certificateId}`;
};

/**
 * Dynamically generates a high-quality Base64 QR code Data URL for the given text/URL.
 */
export const generateQRCodeDataUrl = async (payload) => {
  if (!payload) return '';
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      scale: 8,
      color: {
        dark: '#1A202C',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating dynamic QR code:', error);
    return '';
  }
};
