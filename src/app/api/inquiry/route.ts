import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { hotelId, hotelName, name, email, phone, message } = body;

    // Validate required fields
    if (!hotelId || !hotelName || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Hotel ID, hotel name, name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Forward to server API
    const response = await fetch(`${API_URL}/hotel-inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelId,
        hotelName,
        name,
        email,
        phone: phone || undefined,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to submit inquiry' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, id: data.data?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Hotel inquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
