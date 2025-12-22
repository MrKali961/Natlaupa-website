import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function GET() {
  try {
    // Fetch hotels to analyze
    const hotelsResponse = await fetch(`${API_URL}/hotels?limit=20`, {
      headers: { 'Content-Type': 'application/json' },
    });

    let hotelsData: { name: string; country: string; city?: string }[] = [];
    if (hotelsResponse.ok) {
      const data = await hotelsResponse.json();
      hotelsData = data.data?.hotels || data.hotels || [];
    }

    // Generate AI-powered insights
    if (genAI && hotelsData.length > 0) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      // Create context from hotel data
      const hotelNames = hotelsData.map((h: { name: string; country: string; city?: string }) =>
        `${h.name} in ${h.city || h.country}`
      ).join(', ');

      const countries = [...new Set(hotelsData.map((h: { country: string }) => h.country))];

      const prompt = `You are a luxury travel analyst. Based on the following luxury hotels: ${hotelNames}

Generate realistic travel insights for this week. Return ONLY a valid JSON object with these exact fields (no markdown, no code blocks, just the JSON):
{
  "searchTrend": "a percentage trend like +12% or +8%",
  "topSearch": "the most popular destination from: ${countries.join(', ')}",
  "avgStay": "average stay duration like 4 nights or 7 nights"
}

Make the insights sound realistic for a luxury travel platform. The search trend should be positive (between +5% and +25%). The average stay should be between 3-10 nights.`;

      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Parse the JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const insights = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            searchTrend: insights.searchTrend || '+12%',
            topSearch: insights.topSearch || countries[0] || 'Paris',
            avgStay: insights.avgStay || '5 nights'
          });
        }
      } catch (aiError) {
        console.error('AI generation error:', aiError);
      }
    }

    // Fallback: Generate insights based on hotel data without AI
    if (hotelsData.length > 0) {
      const countries = [...new Set(hotelsData.map((h: { country: string }) => h.country))];
      const randomTrend = Math.floor(Math.random() * 20) + 5; // 5-25%
      const randomStay = Math.floor(Math.random() * 5) + 4; // 4-8 nights

      return NextResponse.json({
        searchTrend: `+${randomTrend}%`,
        topSearch: countries[Math.floor(Math.random() * countries.length)] || 'France',
        avgStay: `${randomStay} nights`
      });
    }

    // Default fallback
    return NextResponse.json({
      searchTrend: '+15%',
      topSearch: 'France',
      avgStay: '5 nights'
    });
  } catch (error) {
    console.error('Error fetching insights:', error);

    // Return default values on error
    return NextResponse.json({
      searchTrend: '+12%',
      topSearch: 'Paris',
      avgStay: '5 nights'
    }, { status: 200 });
  }
}
