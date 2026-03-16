const travelAgencySchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Natlaupa',
  url: 'https://www.natlaupa.com',
  description:
    'Experience luxury accommodations worldwide with personalized AI-powered travel concierge.',
  logo: 'https://www.natlaupa.com/natlaupa-logo.svg',
  image: 'https://www.natlaupa.com/opengraph-image',
  sameAs: [
    'https://www.instagram.com/natlaupaa',
    'https://www.linkedin.com/company/natlaupa/',
    'https://www.facebook.com/share/1BwjBfNUpp/?mibextid=wwXIfr',
  ],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Natlaupa',
  url: 'https://www.natlaupa.com',
  logo: 'https://www.natlaupa.com/natlaupa-logo.svg',
  sameAs: [
    'https://www.instagram.com/natlaupaa',
    'https://www.linkedin.com/company/natlaupa/',
    'https://www.facebook.com/share/1BwjBfNUpp/?mibextid=wwXIfr',
  ],
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Natlaupa',
  url: 'https://www.natlaupa.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.natlaupa.com/destinations?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}
