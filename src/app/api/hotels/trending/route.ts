import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// GET - Fetch trending hotels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';

    const response = await fetch(`${API_URL}/hotels/trending?limit=${limit}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to fetch trending hotels' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trending hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending hotels' },
      { status: 500 }
    );
  }
}
