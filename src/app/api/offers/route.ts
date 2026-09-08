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
    const search = searchParams.get('search')?.trim() || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query params for server
    const params = new URLSearchParams();
    params.set('limit', limit.toString());

    // The catalogue's own filters. These have to be forwarded or /offers' search
    // box sends a request and gets back the same unfiltered page every time.
    for (const key of ['search', 'page', 'experienceType', 'isTrending', 'isFeatured', 'sortBy', 'sortOrder']) {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    }

    // Keys this route INJECTS on the caller's behalf, as opposed to keys the caller sent itself.
    // Only injected keys may be dropped by the empty-result fallback below — a filter the caller
    // asked for explicitly must be honoured even when it matches nothing.
    const injectedKeys: string[] = [];

    switch (type) {
      case 'seasonal':
        // Get offers matching current season's experience type
        if (!searchParams.get('experienceType')) {
          params.set('experienceType', getSeasonalExperienceType());
          injectedKeys.push('experienceType');
        }
        break;

      case 'trending':
        if (!searchParams.get('isTrending')) {
          params.set('isTrending', 'true');
          injectedKeys.push('isTrending');
        }
        break;

      case 'for-you':
        if (!searchParams.get('isFeatured')) {
          params.set('isFeatured', 'true');
          injectedKeys.push('isFeatured');
        }
        break;

      // No type → catalogue: no curation filter at all.
    }

    // Fetch from server API (using public endpoint). A search term is arbitrary
    // user input, so caching it would mint a cache entry per one-off query; the
    // curated modes are a small fixed set of URLs and cache normally.
    const fetchOffers = async (qs: URLSearchParams) => {
      const response = await fetch(`${API_URL}/offers/public?${qs.toString()}`, {
        headers: { 'Content-Type': 'application/json' },
        cache: search ? 'no-store' : undefined,
        next: search ? undefined : { revalidate: 60 },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { ok: false as const, status: response.status, message: errorData.error?.message };
      }

      const data = await response.json();
      return {
        ok: true as const,
        offers: data.data?.offers || [],
        pagination: data.data?.pagination,
      };
    };

    let result = await fetchOffers(params);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to fetch offers' },
        { status: result.status }
      );
    }

    // A curated tab that matches nothing must not render an empty section. Every offer in the
    // catalogue currently has isTrending = isFeatured = false and an experienceType that does not
    // match the season map, so all three curated modes returned 0 of 6 offers on every page load.
    // Curation is a ranking preference, not a visibility rule: when the injected filter empties the
    // result, retry without it and serve the catalogue instead.
    let fellBackFrom: string[] = [];
    if (result.offers.length === 0 && injectedKeys.length > 0) {
      const relaxed = new URLSearchParams(params);
      injectedKeys.forEach((key) => relaxed.delete(key));
      const retry = await fetchOffers(relaxed);
      if (retry.ok && retry.offers.length > 0) {
        result = retry;
        fellBackFrom = injectedKeys;
      }
    }

    const { offers, pagination } = result;

    return NextResponse.json({
      success: true,
      type,
      // Names the filters that were dropped to avoid an empty section, so a caller (or anyone
      // debugging) can tell a curated result from a fallback one.
      relaxedFilters: fellBackFrom.length > 0 ? fellBackFrom : undefined,
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
