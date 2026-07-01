import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, phone, companyName, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !companyName || !message) {
      return NextResponse.json(
        { error: 'First name, last name, email, company name, and message are required' },
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
    const response = await fetch(`${API_URL}/partnership-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        companyName,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to submit partnership application' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, id: data.data?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Partnership application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit partnership application' },
      { status: 500 }
    );
  }
}
