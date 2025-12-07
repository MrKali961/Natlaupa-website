/**
 * API Client for connecting to the Natlaupa Server
 * This client handles all communication between the website and the server
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || data.message || 'An error occurred',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status
    );
  }

  return data.data || data;
}

// ============================================================================
// CONTACT MESSAGES
// ============================================================================

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subscribeNewsletter?: boolean;
}

export async function submitContactMessage(data: ContactMessageInput) {
  const response = await fetch(`${API_URL}/contact-messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// ============================================================================
// NEWSLETTER
// ============================================================================

export interface NewsletterSubscribeInput {
  email: string;
  firstName?: string;
  lastName?: string;
}

export async function subscribeNewsletter(data: NewsletterSubscribeInput) {
  const response = await fetch(`${API_URL}/newsletters/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// ============================================================================
// ANGEL APPLICATIONS
// ============================================================================

export interface AngelApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPosition: string;
  yearsInHospitality: string;
  motivation: string;
}

export async function submitAngelApplication(data: AngelApplicationInput) {
  const response = await fetch(`${API_URL}/angel-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// ============================================================================
// PARTNERSHIP APPLICATIONS
// ============================================================================

export interface PartnershipApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName: string;
  message: string;
}

export async function submitPartnershipApplication(data: PartnershipApplicationInput) {
  const response = await fetch(`${API_URL}/partnership-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// ============================================================================
// HOTEL INQUIRIES
// ============================================================================

export interface HotelInquiryInput {
  hotelId: string;
  hotelName: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function submitHotelInquiry(data: HotelInquiryInput) {
  const response = await fetch(`${API_URL}/hotel-inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// ============================================================================
// HOTELS
// ============================================================================

export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  category: string;
  rating: number;
  imageUrl: string;
  description: string;
  ctaPhrase?: string;
  amenities: string[];
  galleryImages: string[];
  isTrending: boolean;
  lat?: number;
  lng?: number;
  destination?: {
    id: string;
    name: string;
    country: string;
  };
  style?: {
    id: string;
    name: string;
  };
  reviews?: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface HotelsFilter {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  category?: string;
  style?: string;
  destination?: string;
  isTrending?: boolean;
  minRating?: number;
}

export async function getHotels(filters?: HotelsFilter): Promise<{ items: Hotel[]; total: number; page: number; limit: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const response = await fetch(`${API_URL}/hotels?${params.toString()}`);
  return handleResponse(response);
}

export async function getHotelById(id: string): Promise<Hotel> {
  const response = await fetch(`${API_URL}/hotels/${id}`);
  return handleResponse(response);
}

export async function getTrendingHotels(limit: number = 6): Promise<Hotel[]> {
  const response = await fetch(`${API_URL}/hotels/trending?limit=${limit}`);
  return handleResponse(response);
}

export async function getHotelsByCountry(country: string): Promise<Hotel[]> {
  const response = await fetch(`${API_URL}/hotels?country=${encodeURIComponent(country)}`);
  const data = await handleResponse<{ items: Hotel[] }>(response);
  return data.items || [];
}

export async function getHotelsByCategory(category: string): Promise<Hotel[]> {
  const response = await fetch(`${API_URL}/hotels?category=${encodeURIComponent(category)}`);
  const data = await handleResponse<{ items: Hotel[] }>(response);
  return data.items || [];
}

export async function getCountriesWithHotels(): Promise<{ country: string; count: number }[]> {
  const response = await fetch(`${API_URL}/hotels/countries`);
  return handleResponse(response);
}

// ============================================================================
// DESTINATIONS
// ============================================================================

export interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  description?: string;
  lat?: number;
  lng?: number;
  temp?: number;
}

export async function getDestinations(): Promise<Destination[]> {
  const response = await fetch(`${API_URL}/destinations`);
  const data = await handleResponse<{ items: Destination[] }>(response);
  return data.items || data;
}

export async function getDestinationBySlug(slug: string): Promise<Destination> {
  const response = await fetch(`${API_URL}/destinations/${slug}`);
  return handleResponse(response);
}

// ============================================================================
// STYLES (Categories)
// ============================================================================

export interface Style {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  hotelCount?: number;
}

export async function getStyles(): Promise<Style[]> {
  const response = await fetch(`${API_URL}/styles`);
  const data = await handleResponse<{ items: Style[] }>(response);
  return data.items || data;
}

export async function getStyleBySlug(slug: string): Promise<Style> {
  const response = await fetch(`${API_URL}/styles/${slug}`);
  return handleResponse(response);
}

// ============================================================================
// OFFERS (Special Promotions)
// ============================================================================

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  validFrom: string;
  validUntil: string;
  terms?: string;
  hotel: Hotel;
  isActive: boolean;
}

export async function getOffers(filters?: { isActive?: boolean; hotelId?: string }): Promise<Offer[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }

  const response = await fetch(`${API_URL}/offers?${params.toString()}`);
  const data = await handleResponse<{ items: Offer[] }>(response);
  return data.items || data;
}

export async function getOfferById(id: string): Promise<Offer> {
  const response = await fetch(`${API_URL}/offers/${id}`);
  return handleResponse(response);
}

// ============================================================================
// COOKIE CONSENT
// ============================================================================

export interface ConsentPreferences {
  sessionId: string;
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
}

export async function saveConsentPreferences(data: ConsentPreferences) {
  const response = await fetch(`${API_URL}/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function getConsentPreferences(sessionId: string): Promise<ConsentPreferences | null> {
  try {
    const response = await fetch(`${API_URL}/consent?sessionId=${sessionId}`);
    return handleResponse(response);
  } catch {
    return null;
  }
}

// ============================================================================
// USER TRACKING
// ============================================================================

export interface TrackingEvent {
  sessionId: string;
  action: 'view' | 'click' | 'inquiry' | 'bookmark' | 'mood_select';
  hotelId?: string;
  moodContext?: string;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(data: TrackingEvent) {
  const response = await fetch(`${API_URL}/tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// Export ApiError for error handling
export { ApiError };
