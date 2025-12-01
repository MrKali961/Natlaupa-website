import { Hotel, Destination, Category } from '@/types';

// Map destinations for the About page interactive globe
export interface MapDestination {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
  story: string;
}

export const MAP_DESTINATIONS: MapDestination[] = [
  { id: 1, name: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615, story: 'Where whitewashed villas meet endless azure horizons.' },
  { id: 2, name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, story: 'Ancient temples whisper stories of timeless elegance.' },
  { id: 3, name: 'Maldives', country: 'Indian Ocean', lat: 3.2028, lng: 73.2207, story: 'Overwater sanctuaries floating on crystalline dreams.' },
  { id: 4, name: 'Tuscany', country: 'Italy', lat: 43.7696, lng: 11.2558, story: 'Rolling vineyards and Renaissance grandeur intertwined.' },
  { id: 5, name: 'Bora Bora', country: 'French Polynesia', lat: -16.5004, lng: -151.7415, story: 'Paradise perfected in turquoise lagoons.' },
  { id: 6, name: 'Swiss Alps', country: 'Switzerland', lat: 46.8182, lng: 8.2275, story: 'Majestic peaks where luxury meets adventure.' },
  { id: 7, name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811, story: 'Exotic riads hidden within ancient medina walls.' },
  { id: 8, name: 'Patagonia', country: 'Argentina', lat: -50.0, lng: -72.0, story: 'Untamed wilderness at the edge of the world.' },
  { id: 9, name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, story: 'Where fire and ice create otherworldly beauty.' },
  { id: 10, name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, story: 'Where mountains embrace the meeting of two oceans.' },
];

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const FOOTER_LINKS = {
  explore: [
    { name: 'All Offers', path: '/offers' },
    { name: 'Countries', path: '/countries' },
    { name: 'Styles', path: '/styles' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ],
  programs: [
    { name: 'For Hotels', path: '/for-hotels' },
    { name: 'Become an Angel', path: '/become-angel' },
  ],
};

export const DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Kyoto',
    country: 'Japan',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    temp: 18,
    lat: 35.0116,
    lng: 135.7681,
    description: 'Ancient temples and sublime gardens.',
  },
  {
    id: '2',
    name: 'Santorini',
    country: 'Greece',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    temp: 24,
    lat: 36.3932,
    lng: 25.4615,
    description: 'White-washed cliffs and azure waters.',
  },
  {
    id: '3',
    name: 'New York',
    country: 'USA',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    temp: 15,
    lat: 40.7128,
    lng: -74.0060,
    description: 'The city that never sleeps.',
  },
  {
    id: '4',
    name: 'Reykjavik',
    country: 'Iceland',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    temp: 5,
    lat: 64.1466,
    lng: -21.9426,
    description: 'Land of fire and ice.',
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat1',
    name: 'Eco-Lodges',
    imageUrl: 'https://picsum.photos/600/400?random=10',
    count: 45,
  },
  {
    id: 'cat2',
    name: 'Urban Suites',
    imageUrl: 'https://picsum.photos/600/400?random=11',
    count: 120,
  },
  {
    id: 'cat3',
    name: 'Historic Castles',
    imageUrl: 'https://picsum.photos/600/400?random=12',
    count: 18,
  },
  {
    id: 'cat4',
    name: 'Overwater Villas',
    imageUrl: 'https://picsum.photos/600/400?random=13',
    count: 32,
  },
];

