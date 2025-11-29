import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// DATA ARRAYS FOR GENERATION
// ============================================

const HOTEL_PREFIXES = [
  'The', 'Grand', 'Royal', 'Imperial', 'Majestic', 'Luxe', 'Elite', 'Premier',
  'Sovereign', 'Noble', 'Regal', 'Opulent', 'Azure', 'Golden', 'Silver', 'Crystal'
];

const HOTEL_NAMES = [
  'Pearl', 'Horizon', 'Oasis', 'Sanctuary', 'Haven', 'Serenity', 'Paradise',
  'Mirage', 'Zenith', 'Summit', 'Vista', 'Cove', 'Bay', 'Reef', 'Lagoon',
  'Garden', 'Terrace', 'Palace', 'Manor', 'Estate', 'Villa', 'Chateau',
  'Retreat', 'Lodge', 'House', 'Tower', 'Residence', 'Pavilion', 'Quarters'
];

const HOTEL_SUFFIXES = [
  'Resort & Spa', 'Collection', 'Suites', 'Hotel', 'Resort', 'Retreat',
  'Residences', 'Palace', 'Lodge', 'Inn', 'Boutique Hotel', 'Beach Club'
];

const COUNTRIES_WITH_COORDS = [
  { name: 'Maldives', lat: 3.2028, lng: 73.2207, locations: ['Male', 'Baa Atoll', 'Ari Atoll', 'North Male'] },
  { name: 'Japan', lat: 35.6762, lng: 139.6503, locations: ['Tokyo', 'Kyoto', 'Osaka', 'Hakone', 'Niseko'] },
  { name: 'France', lat: 48.8566, lng: 2.3522, locations: ['Paris', 'Nice', 'Provence', 'Loire Valley', 'Bordeaux'] },
  { name: 'Italy', lat: 41.9028, lng: 12.4964, locations: ['Rome', 'Florence', 'Venice', 'Amalfi Coast', 'Tuscany', 'Lake Como'] },
  { name: 'Greece', lat: 37.9838, lng: 23.7275, locations: ['Santorini', 'Mykonos', 'Athens', 'Crete', 'Rhodes'] },
  { name: 'Thailand', lat: 13.7563, lng: 100.5018, locations: ['Bangkok', 'Phuket', 'Koh Samui', 'Chiang Mai', 'Krabi'] },
  { name: 'UAE', lat: 25.2048, lng: 55.2708, locations: ['Dubai', 'Abu Dhabi', 'Ras Al Khaimah'] },
  { name: 'USA', lat: 40.7128, lng: -74.006, locations: ['New York', 'Miami', 'Los Angeles', 'Hawaii', 'Aspen', 'Napa Valley'] },
  { name: 'Spain', lat: 40.4168, lng: -3.7038, locations: ['Barcelona', 'Madrid', 'Ibiza', 'Mallorca', 'Marbella'] },
  { name: 'Mexico', lat: 19.4326, lng: -99.1332, locations: ['Cancun', 'Tulum', 'Los Cabos', 'Mexico City', 'Riviera Maya'] },
  { name: 'Indonesia', lat: -8.3405, lng: 115.092, locations: ['Bali', 'Jakarta', 'Lombok', 'Raja Ampat'] },
  { name: 'Australia', lat: -33.8688, lng: 151.2093, locations: ['Sydney', 'Melbourne', 'Gold Coast', 'Great Barrier Reef'] },
  { name: 'Switzerland', lat: 46.8182, lng: 8.2275, locations: ['Zurich', 'Geneva', 'Zermatt', 'St. Moritz', 'Gstaad'] },
  { name: 'Portugal', lat: 38.7223, lng: -9.1393, locations: ['Lisbon', 'Porto', 'Algarve', 'Madeira'] },
  { name: 'Morocco', lat: 31.6295, lng: -7.9811, locations: ['Marrakech', 'Fes', 'Casablanca', 'Essaouira'] },
  { name: 'South Africa', lat: -33.9249, lng: 18.4241, locations: ['Cape Town', 'Johannesburg', 'Kruger Park', 'Garden Route'] },
  { name: 'Seychelles', lat: -4.6796, lng: 55.492, locations: ['Mahe', 'Praslin', 'La Digue'] },
  { name: 'Fiji', lat: -17.7134, lng: 178.065, locations: ['Viti Levu', 'Mamanuca Islands', 'Yasawa Islands'] },
  { name: 'French Polynesia', lat: -17.6797, lng: -149.4068, locations: ['Bora Bora', 'Tahiti', 'Moorea'] },
  { name: 'Costa Rica', lat: 9.7489, lng: -83.7534, locations: ['Monteverde', 'Arenal', 'Manuel Antonio', 'Guanacaste'] },
  { name: 'Scotland', lat: 56.4907, lng: -4.2026, locations: ['Edinburgh', 'Highlands', 'Isle of Skye', 'Gleneagles'] },
  { name: 'Iceland', lat: 64.1466, lng: -21.9426, locations: ['Reykjavik', 'Blue Lagoon', 'Golden Circle'] },
  { name: 'New Zealand', lat: -40.9006, lng: 174.886, locations: ['Queenstown', 'Auckland', 'Rotorua', 'Milford Sound'] },
  { name: 'Canada', lat: 45.4215, lng: -75.6972, locations: ['Vancouver', 'Toronto', 'Whistler', 'Banff', 'Quebec City'] },
  { name: 'Austria', lat: 48.2082, lng: 16.3738, locations: ['Vienna', 'Salzburg', 'Innsbruck', 'Kitzbuhel'] },
  { name: 'Turkey', lat: 41.0082, lng: 28.9784, locations: ['Istanbul', 'Cappadocia', 'Bodrum', 'Antalya'] },
  { name: 'Croatia', lat: 45.815, lng: 15.9819, locations: ['Dubrovnik', 'Split', 'Hvar', 'Zagreb'] },
  { name: 'Vietnam', lat: 21.0285, lng: 105.8542, locations: ['Hanoi', 'Ho Chi Minh', 'Da Nang', 'Hoi An', 'Ha Long Bay'] },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, locations: ['Marina Bay', 'Sentosa', 'Orchard Road'] },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, locations: ['Central', 'Kowloon', 'Lantau Island'] },
];

