import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SeoProps {
  title: string;
  description: string;
  type?: string;
  name?: string;
  image?: string;
  schema?: object;
}

const Seo: React.FC<SeoProps> = ({ 
  title, 
  description, 
  type = 'website', 
  name = 'Natlaupa', 
  image = 'https://picsum.photos/1200/630?random=1', // Default OG Image
  schema 
}) => {
  const location = useLocation();
  const canonicalUrl = `https://www.natlaupa.com${location.pathname}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title} | Natlaupa</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Natlaupa" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) for Rich Snippets */}
      {/* Using dangerouslySetInnerHTML to prevent React hydration mismatches (Error #525) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

// Fixing the logic inside the return to use dangerous HTML setting as requested
// Re-writing the component body below to ensure the script tag is self-closing with the correct prop
const SeoFixed: React.FC<SeoProps> = ({ 
  title, 
  description, 
  type = 'website', 
  name = 'Natlaupa', 
  image = 'https://picsum.photos/1200/630?random=1', 
  schema 
}) => {
  const location = useLocation();
  const canonicalUrl = `https://www.natlaupa.com${location.pathname}`;

  return (
    <Helmet>
      <title>{title} | Natlaupa</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Natlaupa" />
      <meta property="og:locale" content="en_US" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Helmet>
  );
};

export default SeoFixed;