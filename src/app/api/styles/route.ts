import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// GET - Fetch all public styles
export async function GET() {
  try {
    const response = await fetch(`${API_URL}/hotel-styles/public`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to fetch styles' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching styles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch styles' },
      { status: 500 }
    );
  }
}
