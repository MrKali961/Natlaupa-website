import {
  Heart,
  Compass,
  Palette,
  Leaf,
  Crown,
  Waves,
  Mountain,
  Building2,
  Castle,
  Sparkles,
  TreePine,
  Home,
  Tent,
  Ship,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Map style names to appropriate Lucide icons
 * Uses fuzzy matching with keywords
 */
export function getIconForStyle(styleName: string): LucideIcon {
  const name = styleName.toLowerCase();

  if (name.includes('romantic') || name.includes('honeymoon')) return Heart;
  if (name.includes('adventure') || name.includes('active')) return Compass;
  if (name.includes('cultural') || name.includes('art')) return Palette;
  if (name.includes('wellness') || name.includes('spa')) return Leaf;
  if (name.includes('luxury') || name.includes('premium')) return Crown;
  if (name.includes('beach') || name.includes('coastal')) return Waves;
  if (name.includes('mountain') || name.includes('alpine')) return Mountain;
  if (name.includes('urban') || name.includes('city')) return Building2;
  if (name.includes('historic') || name.includes('castle')) return Castle;
  if (name.includes('eco') || name.includes('nature')) return TreePine;
  if (name.includes('boutique')) return Home;
  if (name.includes('camping') || name.includes('glamping')) return Tent;
  if (name.includes('cruise')) return Ship;

  return Sparkles; // Default
}

/**
 * Generate gradient color classes based on style name or index
 * Maintains visual diversity across dynamic styles
 */
export function getColorForStyle(styleName: string, index: number): string {
  const colors = [
    "from-rose-500/20 to-pink-500/20",       // Romantic - 0
    "from-orange-500/20 to-amber-500/20",    // Adventure - 1
    "from-purple-500/20 to-indigo-500/20",   // Cultural - 2
    "from-emerald-500/20 to-teal-500/20",    // Wellness - 3
    "from-blue-500/20 to-cyan-500/20",       // Beach/Coastal - 4
    "from-slate-500/20 to-gray-500/20",      // Urban - 5
    "from-green-500/20 to-lime-500/20",      // Eco/Nature - 6
    "from-yellow-500/20 to-orange-500/20",   // Luxury - 7
  ];

  const name = styleName.toLowerCase();

  if (name.includes('romantic')) return colors[0];
  if (name.includes('adventure')) return colors[1];
  if (name.includes('cultural')) return colors[2];
  if (name.includes('wellness')) return colors[3];
  if (name.includes('beach')) return colors[4];
  if (name.includes('urban')) return colors[5];
  if (name.includes('eco')) return colors[6];
  if (name.includes('luxury')) return colors[7];

  return colors[index % colors.length];
}

/**
 * Generate default image URL based on style name
 */
export function getDefaultImageUrl(styleName: string): string {
  const name = styleName.toLowerCase();

  if (name.includes('romantic')) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  if (name.includes('adventure')) return "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800";
  if (name.includes('cultural')) return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800";
  if (name.includes('wellness')) return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800";

  return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800";
}
