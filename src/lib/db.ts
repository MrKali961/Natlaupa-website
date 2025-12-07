import { PrismaClient } from '@prisma/client';
import { isCuid } from './slugify';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ============================================
// CONTACT FORM SUBMISSION FUNCTIONS
// ============================================

// General contact form
export async function createContactSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return prisma.contactSubmission.create({
    data,
  });
}

// Hotel/Concierge inquiry (from offer pages)
export async function createHotelInquiry(data: {
  hotelId: string;
  hotelName: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return prisma.hotelInquiry.create({
    data,
  });
}

// Partnership application (from /for-hotels)
export async function createPartnershipApplication(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName: string;
  message: string;
}) {
  return prisma.partnershipApplication.create({
    data,
  });
}

// Angel application (from /become-angel)
export async function createAngelApplication(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPosition: string;
  yearsInHospitality: string;
  motivation: string;
}) {
  return prisma.angelApplication.create({
    data,
  });
}

// ============================================
// HOTEL DATA FUNCTIONS (for future use)
// ============================================

export async function getAllHotels() {
  return prisma.hotel.findMany({
    include: { reviews: true },
    orderBy: { rating: 'desc' },
  });
}

export async function getHotelById(id: string) {
  return prisma.hotel.findUnique({
    where: { id },
    include: { reviews: true },
  });
}

/**
 * Get hotel by ID or slug
 * Supports both legacy ID-based URLs and new slug-based URLs
 */
export async function getHotelByIdOrSlug(idOrSlug: string) {
  const isId = isCuid(idOrSlug);

  return prisma.hotel.findUnique({
    where: isId ? { id: idOrSlug } : { slug: idOrSlug },
    include: { reviews: true },
  });
}

export async function getTrendingHotels() {
  return prisma.hotel.findMany({
    where: { isTrending: true },
    include: { reviews: true },
    orderBy: { rating: 'desc' },
  });
}

export async function getHotelsByCountry(country: string) {
  return prisma.hotel.findMany({
    where: { country },
    include: { reviews: true },
    orderBy: { rating: 'desc' },
  });
}

export async function getHotelsByCategory(category: string) {
  return prisma.hotel.findMany({
    where: { category },
    include: { reviews: true },
    orderBy: { rating: 'desc' },
  });
}

export async function getAllDestinations() {
  return prisma.destination.findMany();
}

export async function getAllCategories() {
  return prisma.category.findMany();
}

// ============================================
// OFFER DATA FUNCTIONS
// ============================================

// Get offer by ID with hotel and activities
export async function getOfferById(id: string) {
  return prisma.offer.findUnique({
    where: { id },
    include: {
      hotel: {
        include: {
          reviews: true,
        },
      },
      activities: true,
      reviews: true,
    },
  });
}

/**
 * Get offer by ID or slug
 * Supports both legacy ID-based URLs and new slug-based URLs
 */
export async function getOfferByIdOrSlug(idOrSlug: string) {
  const isId = isCuid(idOrSlug);

  return prisma.offer.findUnique({
    where: isId ? { id: idOrSlug } : { slug: idOrSlug },
    include: {
      hotel: {
        include: {
          reviews: true,
        },
      },
      activities: true,
      reviews: true,
    },
  });
}

// Get all offers
export async function getAllOffers() {
  return prisma.offer.findMany({
    include: {
      hotel: true,
      activities: { take: 3 },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get trending offers
export async function getTrendingOffers(limit = 10) {
  return prisma.offer.findMany({
    where: { isTrending: true },
    include: {
      hotel: true,
      activities: { take: 3 },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

// Get featured offers
export async function getFeaturedOffers(limit = 10) {
  return prisma.offer.findMany({
    where: { isFeatured: true },
    include: {
      hotel: true,
      activities: { take: 3 },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

// Get offers by experience type
export async function getOffersByExperienceType(experienceType: string, limit = 10) {
  return prisma.offer.findMany({
    where: {
      experienceType: {
        equals: experienceType,
        mode: 'insensitive',
      },
    },
    include: {
      hotel: true,
      activities: { take: 3 },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}
