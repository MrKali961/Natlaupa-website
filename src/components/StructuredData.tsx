// Single canonical organization node, referenced by @id elsewhere.
// TravelAgency is a subtype of Organization, so one node (not two) represents the brand.
const ORG_ID = 'https://www.natlaupa.com/#organization';

const travelAgencySchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': ORG_ID,
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

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.natlaupa.com/#website',
  name: 'Natlaupa',
  url: 'https://www.natlaupa.com',
  publisher: { '@id': ORG_ID },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}
