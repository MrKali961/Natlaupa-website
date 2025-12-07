import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// POST - Save consent preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, essential, analytics, personalization } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Forward to server API
    const response = await fetch(`${API_URL}/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        essential: essential ?? true,
        analytics: analytics ?? false,
        personalization: personalization ?? false
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to save consent preferences' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      consent: data.data || data.consent
    });
  } catch (error) {
    console.error('Error saving consent:', error);
    return NextResponse.json(
      { error: 'Failed to save consent preferences' },
      { status: 500 }
    );
  }
}

// GET - Get consent preferences by session ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Forward to server API
    const response = await fetch(`${API_URL}/consent/${sessionId}`);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { consent: null },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: data.error?.message || 'Failed to fetch consent preferences' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      consent: data.data || data.consent
    });
  } catch (error) {
    console.error('Error fetching consent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consent preferences' },
      { status: 500 }
    );
  }
}
