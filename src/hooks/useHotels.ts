'use client';

import { useState, useEffect, useCallback } from 'react';
import { Hotel, Category } from '@/types';

interface HotelsFilter {
  search?: string;
  country?: string;
  destinationId?: string;
  category?: string;
  styleId?: string;
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
  const style = serverHotel.style as { name?: string } | null;
  const destination = serverHotel.destination as { name?: string; country?: string } | null;
  const images = serverHotel.images as { url: string; isPrimary?: boolean }[] | undefined;

  return {
    id: serverHotel.id as string,
    name: serverHotel.name as string,
    slug: serverHotel.slug as string,
    location: serverHotel.city as string || serverHotel.address as string || '',
    country: serverHotel.country as string || destination?.country || '',
    rating: serverHotel.starRating as number || 5,
    imageUrl: serverHotel.thumbnailImage as string || images?.find(img => img.isPrimary)?.url || images?.[0]?.url || 'https://picsum.photos/600/400',
    category: style?.name || 'Luxury',
    isTrending: serverHotel.isFeatured as boolean || false,
    lat: serverHotel.latitude as number,
    lng: serverHotel.longitude as number,
    amenities: (serverHotel.amenities as string[]) || [],
    description: serverHotel.description as string || serverHotel.shortDescription as string || '',
    ctaPhrase: serverHotel.ctaPhrase as string,
    galleryImages: images?.map(img => img.url) || [],
    reviews: (serverHotel.reviews as Hotel['reviews']) || [],
  };
}

export function useHotels(filters?: HotelsFilter): UseHotelsResult {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch hotels, categories, and countries in parallel
      const [hotelsResponse, stylesResponse, countriesResponse] = await Promise.all([
        // Fetch hotels
        (async () => {
          const params = new URLSearchParams();
          if (filters?.search) params.append('search', filters.search);
          if (filters?.country) params.append('country', filters.country);
          if (filters?.destinationId) params.append('destinationId', filters.destinationId);
          if (filters?.category) params.append('category', filters.category);
          if (filters?.styleId) params.append('styleId', filters.styleId);
          if (filters?.isTrending !== undefined) params.append('isTrending', String(filters.isTrending));
          if (filters?.limit) params.append('limit', String(filters.limit));
          if (filters?.page) params.append('page', String(filters.page));
          return fetch(`/api/hotels?${params.toString()}`);
        })(),
        // Fetch styles/categories
        fetch('/api/styles'),
        // Fetch countries
        fetch('/api/hotels/countries'),
      ]);

      // Process hotels
      const hotelsData = await hotelsResponse.json();
      if (hotelsResponse.ok && hotelsData.data) {
        // Handle both response formats: { data: { items: [...] } } or { data: { hotels: [...] } }
        const hotelsList = hotelsData.data.items || hotelsData.data.hotels || [];
        const transformedHotels = hotelsList.map(transformServerHotel);
        setHotels(transformedHotels);
        // Handle both total and pagination.total
        setTotal(hotelsData.data.total || hotelsData.data.pagination?.total || transformedHotels.length);
      } else {
        setHotels([]);
        setTotal(0);
        setError(hotelsData.error?.message || 'Failed to fetch hotels');
      }

      // Process categories
      const stylesData = await stylesResponse.json();
      if (stylesResponse.ok && stylesData.data?.items) {
        setCategories(stylesData.data.items.map((style: { id: string; name: string; imageUrl?: string; hotelCount?: number }) => ({
          id: style.id,
          name: style.name,
          imageUrl: style.imageUrl || 'https://picsum.photos/600/400',
          count: style.hotelCount || 0,
        })));
      } else {
        setCategories([]);
      }

      // Process countries
      const countriesData = await countriesResponse.json();
      if (countriesResponse.ok) {
        // Handle both response formats: { data: [...] } or direct array
        const countriesArray = Array.isArray(countriesData.data)
          ? countriesData.data
          : Array.isArray(countriesData)
          ? countriesData
          : [];

        setCountries(countriesArray.map((c: { country: string }) => c.country));
      } else {
        setCountries([]);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setHotels([]);
      setCategories([]);
      setCountries([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.country, filters?.destinationId, filters?.category, filters?.styleId, filters?.isTrending, filters?.limit, filters?.page]);

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
          setHotel(null);
          setError(data.error?.message || 'Hotel not found');
        }
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setHotel(null);
        setError(err instanceof Error ? err.message : 'Failed to fetch hotel');
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

        if (response.ok && data.data) {
          setHotels(data.data.map(transformServerHotel));
        } else {
          setHotels([]);
          setError(data.error?.message || 'Failed to fetch trending hotels');
        }
      } catch (err) {
        console.error('Error fetching trending hotels:', err);
        setHotels([]);
        setError(err instanceof Error ? err.message : 'Failed to fetch trending hotels');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingHotels();
  }, [limit]);

  return { hotels, isLoading, error };
}
