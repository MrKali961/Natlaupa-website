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
  { name: "Private Travel", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const FOOTER_LINKS = {
  explore: [
    { name: "Destinations", path: "/destinations" },
    { name: "All Offers", path: "/offers" },
    { name: "Countries", path: "/countries" },
    { name: "Styles", path: "/styles" },
    { name: "Blogs", path: "/blog" },
  ],
  company: [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ],
  programs: [
    { name: "Hospitality", path: "/hospitality" },
    { name: "Join the Private Club", path: "/join-the-private-club" },
  ],
  legal: [
    { name: "Mentions Légales", path: "/mentions-legales" },
    { name: "Politique de Confidentialité", path: "/politique-de-confidentialite" },
    { name: "CGU", path: "/cgu" },
    { name: "CGS / CGV", path: "/conditions-generales-service" },
    { name: "Politique de Cookies", path: "/politique-cookies" },
    { name: "Médiation", path: "/mediation-consommation" },
  ],
};
