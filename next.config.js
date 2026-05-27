/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  reactStrictMode: true,
  // Prisma needs to be external for serverless functions
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Fix turbopack root detection issue with multiple lockfiles
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: '/legal-notice',       destination: '/mentions-legales',                 permanent: true },
      { source: '/privacy-policy',     destination: '/politique-de-confidentialite',     permanent: true },
      { source: '/terms-of-use',       destination: '/cgu',                              permanent: true },
      { source: '/terms-of-service',   destination: '/conditions-generales-service',     permanent: true },
      { source: '/cookie-policy',      destination: '/politique-cookies',                permanent: true },
      { source: '/mediation',          destination: '/mediation-consommation',           permanent: true },
      { source: '/for-hotels',         destination: '/hospitality',                      permanent: true },
      { source: '/become-angel',       destination: '/join-the-private-club',            permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)\\.(js|css)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
