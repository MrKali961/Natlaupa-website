import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, message, subscribeNewsletter } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
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
    const response = await fetch(`${API_URL}/contact-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone: phone && phone.trim() !== '' ? phone : undefined,
        subject: 'Contact Form Submission',
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to submit contact form' },
        { status: response.status }
      );
    }

    // If newsletter subscription is checked, also subscribe to newsletter
    if (subscribeNewsletter) {
      try {
        await fetch(`${API_URL}/newsletters/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (newsletterError) {
        console.error('Newsletter subscription error:', newsletterError);
        // Don't fail the contact submission if newsletter fails
      }
    }

    return NextResponse.json(
      { success: true, id: data.data?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
