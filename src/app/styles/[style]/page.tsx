import { notFound } from 'next/navigation';
import { fetchStyleBySlug, fetchStyles, fetchHotelsByStyle } from '@/lib/server-api';
import StylePageClient from './StylePageClient';
import { JsonLd, breadcrumbList } from '@/components/JsonLd';

export default async function StylePage({ params }: { params: Promise<{ style: string }> }) {
  const { style: styleSlug } = await params;

  const [style, allStyles] = await Promise.all([
    fetchStyleBySlug(styleSlug),
    fetchStyles(),
  ]);

  if (!style) notFound();

  const hotels = await fetchHotelsByStyle(style.id);

  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Styles', path: '/styles' },
          { name: style.name, path: `/styles/${styleSlug}` },
        ])}
      />
      <StylePageClient style={style} hotels={hotels} allStyles={allStyles} />
    </>
  );
}