export const ALL_HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'The Azure Pearl',
    location: 'Maldives',
    country: 'Maldives',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/600/400?random=20',
    category: 'Overwater Villas',
    isTrending: true,
    lat: 3.2028,
    lng: 73.2207,
    amenities: ['Private Pool', 'Butler Service', 'Glass Floor', 'Spa', 'Water Sports'],
    description: "Suspended above the turquoise abyss, The Azure Pearl offers an isolation so profound it feels otherworldly. Glass floors, private infinity pools, and a dedicated butler ensure your reality is suspended the moment you arrive.",
    ctaPhrase: "Indulge in the Infinite",
    galleryImages: [
        'https://picsum.photos/800/600?random=101',
        'https://picsum.photos/800/600?random=102',
        'https://picsum.photos/800/600?random=103',
        'https://picsum.photos/800/600?random=104'
    ],
    reviews: [
      {
        id: 'r1',
        user: 'James Ellington',
        rating: 5,
        comment: 'An absolute masterpiece of hospitality. The isolation is the luxury.',
        date: 'Oct 2024'
      },
      {
        id: 'r2',
        user: 'Sarah & Tom',
        rating: 5,
        comment: 'We have never experienced water this clear or service this intuitive.',
        date: 'Sep 2024'
      },
      {
        id: 'r3',
        user: 'Elena V.',
        rating: 4,
        comment: 'Stunning, though the seaplane transfer was a bit choppy.',
        date: 'Aug 2024'
      }
    ]
  },
  {
    id: 'h2',
    name: 'Highland Retreat',
    location: 'Edinburgh, Scotland',
    country: 'Scotland',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/600/400?random=21',
    category: 'Historic Castles',
    isTrending: true,
    lat: 55.9533,
    lng: -3.1883,
    amenities: ['Whisky Library', 'Fireplace', 'Private Gardens', 'Hunting Lodge', 'Spa'],
    description: "Walk the halls of history in a restored 15th-century fortress. Roaring fireplaces, bespoke whisky tastings, and misty moorland views create an atmosphere of aristocratic seclusion. A stay here is a legacy reclaimed.",
    ctaPhrase: "Claim Your Castle",
    galleryImages: [
        'https://picsum.photos/800/600?random=105',
        'https://picsum.photos/800/600?random=106',
        'https://picsum.photos/800/600?random=107',
        'https://picsum.photos/800/600?random=108'
    ],
    reviews: [
      {
        id: 'r4',
        user: 'Lord H. Caldwell',
        rating: 5,
        comment: 'The whisky library alone is worth the journey. Truly regal.',
        date: 'Nov 2024'
      },
      {
        id: 'r5',
        user: 'Martha S.',
        rating: 5,
        comment: 'Felt like stepping into a novel. The staff treated us like royalty.',
        date: 'Oct 2024'
      }
    ]
  },
  {
    id: 'h3',
    name: 'Neon Sky Loft',
    location: 'Shinjuku, Tokyo',
    country: 'Japan',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/600/400?random=22',
    category: 'Urban Suites',
    isTrending: true,
    lat: 35.6894,
    lng: 139.6917,
    amenities: ['Smart Home', 'Omakase Dining', 'City Views', 'Concierge', 'Gym'],
    description: "Hovering fifty stories above the electric pulse of Shinjuku, this loft is a sanctuary of minimalist design and maximum impact. Floor-to-ceiling smart glass and private omakase dining bring the city to you, on your terms.",
    ctaPhrase: "Own the Skyline",
    galleryImages: [
        'https://picsum.photos/800/600?random=109',
        'https://picsum.photos/800/600?random=110',
        'https://picsum.photos/800/600?random=111',
        'https://picsum.photos/800/600?random=112'
    ],
    reviews: [
      {
        id: 'r6',
        user: 'Kenji T.',
        rating: 5,
        comment: 'The view of Shibuya crossing at night is mesmerizing. Perfect design.',
        date: 'Dec 2024'
      },
      {
        id: 'r7',
        user: 'Alice W.',
        rating: 4,
        comment: 'High tech everywhere. A bit complex to use the lights, but stunning.',
        date: 'Nov 2024'
      }
    ]
  },
  {
    id: 'h4',
    name: 'Santorini Cliffside',
    location: 'Oia, Santorini',
    country: 'Greece',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/600/400?random=23',
    category: 'Overwater Villas',
    isTrending: false,
    lat: 36.4618,
    lng: 25.3753,
    amenities: ['Infinity Pool', 'Caldera Views', 'Wine Cellar', 'Private Terrace', 'Spa'],
    description: "Perched on the volcanic cliffs of Oia, this whitewashed sanctuary offers panoramic views of the Aegean Sea and legendary sunsets. Each suite is a private world of Cycladic elegance, where time dissolves into the horizon.",
    ctaPhrase: "Embrace the Aegean",
    galleryImages: [
        'https://picsum.photos/800/600?random=113',
        'https://picsum.photos/800/600?random=114',
        'https://picsum.photos/800/600?random=115',
        'https://picsum.photos/800/600?random=116'
    ],
    reviews: [
      {
        id: 'r8',
        user: 'Christina M.',
        rating: 5,
        comment: 'The sunset from our private terrace was the most beautiful I have ever seen.',
        date: 'Sep 2024'
      },
      {
        id: 'r9',
        user: 'Antonio B.',
        rating: 5,
        comment: 'Perfect honeymoon destination. The staff made everything magical.',
        date: 'Aug 2024'
      }
    ]
  },
  {
    id: 'h5',
    name: 'The Zen Garden',
    location: 'Kyoto, Japan',
    country: 'Japan',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/600/400?random=24',
    category: 'Eco-Lodges',
    isTrending: true,
    lat: 35.0116,
    lng: 135.7681,
    amenities: ['Private Garden', 'Tea Ceremony', 'Onsen', 'Meditation Room', 'Kaiseki Dining'],
    description: "A traditional ryokan reimagined for the discerning traveler. Tatami rooms open onto private moss gardens, while the scent of cedar and the sound of flowing water create an atmosphere of profound tranquility.",
    ctaPhrase: "Find Your Center",
    galleryImages: [
        'https://picsum.photos/800/600?random=117',
        'https://picsum.photos/800/600?random=118',
        'https://picsum.photos/800/600?random=119',
        'https://picsum.photos/800/600?random=120'
    ],
    reviews: [
      {
        id: 'r10',
        user: 'David L.',
        rating: 5,
        comment: 'The most peaceful place I have ever stayed. Changed my perspective on luxury.',
        date: 'Oct 2024'
      },
      {
        id: 'r11',
        user: 'Yuki S.',
        rating: 5,
        comment: 'Authentic and refined. The kaiseki dinner was a spiritual experience.',
        date: 'Sep 2024'
      }
    ]
  },
  {
    id: 'h6',
    name: 'Manhattan Penthouse',
    location: 'Manhattan, New York',
    country: 'USA',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/600/400?random=25',
    category: 'Urban Suites',
    isTrending: false,
    lat: 40.7580,
    lng: -73.9855,
    amenities: ['Rooftop Terrace', 'Private Chef', 'Art Collection', 'Car Service', '24/7 Concierge'],
    description: "Commanding views of Central Park from a 60th-floor penthouse. This is New York at its most opulent: art-filled interiors, a private chef, and access to the city's most exclusive experiences.",
    ctaPhrase: "Rule the City",
    galleryImages: [
        'https://picsum.photos/800/600?random=121',
        'https://picsum.photos/800/600?random=122',
        'https://picsum.photos/800/600?random=123',
        'https://picsum.photos/800/600?random=124'
    ],
    reviews: [
      {
        id: 'r12',
        user: 'Michael R.',
        rating: 5,
        comment: 'The art collection alone is museum-worthy. Impeccable taste throughout.',
        date: 'Nov 2024'
      },
      {
        id: 'r13',
        user: 'Lisa C.',
        rating: 4,
        comment: 'Everything was perfect except for the street noise at night.',
        date: 'Oct 2024'
      }
    ]
  },
  {
    id: 'h7',
    name: 'Aurora Borealis Lodge',
    location: 'Reykjavik, Iceland',
    country: 'Iceland',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/600/400?random=26',
    category: 'Eco-Lodges',
    isTrending: true,
    lat: 64.1466,
    lng: -21.9426,
    amenities: ['Glass Roof', 'Geothermal Pool', 'Northern Lights Wake-up', 'Arctic Adventures', 'Spa'],
    description: "Sleep beneath the dancing lights in a glass-roofed cabin. By day, explore glaciers and geysers; by night, sink into geothermal waters and watch the aurora paint the sky.",
    ctaPhrase: "Chase the Lights",
    galleryImages: [
        'https://picsum.photos/800/600?random=125',
        'https://picsum.photos/800/600?random=126',
        'https://picsum.photos/800/600?random=127',
        'https://picsum.photos/800/600?random=128'
    ],
    reviews: [
      {
        id: 'r14',
        user: 'Emma N.',
        rating: 5,
        comment: 'Waking up to the northern lights dancing above was surreal. Bucket list achieved.',
        date: 'Jan 2024'
      },
      {
        id: 'r15',
        user: 'Thomas K.',
        rating: 5,
        comment: 'The geothermal pool under the stars is pure magic.',
        date: 'Feb 2024'
      }
    ]
  },
  {
    id: 'h8',
    name: 'Château de la Loire',
    location: 'Loire Valley, France',
    country: 'France',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/600/400?random=27',
    category: 'Historic Castles',
    isTrending: false,
    lat: 47.4133,
    lng: 0.9894,
    amenities: ['Wine Tasting', 'Private Chapel', 'Formal Gardens', 'Michelin Dining', 'Horse Riding'],
    description: "A Renaissance château transformed into an intimate retreat. Wander through formal gardens, dine by candlelight in centuries-old halls, and awaken to vineyard views that have inspired artists for generations.",
    ctaPhrase: "Live Like Royalty",
    galleryImages: [
        'https://picsum.photos/800/600?random=129',
        'https://picsum.photos/800/600?random=130',
        'https://picsum.photos/800/600?random=131',
        'https://picsum.photos/800/600?random=132'
    ],
    reviews: [
      {
        id: 'r16',
        user: 'Pierre D.',
        rating: 5,
        comment: 'The wine cellar dates back to the 1600s. Extraordinary experience.',
        date: 'Jul 2024'
      },
      {
        id: 'r17',
        user: 'Margaret W.',
        rating: 4,
        comment: 'Beautiful but the rooms could use some modernization.',
        date: 'Jun 2024'
      }
    ]
  },
  {
    id: 'h9',
    name: 'The Desert Mirage',
    location: 'Dubai, UAE',
    country: 'UAE',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/600/400?random=28',
    category: 'Urban Suites',
    isTrending: false,
    lat: 25.2048,
    lng: 55.2708,
    amenities: ['Private Beach', 'Desert Safari', 'Gold Butler', 'Helicopter Tours', 'Infinity Pool'],
    description: "Where the desert meets the sea in the world's most ambitious city. A private beach, helicopter transfers, and a dedicated gold-class butler ensure every moment exceeds imagination.",
    ctaPhrase: "Beyond Opulence",
    galleryImages: [
        'https://picsum.photos/800/600?random=133',
        'https://picsum.photos/800/600?random=134',
        'https://picsum.photos/800/600?random=135',
        'https://picsum.photos/800/600?random=136'
    ],
    reviews: [
      {
        id: 'r18',
        user: 'Sheikh A.',
        rating: 5,
        comment: 'This is what true Arabian hospitality looks like. Unmatched.',
        date: 'Dec 2024'
      },
      {
        id: 'r19',
        user: 'Victoria S.',
        rating: 4,
        comment: 'Incredible luxury but a bit overwhelming. Perfect for special occasions.',
        date: 'Nov 2024'
      }
    ]
  },
  {
    id: 'h10',
    name: 'Costa Rica Treehouse',
    location: 'Monteverde, Costa Rica',
    country: 'Costa Rica',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/600/400?random=29',
    category: 'Eco-Lodges',
    isTrending: false,
    lat: 10.3157,
    lng: -84.8248,
    amenities: ['Canopy Walkway', 'Wildlife Tours', 'Organic Dining', 'Yoga Deck', 'Waterfall Access'],
    description: "Nestled in the cloud forest canopy, this sustainable treehouse offers an immersive connection with nature. Wake to howler monkeys, dine on organic local cuisine, and fall asleep to the symphony of the jungle.",
    ctaPhrase: "Return to Nature",
    galleryImages: [
        'https://picsum.photos/800/600?random=137',
        'https://picsum.photos/800/600?random=138',
        'https://picsum.photos/800/600?random=139',
        'https://picsum.photos/800/600?random=140'
    ],
    reviews: [
      {
        id: 'r20',
        user: 'Carlos M.',
        rating: 5,
        comment: 'The most authentic eco-lodge experience. Sustainability done right.',
        date: 'Oct 2024'
      },
      {
        id: 'r21',
        user: 'Jennifer L.',
        rating: 5,
        comment: 'Saw three toucans and a sloth from my balcony. Incredible.',
        date: 'Sep 2024'
      }
    ]
  },
  {
    id: 'h11',
    name: 'Bora Bora Dream',
    location: 'Bora Bora, French Polynesia',
    country: 'French Polynesia',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/600/400?random=30',
    category: 'Overwater Villas',
    isTrending: true,
    lat: -16.5004,
    lng: -151.7415,
    amenities: ['Glass Bottom Floor', 'Private Lagoon', 'Polynesian Spa', 'Outrigger Canoe', 'Sunset Cruise'],
    description: "The quintessential overwater experience in the world's most photographed lagoon. Mount Otemanu rises majestically as you glide between your villa and the coral gardens below.",
    ctaPhrase: "Paradise Found",
    galleryImages: [
        'https://picsum.photos/800/600?random=141',
        'https://picsum.photos/800/600?random=142',
        'https://picsum.photos/800/600?random=143',
        'https://picsum.photos/800/600?random=144'
    ],
    reviews: [
      {
        id: 'r22',
        user: 'Amanda & Chris',
        rating: 5,
        comment: 'Our 10th anniversary trip exceeded every expectation. Pure paradise.',
        date: 'Jul 2024'
      },
      {
        id: 'r23',
        user: 'Robert F.',
        rating: 5,
        comment: 'The coral gardens beneath the villa are like a private aquarium.',
        date: 'Aug 2024'
      }
    ]
  },
  {
    id: 'h12',
    name: 'Tuscan Villa Estate',
    location: 'Tuscany, Italy',
    country: 'Italy',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/600/400?random=31',
    category: 'Historic Castles',
    isTrending: false,
    lat: 43.7696,
    lng: 11.2558,
    amenities: ['Olive Grove', 'Cooking Classes', 'Wine Cellar', 'Pool', 'Art Studio'],
    description: "A 16th-century villa surrounded by rolling hills, cypress trees, and olive groves. Learn the art of Tuscan cuisine, explore ancient cellars, and savor the slow pace of Italian countryside living.",
    ctaPhrase: "Taste La Dolce Vita",
    galleryImages: [
        'https://picsum.photos/800/600?random=145',
        'https://picsum.photos/800/600?random=146',
        'https://picsum.photos/800/600?random=147',
        'https://picsum.photos/800/600?random=148'
    ],
    reviews: [
      {
        id: 'r24',
        user: 'Giovanni P.',
        rating: 5,
        comment: 'The cooking class with Nonna Maria was the highlight of our trip.',
        date: 'Jun 2024'
      },
      {
        id: 'r25',
        user: 'Susan T.',
        rating: 4,
        comment: 'Beautiful property, though getting there requires some navigation skills.',
        date: 'May 2024'
      }
    ]
  }
];

// Filter for trending hotels (backwards compatibility)
export const TRENDING_HOTELS = ALL_HOTELS.filter(hotel => hotel.isTrending);

// Get unique countries from all hotels
export const COUNTRIES = [...new Set(ALL_HOTELS.map(hotel => hotel.country))].sort();

// Get hotels by country
export const getHotelsByCountry = (country: string) =>
  ALL_HOTELS.filter(hotel => hotel.country.toLowerCase() === country.toLowerCase());

// Get hotels by category/style
export const getHotelsByCategory = (category: string) =>
  ALL_HOTELS.filter(hotel => hotel.category.toLowerCase() === category.toLowerCase().replace(/-/g, ' '));