'use client';

import { useState, useEffect, useCallback } from 'react';
import { Offer } from '@/lib/types';

interface OffersFilter {
  search?: string;
  experienceType?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  limit?: number;
  page?: number;
}

interface UseOffersResult {
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
}

// Transform server offer to match client Offer type
function transformServerOffer(serverOffer: Record<string, unknown>): Offer {
  const hotel = serverOffer.hotel as Record<string, unknown>;
  const images = hotel?.images as { url: string; isPrimary?: boolean }[] | undefined;
  const amenities = hotel?.amenities as { id: string; name: string; description?: string; icon?: string }[] | undefined;

  return {
    id: serverOffer.id as string,
    slug: serverOffer.slug as string,
    title: serverOffer.title as string,
    tagline: serverOffer.tagline as string,
    description: serverOffer.description as string,
    duration: serverOffer.duration as number,
    imageUrl: serverOffer.imageUrl as string || 'https://picsum.photos/600/400',
    galleryImages: (serverOffer.galleryImages as string[]) || [],
    hotel: {
      id: hotel?.id as string,
      name: hotel?.name as string,
      slug: hotel?.slug as string,
      city: hotel?.city as string || '',
      location: hotel?.city as string || hotel?.location as string || '',
      country: hotel?.country as string || '',
      rating: hotel?.starRating as number || hotel?.rating as number || 5.0,
      imageUrl: hotel?.thumbnailImage as string || images?.find(img => img.isPrimary)?.url || images?.[0]?.url || 'https://picsum.photos/600/400',
      category: hotel?.category as string || (hotel?.style as { name?: string })?.name || 'Luxury',
      isTrending: hotel?.isTrending as boolean || false,
      description: hotel?.description as string || hotel?.shortDescription as string || '',
      amenities: amenities?.map(a => a.name) || [],
      galleryImages: images?.map(img => img.url) || [],
    },
    hotelId: serverOffer.hotelId as string,
    activities: (serverOffer.activities as Offer['activities']) || [],
    experienceType: serverOffer.experienceType as string,
    isTrending: serverOffer.isTrending as boolean || false,
    isFeatured: serverOffer.isFeatured as boolean || false,
    reviews: (serverOffer.reviews as Offer['reviews']) || [],
    createdAt: serverOffer.createdAt ? new Date(serverOffer.createdAt as string) : undefined,
    updatedAt: serverOffer.updatedAt ? new Date(serverOffer.updatedAt as string) : undefined,
  };
}

export function useOffers(filters?: OffersFilter): UseOffersResult {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.experienceType) params.append('experienceType', filters.experienceType);
      if (filters?.isTrending !== undefined) params.append('isTrending', String(filters.isTrending));
      if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.page) params.append('page', String(filters.page));

      // Fetch offers
      const response = await fetch(`/api/offers?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.offers) {
        const transformedOffers = data.offers.map(transformServerOffer);
        setOffers(transformedOffers);
        // The real match count, not the page length — data.count is the page length.
        setTotal(data.total ?? transformedOffers.length);
      } else {
        setOffers([]);
        setTotal(0);
        setError(data.error || 'Failed to fetch offers');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
      setOffers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.experienceType, filters?.isTrending, filters?.isFeatured, filters?.limit, filters?.page]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    isLoading,
    error,
    total,
    refetch: fetchOffers,
  };
}

// Hook for fetching a single offer
export function useOffer(id: string) {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffer() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/offers/${id}`);
        const data = await response.json();

        if (response.ok && data.offer) {
          setOffer(transformServerOffer(data.offer));
        } else {
          setOffer(null);
          setError(data.error || 'Offer not found');
        }
      } catch (err) {
        console.error('Error fetching offer:', err);
        setOffer(null);
        setError(err instanceof Error ? err.message : 'Failed to fetch offer');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffer();
  }, [id]);

  return { offer, isLoading, error };
}

// Hook for fetching trending offers
export function useTrendingOffers(limit: number = 6) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingOffers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/offers?type=trending&limit=${limit}`);
        const data = await response.json();

        if (response.ok && data.offers) {
          setOffers(data.offers.map(transformServerOffer));
        } else {
          setOffers([]);
          setError(data.error || 'Failed to fetch trending offers');
        }
      } catch (err) {
        console.error('Error fetching trending offers:', err);
        setOffers([]);
        setError(err instanceof Error ? err.message : 'Failed to fetch trending offers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingOffers();
  }, [limit]);

  return { offers, isLoading, error };
}
