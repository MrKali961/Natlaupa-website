// Map destinations for the About page interactive globe
export interface MapDestination {
  id: string | number;
  name: string;
  country: string;
  lat: number;
  lng: number;
  slug?: string;
  category?: string;
  location?: string;
}

// Fallback destinations (used when no hotels with coordinates are available)
export const MAP_DESTINATIONS: MapDestination[] = [];

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
