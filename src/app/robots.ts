import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.natlaupa.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // NOTE: /_next/ must NOT be disallowed. Next.js serves every JS chunk and
        // stylesheet from /_next/static/, so blocking it prevents Googlebot from
        // rendering the site at all and degrades mobile/layout assessment sitewide.
        disallow: ['/api/', '/admin/'],
      },
      // AI answer engines. Listed explicitly so intent is visible in the served file
      // (the wildcard rule above already permits them).
      // Retrieval agents — these fetch pages to cite in answers:
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      // Training-only crawlers (no citation/referral upside, allowed by choice):
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
