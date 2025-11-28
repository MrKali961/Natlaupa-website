import { Hotel, Destination, Category } from './types';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Collection', path: '/offers' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'For Hotels', path: '/for-hotels' },
  { name: 'Angel Program', path: '/become-angel' },
];

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

export const TRENDING_HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'The Azure Pearl',
    location: 'Maldives',
    price: 1200,
    rating: 4.9,
    imageUrl: 'https://picsum.photos/600/400?random=20',
    category: 'Overwater Villas',
    isTrending: true,
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
    location: 'Scotland',
    price: 450,
    rating: 4.8,
    imageUrl: 'https://picsum.photos/600/400?random=21',
    category: 'Historic Castles',
    isTrending: true,
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
    location: 'Tokyo',
    price: 850,
    rating: 4.7,
    imageUrl: 'https://picsum.photos/600/400?random=22',
    category: 'Urban Suites',
    isTrending: true,
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
];