const CATEGORIES = [
  'Eco-Lodges',
  'Urban Suites',
  'Historic Castles',
  'Overwater Villas',
  'Mountain Retreats',
  'Desert Oasis',
  'Safari Lodges',
  'Ski Chalets',
  'Tropical Resorts',
  'Wellness Sanctuaries',
];

// Mood tags for hotel categorization
const MOOD_TAGS = [
  {
    name: 'romantic',
    label: 'Romantic Escape',
    icon: 'Heart',
    color: 'from-rose-500/20 to-pink-500/20'
  },
  {
    name: 'adventure',
    label: 'Adventure Seeker',
    icon: 'Compass',
    color: 'from-orange-500/20 to-amber-500/20'
  },
  {
    name: 'cultural',
    label: 'Cultural Immersion',
    icon: 'Palette',
    color: 'from-purple-500/20 to-indigo-500/20'
  },
  {
    name: 'wellness',
    label: 'Pure Relaxation',
    icon: 'Leaf',
    color: 'from-emerald-500/20 to-teal-500/20'
  }
];

// Category to mood mapping with weights
const CATEGORY_MOOD_WEIGHTS: Record<string, Record<string, number>> = {
  'Eco-Lodges': { adventure: 0.9, wellness: 0.7, cultural: 0.3 },
  'Urban Suites': { cultural: 0.9, romantic: 0.5, adventure: 0.3 },
  'Historic Castles': { cultural: 0.95, romantic: 0.8, adventure: 0.4 },
  'Overwater Villas': { romantic: 0.95, wellness: 0.8, adventure: 0.4 },
  'Mountain Retreats': { adventure: 0.9, wellness: 0.7, romantic: 0.5 },
  'Desert Oasis': { adventure: 0.8, wellness: 0.7, romantic: 0.6, cultural: 0.5 },
  'Safari Lodges': { adventure: 0.95, cultural: 0.6, romantic: 0.4 },
  'Ski Chalets': { adventure: 0.9, romantic: 0.7, wellness: 0.5 },
  'Tropical Resorts': { romantic: 0.9, wellness: 0.8, adventure: 0.5 },
  'Wellness Sanctuaries': { wellness: 0.95, romantic: 0.6, cultural: 0.3 },
};

