import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Check if a string is a CUID (database ID)
function isCuid(str: string): boolean {
  return /^c[a-z0-9]{24}$/.test(str) || /^h\d+$/.test(str);
}

// GET - Fetch hotel by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Determine if it's an ID or slug and use the appropriate endpoint
    const isId = isCuid(id);
    const endpoint = isId
      ? `${API_URL}/hotels/${id}`
      : `${API_URL}/hotels/slug/${id}`;

    const response = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Hotel not found' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    );
  }
}
