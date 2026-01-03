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
  city: string;
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

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
}