const AMENITIES = [
  'Private Pool', 'Butler Service', 'Spa', 'Fitness Center', 'Private Beach',
  'Infinity Pool', 'Rooftop Bar', 'Fine Dining', 'Wine Cellar', 'Private Chef',
  'Helicopter Pad', 'Yacht Charter', 'Golf Course', 'Tennis Courts', 'Cinema Room',
  'Art Gallery', 'Library', 'Meditation Room', 'Yoga Studio', 'Kids Club',
  'Pet Friendly', 'EV Charging', 'Concierge 24/7', 'Room Service', 'Laundry',
  'Business Center', 'Meeting Rooms', 'Ballroom', 'Garden', 'Terrace',
  'Mountain Views', 'Ocean Views', 'City Views', 'Private Jacuzzi', 'Sauna',
  'Steam Room', 'Onsen', 'Glass Floor', 'Underwater Restaurant', 'Sky Lounge'
];

const DESCRIPTIONS = [
  "An architectural masterpiece where contemporary luxury meets timeless elegance. Every detail has been curated to exceed the expectations of the most discerning travelers.",
  "Perched atop dramatic cliffs with panoramic views that stretch to infinity. This sanctuary offers an escape from the ordinary into a realm of pure indulgence.",
  "A hidden gem where nature and luxury coexist in perfect harmony. Wake to birdsong, dine under stars, and let the rhythm of the earth restore your soul.",
  "Step into a world where every wish is anticipated and every moment is crafted for perfection. Our legendary service sets the standard for hospitality excellence.",
  "An oasis of calm in the heart of the city. Sophistication meets serenity in spaces designed for both productivity and profound relaxation.",
  "Where centuries of tradition blend seamlessly with modern comforts. Each suite tells a story, each experience creates a memory.",
  "Suspended between sky and sea, this ethereal retreat offers a perspective on luxury that transcends the conventional.",
  "A celebration of local culture expressed through world-class amenities. Authenticity and excellence are our guiding principles.",
  "Privacy and exclusivity define this remarkable property. Here, luxury is not just seen—it is felt in every carefully considered detail.",
  "An immersive experience that engages all senses. From the scent of fresh flowers to the touch of Egyptian cotton, nothing is left to chance.",
];

const CTA_PHRASES = [
  "Discover Paradise", "Begin Your Journey", "Escape to Elegance", "Embrace Luxury",
  "Find Your Sanctuary", "Awaken Your Senses", "Live Extraordinarily", "Indulge Your Dreams",
  "Experience Excellence", "Redefine Relaxation", "Elevate Every Moment", "Transcend the Ordinary"
];

const REVIEWER_NAMES = [
  'James Anderson', 'Sarah Mitchell', 'Michael Chen', 'Emma Thompson', 'David Kim',
  'Isabella Garcia', 'William Brown', 'Sophia Martinez', 'Alexander Lee', 'Olivia Wilson',
  'Benjamin Taylor', 'Charlotte Davis', 'Ethan Moore', 'Amelia Jackson', 'Lucas White',
  'Mia Harris', 'Henry Martin', 'Ava Thompson', 'Sebastian Clark', 'Harper Lewis',
  'Jack Robinson', 'Evelyn Walker', 'Owen Hall', 'Abigail Young', 'Daniel King',
  'Emily Wright', 'Matthew Scott', 'Elizabeth Green', 'Joseph Baker', 'Victoria Adams',
  'The Johnson Family', 'Mr & Mrs Williams', 'The Rodriguez Family', 'John & Mary',
  'Travel Enthusiast', 'Luxury Seeker', 'Global Explorer', 'Honeymoon Couple'
];

