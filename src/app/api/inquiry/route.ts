import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { offerId, name, email, phone, message, travelDates, guests } = body;

    // Validate required fields
    if (!offerId || !name || !email || !message) {
      return NextResponse.json(
        {
          error: "Offer ID, name, email, and message are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Parse guests to a number if it's provided as a string
    let guestsNumber: number | undefined;
    if (guests) {
      // Try to extract number from strings like "2 adults" or "2"
      const match = String(guests).match(/\d+/);
      if (match) {
        guestsNumber = parseInt(match[0], 10);
      }
    }

    // Prepare the inquiry data
    const inquiryData: any = {
      offerId,
      name,
      email,
      phone: phone || undefined,
      message: message || "",
      guests: guestsNumber,
    };

    // If travelDates is provided, try to parse it
    // For now, we'll send it in the message if it's a freeform string
    if (travelDates && typeof travelDates === 'string') {
      inquiryData.message = `Travel Dates: ${travelDates}\n\n${message || ''}`;
    }

    // Forward to server API
    const response = await fetch(`${API_URL}/offer-inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiryData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to submit inquiry" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, id: data.data?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Offer inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
