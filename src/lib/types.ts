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
  /**
   * Stored slug of the hotel style behind `category`.
   *
   * `category` is the style's display name, which is not a URL. Slugifying it guesses
   * wrong whenever the name contains punctuation the DB slug drops — 'Wellness &
   * Rejuvenation' has slug 'wellness-rejuvenation', so a name-derived
   * '/styles/wellness-&-rejuvenation' 404s. Link off this field or not at all.
   */
  categorySlug?: string;
  isTrending: boolean;
  description?: string;
  ctaPhrase?: string;
  galleryImages?: string[];
  reviews?: Review[];
  lat?: number;
  lng?: number;
  amenities?: string[];
  /**
   * Publication state from the admin API.
   *
   * Needed on this type because `/hotels/slug/:slug` serves deactivated hotels exactly
   * like live ones — only the `/hotels` listing filters them. Without it, the detail
   * route cannot tell retired inventory apart and renders it at HTTP 200 with
   * `index, follow`.
   */
  isActive?: boolean;
  deletedAt?: string | null;
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

export interface BlogTag {
  id: string;
  name: string;
  blogId: string;
  createdAt: Date;
}

export interface BlogAuthor {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  author: BlogAuthor;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  viewCount: number;
  tags: BlogTag[];
  createdAt: Date;
  updatedAt: Date;
}
