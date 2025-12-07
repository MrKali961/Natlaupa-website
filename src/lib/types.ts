export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Hotel {
  id: string;
  name: string;
  slug?: string;
  location: string;
  country: string;
  rating: number;
  imageUrl: string;
  category: string;
  isTrending: boolean;
  description?: string;
  ctaPhrase?: string;
  galleryImages?: string[];
  reviews?: Review[];
  lat?: number;
  lng?: number;
  amenities?: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  temp: number;
  lat?: number;
  lng?: number;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  count: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  imageUrl?: string;
  category: string;
}

export interface OfferReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Offer {
  id: string;
  title: string;
  slug?: string;
  tagline?: string;
  description: string;
  duration: number;
  imageUrl: string;
  galleryImages: string[];
  hotel: Hotel;
  hotelId: string;
  activities: Activity[];
  experienceType: string;
  isTrending: boolean;
  isFeatured: boolean;
  reviews?: OfferReview[];
  createdAt?: Date;
  updatedAt?: Date;
}