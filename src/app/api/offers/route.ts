import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type OfferType = 'seasonal' | 'trending' | 'for-you';

// Determine current season
function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

// Map seasons to experience types
function getSeasonalExperienceType(): string {
  const season = getCurrentSeason();
  const mapping: Record<string, string> = {
    winter: 'Wellness',
    spring: 'Cultural',
    summer: 'Adventure',
    autumn: 'Romantic',
  };
  return mapping[season] || 'Adventure';
}

// GET - Get offer recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // No `type` means "the offers catalogue" — an unfiltered list. It must NOT default to
    // a curated mode: /offers calls this with no arguments, and defaulting to `trending`
    // silently narrowed the whole catalogue to a flag no offer currently carries.
    const type = searchParams.get('type') as OfferType | null;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query params for server
    const params = new URLSearchParams();
    params.append('limit', limit.toString());

    switch (type) {
      case 'seasonal':
        // Get offers matching current season's experience type
        const experienceType = getSeasonalExperienceType();
        params.append('experienceType', experienceType);
        break;

      case 'trending':
        params.append('isTrending', 'true');
        break;

      case 'for-you':
        params.append('isFeatured', 'true');
        break;

      // No type → catalogue: no curation filter at all.
    }

    // Fetch from server API (using public endpoint)
    const response = await fetch(`${API_URL}/offers/public?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch offers' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const offers = data.data?.offers || [];
    const pagination = data.data?.pagination;

    return NextResponse.json({
      success: true,
      type,
      count: offers.length,
      // The real match count, not the page length. `count` is kept for existing callers.
      total: pagination?.total ?? offers.length,
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? limit,
      totalPages: pagination?.totalPages ?? 1,
      offers,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}
