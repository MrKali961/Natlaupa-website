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

    // Parse query parameters
    const type = (searchParams.get('type') || 'trending') as OfferType;
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

      default:
        params.append('isTrending', 'true');
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

    return NextResponse.json({
      success: true,
      type,
      count: data.data?.offers?.length || 0,
      offers: data.data?.offers || []
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}