const REVIEW_COMMENTS = [
  "Absolutely extraordinary experience. The attention to detail was impeccable.",
  "We've stayed at luxury hotels worldwide, and this surpasses them all.",
  "The staff anticipated our every need. True five-star service.",
  "An unforgettable anniversary celebration. Worth every penny.",
  "The views alone are worth the visit. Add the incredible service and it's perfection.",
  "Our expectations were high, and they were exceeded at every turn.",
  "A sanctuary of peace and luxury. We didn't want to leave.",
  "The culinary experience was outstanding. Michelin-worthy dining.",
  "Privacy and exclusivity at its finest. Perfect for those seeking true luxury.",
  "The spa treatments were transformative. Left feeling completely renewed.",
  "Impeccable taste in every design element. A feast for the eyes.",
  "The concierge arranged experiences we'll never forget.",
  "World-class amenities with a personal touch. Rare combination.",
  "Every suite is a work of art. Comfort meets sophistication.",
  "The location is unmatched. Waking up to those views was magical.",
];

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

const EMAIL_DOMAINS = [
  'gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com',
  'protonmail.com', 'mail.com', 'aol.com'
];

const COMPANY_NAMES = [
  'Luxury Resorts International', 'Premium Hotels Group', 'Elite Hospitality Co',
  'Grand Suites Management', 'Royal Accommodations Ltd', 'Paradise Hotels Inc',
  'Heritage Properties', 'Boutique Hotel Collection', 'Prestige Lodging Group',
  'Sovereign Resorts', 'Imperial Hospitality', 'Majestic Stays Inc',
  'Azure Properties', 'Golden Gate Hotels', 'Silver Sands Resorts'
];

const HOSPITALITY_POSITIONS = [
  'General Manager', 'Hotel Manager', 'Director of Operations', 'Front Office Manager',
  'Concierge', 'Guest Relations Manager', 'F&B Director', 'Executive Chef',
  'Spa Director', 'Revenue Manager', 'Sales Director', 'Marketing Manager',
  'Event Coordinator', 'Housekeeping Manager', 'Assistant Manager'
];

const MESSAGE_TEMPLATES = [
  "I would like to inquire about availability for an upcoming trip. Could you please provide more information about your services?",
  "We are planning a special celebration and would love to know more about your exclusive packages.",
  "I am interested in learning more about your property for a potential booking next month.",
  "Could you please send me details about your amenities and current offers?",
  "We are considering your establishment for our honeymoon. What special arrangements can you accommodate?",
  "I would appreciate information about your concierge services and local experiences.",
  "Planning a family vacation and would like to know about your family-friendly offerings.",
  "Interested in corporate retreat options. Please share relevant package details.",
  "Looking for a wellness retreat experience. What programs do you offer?",
  "Could you provide details about your dining options and private dining experiences?"
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

function generateHotelName(): string {
  const usePrefix = Math.random() > 0.3;
  const useSuffix = Math.random() > 0.4;

  let name = '';
  if (usePrefix) name += randomFrom(HOTEL_PREFIXES) + ' ';
  name += randomFrom(HOTEL_NAMES);
  if (useSuffix) name += ' ' + randomFrom(HOTEL_SUFFIXES);

  return name;
}

function generateEmail(firstName: string, lastName: string): string {
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}`,
  ];
  return `${randomFrom(formats)}@${randomFrom(EMAIL_DOMAINS)}`;
}

function randomDate(monthsBack: number): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * monthsBack * 30 * 24 * 60 * 60 * 1000);
  return pastDate;
}

function formatReviewDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function generatePhone(): string {
  const formats = [
    `+1 (${randomBetween(200, 999)}) ${randomBetween(200, 999)}-${randomBetween(1000, 9999)}`,
    `+44 ${randomBetween(7000, 7999)} ${randomBetween(100000, 999999)}`,
    `+33 ${randomBetween(6, 7)} ${randomBetween(10, 99)} ${randomBetween(10, 99)} ${randomBetween(10, 99)} ${randomBetween(10, 99)}`,
  ];
  return randomFrom(formats);
}

function pickRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ============================================
// GENERATOR FUNCTIONS
// ============================================

function generateCategories() {
  return CATEGORIES.map((name, index) => ({
    name,
    imageUrl: `https://picsum.photos/600/400?random=${100 + index}`,
    count: randomBetween(15, 150),
  }));
}

