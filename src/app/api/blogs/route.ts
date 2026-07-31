import { NextRequest, NextResponse } from 'next/server';
import { BLOG_PAGE_SIZE } from '@/lib/constants';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// GET - Get published blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const limit = parseInt(searchParams.get('limit') || String(BLOG_PAGE_SIZE));
    const page = parseInt(searchParams.get('page') || '1');

    // Build query params for server
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (tag) params.append('tag', tag);
    params.append('limit', limit.toString());
    params.append('page', page.toString());
    // Date order is the right default for browsing the index, but it is NOT user
    // sort intent. Sending it while searching makes the server sort by date
    // instead of relevance, so the best match for a query can land on page 3.
    // Omit it when a term is present and let the search backend rank.
    if (!search) {
      params.append('sortBy', 'publishedAt');
      params.append('sortOrder', 'desc');
    }

    // Fetch from server API (using public endpoint). A search term is arbitrary
    // user input, so caching it would mint a cache entry per one-off query; the
    // unfiltered index is one URL and caches normally.
    const response = await fetch(`${API_URL}/blogs/public?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: search ? 'no-store' : undefined,
      next: search ? undefined : { revalidate: 60 },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch blogs' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      total: data.data?.total || 0,
      page: data.data?.page || 1,
      limit: data.data?.limit || limit,
      blogs: data.data?.items || []
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
