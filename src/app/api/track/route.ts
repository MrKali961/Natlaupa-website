import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Valid action types
const VALID_ACTIONS = ['view', 'click', 'inquiry', 'bookmark', 'mood_select'];

// POST - Record user interaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, hotelId, moodContext, sessionId, userId } = body;

    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Forward to server API
    const response = await fetch(`${API_URL}/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId: userId || undefined,
        hotelId,
        action,
        moodContext: moodContext || undefined
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If tracking is disabled by consent, return success with message
      if (response.status === 403) {
        return NextResponse.json({
          success: false,
          message: 'Tracking disabled by user consent preferences'
        });
      }
      return NextResponse.json(
        { error: data.error?.message || 'Failed to record interaction' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      interactionId: data.data?.id
    });
  } catch (error) {
    console.error('Error recording interaction:', error);
    return NextResponse.json(
      { error: 'Failed to record interaction' },
      { status: 500 }
    );
  }
}

// GET - Get interaction statistics (for analytics)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const sessionId = searchParams.get('sessionId');
    const days = searchParams.get('days') || '7';

    // Build query params
    const params = new URLSearchParams();
    if (hotelId) params.append('hotelId', hotelId);
    if (sessionId) params.append('sessionId', sessionId);
    params.append('days', days);

    // Forward to server API - Note: stats endpoint requires auth, so we'll call the general endpoint
    const response = await fetch(`${API_URL}/tracking/stats?${params.toString()}`);

    // If unauthorized (needs admin auth), return local-only stats
    if (response.status === 401 || response.status === 403) {
      // Return empty stats for non-admin users
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      return NextResponse.json({
        period: {
          start: startDate.toISOString(),
          end: new Date().toISOString(),
          days: parseInt(days)
        },
        stats: {
          byAction: {},
          uniqueSessions: 0,
          topHotels: [],
          moodDistribution: {}
        }
      });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to fetch interaction statistics' },
        { status: response.status }
      );
    }

    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interaction statistics' },
      { status: 500 }
    );
  }
}
