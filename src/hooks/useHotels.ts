'use client';

import { useState, useEffect, useCallback } from 'react';
import { ALL_HOTELS, CATEGORIES, COUNTRIES } from '@/lib/constants';
import { Hotel, Category } from '@/types';

interface HotelsFilter {
  search?: string;
  country?: string;
  category?: string;
  style?: string;
  isTrending?: boolean;
  limit?: number;
  page?: number;
}

interface UseHotelsResult {
  hotels: Hotel[];
  categories: Category[];
  countries: string[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
}

// Transform server hotel to match client Hotel type
function transformServerHotel(serverHotel: Record<string, unknown>): Hotel {
  return {
    id: serverHotel.id as string,
    name: serverHotel.name as string,
    location: serverHotel.location as string || serverHotel.address as string || '',
    country: serverHotel.country as string || (serverHotel.destination as { country?: string })?.country || '',
    rating: serverHotel.rating as number || 0,
    imageUrl: serverHotel.imageUrl as string || serverHotel.mainImage as string || 'https://picsum.photos/600/400',
    category: serverHotel.category as string || (serverHotel.style as { name?: string })?.name || 'Hotels',
    isTrending: serverHotel.isTrending as boolean || false,
    lat: serverHotel.lat as number || serverHotel.latitude as number,
    lng: serverHotel.lng as number || serverHotel.longitude as number,
    amenities: (serverHotel.amenities as string[]) || [],
    description: serverHotel.description as string || '',
    ctaPhrase: serverHotel.ctaPhrase as string,
    galleryImages: (serverHotel.galleryImages as string[]) || (serverHotel.images as { url: string }[])?.map(img => img.url) || [],
    reviews: (serverHotel.reviews as Hotel['reviews']) || [],
  };
}

export function useHotels(filters?: HotelsFilter): UseHotelsResult {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [countries, setCountries] = useState<string[]>(COUNTRIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.country) params.append('country', filters.country);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.style) params.append('style', filters.style);
      if (filters?.isTrending !== undefined) params.append('isTrending', String(filters.isTrending));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.page) params.append('page', String(filters.page));

      const response = await fetch(`/api/hotels?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.data?.items && data.data.items.length > 0) {
        // Transform server data to match client types
        const transformedHotels = data.data.items.map(transformServerHotel);
        setHotels(transformedHotels);
        setTotal(data.data.total || transformedHotels.length);
      } else {
        // Fallback to static data
        let filteredHotels = [...ALL_HOTELS];

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredHotels = filteredHotels.filter(h =>
            h.name.toLowerCase().includes(searchLower) ||
            h.location.toLowerCase().includes(searchLower) ||
            h.country.toLowerCase().includes(searchLower)
          );
        }

        if (filters?.country) {
          filteredHotels = filteredHotels.filter(h =>
            h.country.toLowerCase() === filters.country!.toLowerCase()
          );
        }

        if (filters?.category) {
          filteredHotels = filteredHotels.filter(h =>
            h.category.toLowerCase() === filters.category!.toLowerCase()
          );
        }

        if (filters?.isTrending !== undefined) {
          filteredHotels = filteredHotels.filter(h => h.isTrending === filters.isTrending);
        }

        if (filters?.limit) {
          filteredHotels = filteredHotels.slice(0, filters.limit);
        }

        setHotels(filteredHotels);
        setTotal(filteredHotels.length);
      }

      // Try to fetch categories from server
      try {
        const stylesResponse = await fetch('/api/styles');
        const stylesData = await stylesResponse.json();
        if (stylesResponse.ok && stylesData.data && stylesData.data.length > 0) {
          setCategories(stylesData.data.map((style: { id: string; name: string; imageUrl?: string; hotelCount?: number }) => ({
            id: style.id,
            name: style.name,
            imageUrl: style.imageUrl || 'https://picsum.photos/600/400',
            count: style.hotelCount || 0,
          })));
        }
      } catch {
        // Keep default categories
      }

      // Try to fetch countries from server
      try {
        const countriesResponse = await fetch('/api/hotels/countries');
        const countriesData = await countriesResponse.json();
        if (countriesResponse.ok && countriesData.data && countriesData.data.length > 0) {
          setCountries(countriesData.data.map((c: { country: string }) => c.country));
        }
      } catch {
        // Keep default countries
      }

    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
      // Fallback to static data
      setHotels(ALL_HOTELS);
      setTotal(ALL_HOTELS.length);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.country, filters?.category, filters?.style, filters?.isTrending, filters?.limit, filters?.page]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return {
    hotels,
    categories,
    countries,
    isLoading,
    error,
    total,
    refetch: fetchHotels,
  };
}

// Hook for fetching a single hotel
export function useHotel(id: string) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotel() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/hotels/${id}`);
        const data = await response.json();

        if (response.ok && data.data) {
          setHotel(transformServerHotel(data.data));
        } else {
          // Fallback to static data
          const staticHotel = ALL_HOTELS.find(h => h.id === id);
          if (staticHotel) {
            setHotel(staticHotel);
          } else {
            setError('Hotel not found');
          }
        }
      } catch (err) {
        console.error('Error fetching hotel:', err);
        // Fallback to static data
        const staticHotel = ALL_HOTELS.find(h => h.id === id);
        if (staticHotel) {
          setHotel(staticHotel);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch hotel');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchHotel();
  }, [id]);

  return { hotel, isLoading, error };
}

// Hook for fetching trending hotels
export function useTrendingHotels(limit: number = 6) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingHotels() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/hotels/trending?limit=${limit}`);
        const data = await response.json();

        if (response.ok && data.data && data.data.length > 0) {
          setHotels(data.data.map(transformServerHotel));
        } else {
          // Fallback to static data
          const trending = ALL_HOTELS.filter(h => h.isTrending).slice(0, limit);
          setHotels(trending);
        }
      } catch (err) {
        console.error('Error fetching trending hotels:', err);
        // Fallback to static data
        const trending = ALL_HOTELS.filter(h => h.isTrending).slice(0, limit);
        setHotels(trending);
        setError(err instanceof Error ? err.message : 'Failed to fetch trending hotels');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingHotels();
  }, [limit]);

  return { hotels, isLoading, error };
}