function generateDestinations(count: number) {
  const destinations: Array<{
    name: string;
    country: string;
    imageUrl: string;
    temp: number;
    lat: number;
    lng: number;
    description: string;
  }> = [];

  const descriptions = [
    'A paradise of natural beauty and cultural richness.',
    'Where ancient traditions meet modern luxury.',
    'Sun-kissed shores and crystal-clear waters await.',
    'An enchanting destination for the discerning traveler.',
    'Discover the essence of refined elegance.',
    'A destination that captivates heart and soul.',
    'Where every moment becomes a cherished memory.',
    'The perfect blend of adventure and relaxation.',
    'A haven of tranquility and natural splendor.',
    'Experience the extraordinary at every turn.',
  ];

  for (let i = 0; i < count; i++) {
    const country = randomFrom(COUNTRIES_WITH_COORDS);
    const location = randomFrom(country.locations);

    destinations.push({
      name: location,
      country: country.name,
      imageUrl: `https://picsum.photos/800/600?random=${200 + i}`,
      temp: randomBetween(15, 35),
      lat: country.lat + randomFloat(-2, 2, 4),
      lng: country.lng + randomFloat(-2, 2, 4),
      description: randomFrom(descriptions),
    });
  }

  return destinations;
}

function generateHotelsWithReviews(count: number) {
  const hotels: Array<{
    id: string;
    name: string;
    location: string;
    country: string;
    category: string;
    rating: number;
    imageUrl: string;
    isTrending: boolean;
    description: string;
    ctaPhrase: string;
    lat: number;
    lng: number;
    amenities: string[];
    galleryImages: string[];
    reviews: Array<{
      user: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  }> = [];

  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let hotelName = generateHotelName();
    while (usedNames.has(hotelName)) {
      hotelName = generateHotelName();
    }
    usedNames.add(hotelName);

    const country = randomFrom(COUNTRIES_WITH_COORDS);
    const location = randomFrom(country.locations);
    const baseImageId = 300 + i * 5;

    // Generate reviews
    const reviewCount = randomBetween(3, 7);
    const reviews = [];
    for (let j = 0; j < reviewCount; j++) {
      reviews.push({
        user: randomFrom(REVIEWER_NAMES),
        rating: Math.random() > 0.2 ? 5 : 4, // 80% five stars
        comment: randomFrom(REVIEW_COMMENTS),
        date: formatReviewDate(randomDate(12)),
      });
    }

    hotels.push({
      id: `h${i + 1}`,
      name: hotelName,
      location: `${location}, ${country.name}`,
      country: country.name,
      category: randomFrom(CATEGORIES),
      rating: randomFloat(4.5, 5.0, 1),
      imageUrl: `https://picsum.photos/600/400?random=${baseImageId}`,
      isTrending: Math.random() > 0.7, // 30% trending
      description: randomFrom(DESCRIPTIONS),
      ctaPhrase: randomFrom(CTA_PHRASES),
      lat: country.lat + randomFloat(-1, 1, 4),
      lng: country.lng + randomFloat(-1, 1, 4),
      amenities: pickRandomItems(AMENITIES, randomBetween(5, 10)),
      galleryImages: [
        `https://picsum.photos/800/600?random=${baseImageId + 1}`,
        `https://picsum.photos/800/600?random=${baseImageId + 2}`,
        `https://picsum.photos/800/600?random=${baseImageId + 3}`,
        `https://picsum.photos/800/600?random=${baseImageId + 4}`,
      ],
      reviews,
    });
  }

  return hotels;
}

