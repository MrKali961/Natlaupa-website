import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations, getAllMoodTags, type RecommendationContext } from '@/services/recommendationService';

// GET - Get recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const type = (searchParams.get('type') || 'for-you') as RecommendationContext['type'];
    const mood = searchParams.get('mood') || undefined;
    const sessionId = searchParams.get('sessionId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Parse user preferences from query string (JSON encoded)
    let userPreferences: { moodId: string; score: number }[] | undefined;
    const prefsParam = searchParams.get('preferences');
    if (prefsParam) {
      try {
        userPreferences = JSON.parse(prefsParam);
      } catch {
        // Invalid preferences format, ignore
      }
    }

    // Parse recent views
    let recentViews: string[] | undefined;
    const viewsParam = searchParams.get('recentViews');
    if (viewsParam) {
      try {
        recentViews = JSON.parse(viewsParam);
      } catch {
        // Invalid format, ignore
      }
    }

    // Build context
    const context: RecommendationContext = {
      type,
      mood,
      sessionId,
      limit,
      userPreferences,
      recentViews
    };

    // Get recommendations
    const hotels = await getRecommendations(context);

    return NextResponse.json({
      success: true,
      type,
      mood,
      count: hotels.length,
      hotels: hotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        country: hotel.country,
        category: hotel.category,
        rating: hotel.rating,
        imageUrl: hotel.imageUrl,
        description: hotel.description,
        ctaPhrase: hotel.ctaPhrase,
        amenities: hotel.amenities,
        galleryImages: hotel.galleryImages,
        moodScore: hotel.moodScore,
        personalizedReason: hotel.personalizedReason,
        moodTags: hotel.moodTags
      }))
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// GET /api/recommendations/moods - Get all available mood tags
export async function OPTIONS() {
  try {
    const moods = await getAllMoodTags();

    return NextResponse.json({
      success: true,
      moods: moods.map(mood => ({
        id: mood.id,
        name: mood.name,
        label: mood.label,
        icon: mood.icon,
        color: mood.color
      }))
    });
  } catch (error) {
    console.error('Error fetching mood tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood tags' },
      { status: 500 }
    );
  }
}
