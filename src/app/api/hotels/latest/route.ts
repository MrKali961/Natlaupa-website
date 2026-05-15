import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
  try {
    // Try date-sorted endpoint first
    const response = await fetch(`${API_URL}/hotels?limit=10&sortBy=createdAt&sortOrder=desc`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });

    const data = await response.json();
    const items = data.data?.items || data.data?.hotels || [];

    if (response.ok && Array.isArray(items) && items.length > 0) {
      return NextResponse.json(data);
    }

    // Fallback to trending hotels
    const fallback = await fetch(`${API_URL}/hotels/trending?limit=10`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });

    const fallbackData = await fallback.json();

    if (!fallback.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch latest hotels' },
        { status: fallback.status }
      );
    }

    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error('Error fetching latest hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest hotels' },
      { status: 500 }
    );
  }
}
