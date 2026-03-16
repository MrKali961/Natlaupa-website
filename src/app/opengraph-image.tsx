import { ImageResponse } from 'next/og';

export const alt = 'Natlaupa - Redefining the Art of Stay';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0d1b33 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Gold accent line at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          }}
        />

        {/* Logo letter */}
        <div
          style={{
            fontSize: '80px',
            color: '#D4AF37',
            fontWeight: 700,
            letterSpacing: '8px',
            marginBottom: '16px',
          }}
        >
          NATLAUPA
        </div>

        {/* Divider */}
        <div
          style={{
            width: '120px',
            height: '2px',
            background: '#D4AF37',
            marginBottom: '24px',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#e2e8f0',
            letterSpacing: '6px',
            textTransform: 'uppercase',
          }}
        >
          Redefining the Art of Stay
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '18px',
            color: '#94a3b8',
            marginTop: '20px',
            letterSpacing: '2px',
          }}
        >
          Luxury Accommodations Worldwide
        </div>

        {/* Gold accent line at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
