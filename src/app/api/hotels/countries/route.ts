import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// GET - Fetch countries with hotel counts
export async function GET() {
  try {
    const response = await fetch(`${API_URL}/hotels/countries`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to fetch countries' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
