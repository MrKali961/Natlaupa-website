import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // Upsert consent record
    const consent = await prisma.cookieConsent.upsert({
      where: { sessionId },
      update: {
        essential: essential ?? true,
        analytics: analytics ?? false,
        personalization: personalization ?? false,
        updatedAt: new Date()
      },
      create: {
        sessionId,
        essential: essential ?? true,
        analytics: analytics ?? false,
        personalization: personalization ?? false
      }
    });

    return NextResponse.json({
      success: true,
      consent: {
        sessionId: consent.sessionId,
        essential: consent.essential,
        analytics: consent.analytics,
        personalization: consent.personalization
      }
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

    const consent = await prisma.cookieConsent.findUnique({
      where: { sessionId }
    });

    if (!consent) {
      return NextResponse.json(
        { consent: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      consent: {
        sessionId: consent.sessionId,
        essential: consent.essential,
        analytics: consent.analytics,
        personalization: consent.personalization
      }
    });
  } catch (error) {
    console.error('Error fetching consent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consent preferences' },
      { status: 500 }
    );
  }
}
