/**
 * Recommendation Service
 * Combines rule-based filtering with AI-enhanced personalization
 */

import { generateTravelAdvice } from './geminiService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Types
export interface RecommendedHotel {
  id: string;
  name: string;
  slug?: string;
  location: string;
  country: string;
  category: string;
  rating: number;
  imageUrl: string;
  thumbnailImage?: string;
  description: string | null;
  ctaPhrase: string | null;
  amenities: string[];
  galleryImages: string[];
  moodScore?: number;
  personalizedReason?: string;
  moodTags?: { moodId: string; weight: number }[];
}

export interface RecommendationContext {
  mood?: string;
  sessionId?: string;
  userPreferences?: { moodId: string; score: number }[];
  recentViews?: string[];
  limit?: number;
  type?: 'seasonal' | 'trending' | 'for-you' | 'mood';
}

// Get current season
function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

// Get hotels by mood (rule-based filtering)
export async function getHotelsByMood(moodId: string, limit = 10): Promise<RecommendedHotel[]> {
  try {
    const params = new URLSearchParams({
      mood: moodId,
      limit: limit.toString()
    });

    const response = await fetch(`${API_URL}/hotels?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotels by mood');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching hotels by mood:', error);
    return [];
  }
}

// Get trending hotels (based on interaction data)
export async function getTrendingHotels(limit = 10): Promise<RecommendedHotel[]> {
  try {
    const params = new URLSearchParams({
      isTrending: 'true',
      limit: limit.toString()
    });

    const response = await fetch(`${API_URL}/hotels/trending?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending hotels');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching trending hotels:', error);
    return [];
  }
}

// Get seasonal recommendations
export async function getSeasonalHotels(limit = 10): Promise<RecommendedHotel[]> {
  try {
    const season = getCurrentSeason();

    // Map seasons to preferred moods
    const seasonMoodMap: Record<string, string[]> = {
      winter: ['romantic', 'wellness'],
      spring: ['adventure', 'cultural'],
      summer: ['adventure', 'romantic'],
      autumn: ['cultural', 'wellness']
    };

    const preferredMoods = seasonMoodMap[season] || ['romantic'];

    const params = new URLSearchParams({
      mood: preferredMoods[0], // Use first preferred mood
      limit: limit.toString()
    });

    const response = await fetch(`${API_URL}/hotels?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch seasonal hotels');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching seasonal hotels:', error);
    return [];
  }
}

// Get personalized recommendations (for logged-in or returning users)
export async function getPersonalizedHotels(
  context: RecommendationContext
): Promise<RecommendedHotel[]> {
  const { userPreferences, limit = 10 } = context;

  // If no preferences, return trending
  if (!userPreferences || userPreferences.length === 0) {
    return getTrendingHotels(limit);
  }

  try {
    // Get top mood preference
    const topMood = userPreferences.sort((a, b) => b.score - a.score)[0];

    const params = new URLSearchParams({
      mood: topMood.moodId,
      limit: limit.toString()
    });

    const response = await fetch(`${API_URL}/hotels?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch personalized hotels');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching personalized hotels:', error);
    return getTrendingHotels(limit);
  }
}

// Enhance recommendations with AI-generated reasons
export async function enhanceWithAI(
  hotels: RecommendedHotel[],
  context: RecommendationContext
): Promise<RecommendedHotel[]> {
  // For performance, only enhance top 3 hotels
  const hotelsToEnhance = hotels.slice(0, 3);
  const rest = hotels.slice(3);

  const enhanced = await Promise.all(
    hotelsToEnhance.map(async (hotel) => {
      try {
        const moodContext = context.mood || context.userPreferences?.[0]?.moodId || 'luxury';
        const query = `Why would someone seeking a ${moodContext} experience love staying at ${hotel.name} in ${hotel.location}?`;
        const reason = await generateTravelAdvice(query);

        return {
          ...hotel,
          personalizedReason: reason
        };
      } catch {
        return hotel;
      }
    })
  );

  return [...enhanced, ...rest];
}

// Main recommendation function
export async function getRecommendations(
  context: RecommendationContext
): Promise<RecommendedHotel[]> {
  const { type = 'for-you', mood, limit = 10 } = context;

  let hotels: RecommendedHotel[];

  switch (type) {
    case 'mood':
      if (!mood) throw new Error('Mood is required for mood-based recommendations');
      hotels = await getHotelsByMood(mood, limit);
      break;

    case 'seasonal':
      hotels = await getSeasonalHotels(limit);
      break;

    case 'trending':
      hotels = await getTrendingHotels(limit);
      break;

    case 'for-you':
    default:
      hotels = await getPersonalizedHotels(context);
      break;
  }

  // Enhance with AI if we have results and it's a personalized query
  if (hotels.length > 0 && (type === 'for-you' || type === 'mood')) {
    try {
      hotels = await enhanceWithAI(hotels, context);
    } catch (error) {
      console.error('AI enhancement failed:', error);
      // Continue without AI enhancement
    }
  }

  return hotels;
}

// Get all mood tags
export async function getAllMoodTags() {
  try {
    const response = await fetch(`${API_URL}/moods`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mood tags');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching mood tags:', error);
    return [];
  }
}

// Get hotel with mood tags by ID
export async function getHotelWithMoods(hotelId: string) {
  try {
    const response = await fetch(`${API_URL}/hotels/${hotelId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotel with moods');
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching hotel with moods:', error);
    return null;
  }
}
