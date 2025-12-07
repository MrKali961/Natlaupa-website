import { NextRequest, NextResponse } from 'next/server';
import { getHotelByIdOrSlug } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Hotel ID or slug is required' },
        { status: 400 }
      );
    }

    // Support both ID and slug lookups
    const hotel = await getHotelByIdOrSlug(id);

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ hotel });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    );
  }
}