function generateContactSubmissions(count: number) {
  const submissions = [];
  const statuses = ['new', 'read', 'replied', 'archived'];

  for (let i = 0; i < count; i++) {
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);

    submissions.push({
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      phone: Math.random() > 0.3 ? generatePhone() : null,
      message: randomFrom(MESSAGE_TEMPLATES),
      status: randomFrom(statuses),
      createdAt: randomDate(6),
    });
  }

  return submissions;
}

function generateHotelInquiries(count: number, hotelIds: string[], hotelNames: Map<string, string>) {
  const inquiries = [];
  const statuses = ['new', 'contacted', 'booked', 'closed'];

  for (let i = 0; i < count; i++) {
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);
    const hotelId = randomFrom(hotelIds);

    inquiries.push({
      hotelId,
      hotelName: hotelNames.get(hotelId) || 'Unknown Hotel',
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      phone: Math.random() > 0.3 ? generatePhone() : null,
      message: randomFrom(MESSAGE_TEMPLATES),
      status: randomFrom(statuses),
      createdAt: randomDate(6),
    });
  }

  return inquiries;
}

function generatePartnershipApplications(count: number) {
  const applications = [];
  const statuses = ['pending', 'reviewing', 'approved', 'rejected'];

  for (let i = 0; i < count; i++) {
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);

    applications.push({
      firstName,
      lastName,
      email: generateEmail(firstName, lastName),
      phone: Math.random() > 0.2 ? generatePhone() : null,
      companyName: randomFrom(COMPANY_NAMES),
      message: `We are interested in partnering with Natlaupa to feature our properties. ${randomFrom(MESSAGE_TEMPLATES)}`,
      status: randomFrom(statuses),
      createdAt: randomDate(6),
    });
  }

  return applications;
}

