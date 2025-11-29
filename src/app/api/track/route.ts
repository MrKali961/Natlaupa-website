import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    // Check if session has personalization consent
    const consent = await prisma.cookieConsent.findUnique({
      where: { sessionId }
    });

    // Only track if consent is given (or consent record doesn't exist yet for this session)
    if (consent && !consent.analytics) {
      return NextResponse.json({
        success: false,
        message: 'Tracking disabled by user consent preferences'
      });
    }

    // Create interaction record
    const interaction = await prisma.userInteraction.create({
      data: {
        sessionId,
        userId: userId || null,
        hotelId,
        action,
        moodContext: moodContext || null
      }
    });

    // If this is a mood selection, update user preferences if user exists
    if (action === 'mood_select' && userId) {
      await prisma.userPreference.upsert({
        where: {
          userId_moodId: {
            userId,
            moodId: hotelId // For mood_select, hotelId contains moodId
          }
        },
        update: {
          score: {
            increment: 0.1 // Increment preference score
          }
        },
        create: {
          userId,
          moodId: hotelId,
          score: 0.1
        }
      });
    }

    return NextResponse.json({
      success: true,
      interactionId: interaction.id
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
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query
    const where: Record<string, unknown> = {
      createdAt: { gte: startDate }
    };

    if (hotelId) where.hotelId = hotelId;
    if (sessionId) where.sessionId = sessionId;

    // Get interaction counts by action
    const stats = await prisma.userInteraction.groupBy({
      by: ['action'],
      where,
      _count: {
        action: true
      }
    });

    // Get total unique sessions
    const uniqueSessions = await prisma.userInteraction.groupBy({
      by: ['sessionId'],
      where
    });

    // Get most viewed hotels
    const topHotels = await prisma.userInteraction.groupBy({
      by: ['hotelId'],
      where: {
        ...where,
        action: 'view'
      },
      _count: {
        hotelId: true
      },
      orderBy: {
        _count: {
          hotelId: 'desc'
        }
      },
      take: 10
    });

    // Get mood distribution
    const moodStats = await prisma.userInteraction.groupBy({
      by: ['moodContext'],
      where: {
        ...where,
        moodContext: { not: null }
      },
      _count: {
        moodContext: true
      }
    });

    return NextResponse.json({
      period: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days
      },
      stats: {
        byAction: stats.reduce((acc, s) => {
          acc[s.action] = s._count.action;
          return acc;
        }, {} as Record<string, number>),
        uniqueSessions: uniqueSessions.length,
        topHotels: topHotels.map(h => ({
          hotelId: h.hotelId,
          views: h._count.hotelId
        })),
        moodDistribution: moodStats.reduce((acc, m) => {
          if (m.moodContext) {
            acc[m.moodContext] = m._count.moodContext;
          }
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interaction statistics' },
      { status: 500 }
    );
  }
}
