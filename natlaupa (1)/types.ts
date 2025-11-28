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
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  category: string;
  isTrending: boolean;
  description?: string;
  ctaPhrase?: string;
  galleryImages?: string[];
  reviews?: Review[];
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