function generateAngelApplications(count: number) {
  const applications = [];
  const statuses = ['pending', 'reviewing', 'approved', 'rejected'];
  const yearsOptions = ['0-2', '3-5', '6-10', '10+'];

  for (let i = 0; i < count; i++) {
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);

    applications.push({
      firstName,
      lastName,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      currentPosition: randomFrom(HOSPITALITY_POSITIONS),
      yearsInHospitality: randomFrom(yearsOptions),
      motivation: `I am passionate about luxury hospitality and believe I can contribute to the Natlaupa vision. ${randomFrom(MESSAGE_TEMPLATES)}`,
      status: randomFrom(statuses),
      createdAt: randomDate(6),
    });
  }

  return applications;
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  console.log('Starting mass database seed...\n');
  const startTime = Date.now();

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.hotelMoodTag.deleteMany();
  await prisma.moodTag.deleteMany();
  await prisma.userInteraction.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cookieConsent.deleteMany();
  await prisma.review.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.category.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.hotelInquiry.deleteMany();
  await prisma.partnershipApplication.deleteMany();
  await prisma.angelApplication.deleteMany();
  console.log('Existing data cleared.\n');

  // Seed categories
  console.log('Seeding categories...');
  const categoriesData = generateCategories();
  await prisma.category.createMany({ data: categoriesData });
  console.log(`Created ${categoriesData.length} categories`);

  // Seed destinations
  console.log('Seeding destinations...');
  const destinationsData = generateDestinations(50);
  await prisma.destination.createMany({ data: destinationsData });
  console.log(`Created ${destinationsData.length} destinations`);

  // Seed hotels with reviews
  console.log('Seeding hotels and reviews...');
  const hotelsData = generateHotelsWithReviews(200);
  const hotelIdMap = new Map<string, string>();
  let reviewCount = 0;

  for (const hotel of hotelsData) {
    const { reviews, ...hotelData } = hotel;
    const created = await prisma.hotel.create({
      data: {
        ...hotelData,
        reviews: {
          create: reviews,
        },
      },
    });
    hotelIdMap.set(hotel.id, created.id);
    reviewCount += reviews.length;
  }
  console.log(`Created ${hotelsData.length} hotels with ${reviewCount} reviews`);

  // Seed mood tags
  console.log('Seeding mood tags...');
  const moodTagsCreated = await Promise.all(
    MOOD_TAGS.map(tag =>
      prisma.moodTag.create({ data: tag })
    )
  );
  const moodTagMap = new Map(moodTagsCreated.map(t => [t.name, t.id]));
  console.log(`Created ${moodTagsCreated.length} mood tags`);

  // Get actual hotel IDs for inquiries and mood tag assignments
  const allHotels = await prisma.hotel.findMany({ select: { id: true, name: true, category: true } });
  const hotelIds = allHotels.map(h => h.id);
  const hotelNamesMap = new Map(allHotels.map(h => [h.id, h.name]));

  // Assign mood tags to hotels based on category
  console.log('Assigning mood tags to hotels...');
  let moodTagAssignments = 0;

  for (const hotel of allHotels) {
    const categoryWeights = CATEGORY_MOOD_WEIGHTS[hotel.category] || { romantic: 0.5, adventure: 0.5, cultural: 0.5, wellness: 0.5 };

    for (const [moodName, weight] of Object.entries(categoryWeights)) {
      const moodId = moodTagMap.get(moodName);
      if (moodId && weight > 0) {
        // Add some randomness to weights
        const adjustedWeight = Math.min(1, Math.max(0.1, weight + (Math.random() - 0.5) * 0.2));

        await prisma.hotelMoodTag.create({
          data: {
            hotelId: hotel.id,
            moodId,
            weight: parseFloat(adjustedWeight.toFixed(2))
          }
        });
        moodTagAssignments++;
      }
    }
  }
  console.log(`Created ${moodTagAssignments} hotel mood tag assignments`);

  // Seed contact submissions
  console.log('Seeding contact submissions...');
  const contactsData = generateContactSubmissions(150);
  await prisma.contactSubmission.createMany({ data: contactsData });
  console.log(`Created ${contactsData.length} contact submissions`);

  // Seed hotel inquiries
  console.log('Seeding hotel inquiries...');
  const inquiriesData = generateHotelInquiries(150, hotelIds, hotelNamesMap);
  await prisma.hotelInquiry.createMany({ data: inquiriesData });
  console.log(`Created ${inquiriesData.length} hotel inquiries`);

  // Seed partnership applications
  console.log('Seeding partnership applications...');
  const partnershipsData = generatePartnershipApplications(100);
  await prisma.partnershipApplication.createMany({ data: partnershipsData });
  console.log(`Created ${partnershipsData.length} partnership applications`);

  // Seed angel applications
  console.log('Seeding angel applications...');
  const angelsData = generateAngelApplications(100);
  await prisma.angelApplication.createMany({ data: angelsData });
  console.log(`Created ${angelsData.length} angel applications`);

  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n========================================');
  console.log('Mass seeding completed successfully!');
  console.log('========================================');
  console.log(`Duration: ${duration}s`);
  console.log('\nFinal counts:');
  console.log(`  Categories:    ${await prisma.category.count()}`);
  console.log(`  Destinations:  ${await prisma.destination.count()}`);
  console.log(`  Hotels:        ${await prisma.hotel.count()}`);
  console.log(`  Reviews:       ${await prisma.review.count()}`);
  console.log(`  Mood Tags:     ${await prisma.moodTag.count()}`);
  console.log(`  Hotel Moods:   ${await prisma.hotelMoodTag.count()}`);
  console.log(`  Contacts:      ${await prisma.contactSubmission.count()}`);
  console.log(`  Inquiries:     ${await prisma.hotelInquiry.count()}`);
  console.log(`  Partnerships:  ${await prisma.partnershipApplication.count()}`);
  console.log(`  Angel Apps:    ${await prisma.angelApplication.count()}`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
