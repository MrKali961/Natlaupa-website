/**
 * Recommendation Service
 * Combines rule-based filtering with AI-enhanced personalization
 */

import { prisma } from '@/lib/db';
import { generateTravelAdvice } from './geminiService';

// Types
export interface RecommendedHotel {
  id: string;
  name: string;
  location: string;
  country: string;
  category: string;
  rating: number;
  imageUrl: string;
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
  const hotels = await prisma.hotel.findMany({
    where: {
      moodTags: {
        some: {
          mood: {
            name: moodId
          }
        }
      }
    },
    include: {
      moodTags: {
        include: {
          mood: true
        },
        where: {
          mood: {
            name: moodId
          }
        }
      }
    },
    orderBy: {
      rating: 'desc'
    },
    take: limit
  });

  return hotels.map(hotel => ({
    ...hotel,
    moodScore: hotel.moodTags[0]?.weight || 0,
    moodTags: hotel.moodTags.map(mt => ({
      moodId: mt.mood.name,
      weight: mt.weight
    }))
  }));
}

// Get trending hotels (based on interaction data)
export async function getTrendingHotels(limit = 10): Promise<RecommendedHotel[]> {
  // Get hotels with most interactions in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const trendingInteractions = await prisma.userInteraction.groupBy({
    by: ['hotelId'],
    where: {
      createdAt: {
        gte: sevenDaysAgo
      }
    },
    _count: {
      hotelId: true
    },
    orderBy: {
      _count: {
        hotelId: 'desc'
      }
    },
    take: limit
  });

  if (trendingInteractions.length === 0) {
    // Fallback to isTrending flag if no interaction data
    const hotels = await prisma.hotel.findMany({
      where: { isTrending: true },
      take: limit
    });
    return hotels;
  }

  const hotelIds = trendingInteractions.map(i => i.hotelId);
  const hotels = await prisma.hotel.findMany({
    where: {
      id: { in: hotelIds }
    }
  });

  // Sort by interaction count
  return hotelIds.map(id => hotels.find(h => h.id === id)!).filter(Boolean);
}

// Get seasonal recommendations
export async function getSeasonalHotels(limit = 10): Promise<RecommendedHotel[]> {
  const season = getCurrentSeason();

  // Map seasons to preferred moods
  const seasonMoodMap: Record<string, string[]> = {
    winter: ['romantic', 'wellness'],
    spring: ['adventure', 'cultural'],
    summer: ['adventure', 'romantic'],
    autumn: ['cultural', 'wellness']
  };

  const preferredMoods = seasonMoodMap[season] || ['romantic'];

  const hotels = await prisma.hotel.findMany({
    where: {
      moodTags: {
        some: {
          mood: {
            name: { in: preferredMoods }
          }
        }
      }
    },
    include: {
      moodTags: {
        include: { mood: true }
      }
    },
    take: limit
  });

  return hotels.map(hotel => ({
    ...hotel,
    moodTags: hotel.moodTags.map(mt => ({
      moodId: mt.mood.name,
      weight: mt.weight
    }))
  }));
}

// Get personalized recommendations (for logged-in or returning users)
export async function getPersonalizedHotels(
  context: RecommendationContext
): Promise<RecommendedHotel[]> {
  const { userPreferences, recentViews, limit = 10 } = context;

  // If no preferences, return trending
  if (!userPreferences || userPreferences.length === 0) {
    return getTrendingHotels(limit);
  }

  // Get top mood preference
  const topMood = userPreferences.sort((a, b) => b.score - a.score)[0];

  // Get hotels matching top mood, excluding recently viewed
  const hotels = await prisma.hotel.findMany({
    where: {
      moodTags: {
        some: {
          mood: {
            name: topMood.moodId
          }
        }
      },
      id: {
        notIn: recentViews || []
      }
    },
    include: {
      moodTags: {
        include: { mood: true }
      }
    },
    take: limit
  });

  // Score hotels based on user preferences
  const scoredHotels = hotels.map(hotel => {
    let score = 0;
    hotel.moodTags.forEach(mt => {
      const pref = userPreferences.find(p => p.moodId === mt.mood.name);
      if (pref) {
        score += mt.weight * pref.score;
      }
    });

    return {
      ...hotel,
      moodScore: score,
      moodTags: hotel.moodTags.map(mt => ({
        moodId: mt.mood.name,
        weight: mt.weight
      }))
    };
  });

  // Sort by score
  return scoredHotels.sort((a, b) => (b.moodScore || 0) - (a.moodScore || 0));
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
  return prisma.moodTag.findMany({
    orderBy: { name: 'asc' }
  });
}

// Get hotel with mood tags by ID
export async function getHotelWithMoods(hotelId: string) {
  return prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      moodTags: {
        include: { mood: true }
      },
      reviews: true
    }
  });
}
