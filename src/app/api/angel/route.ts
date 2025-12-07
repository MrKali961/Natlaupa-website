import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      currentPosition,
      yearsInHospitality,
      motivation
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !currentPosition || !yearsInHospitality || !motivation) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
    const response = await fetch(`${API_URL}/angel-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        currentPosition,
        yearsInHospitality,
        motivation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to submit angel application' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, id: data.data?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Angel application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit angel application' },
      { status: 500 }
    );
  }
}
