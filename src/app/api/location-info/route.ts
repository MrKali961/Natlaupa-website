import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Calculate sun position based on time
function getSunMoonStatement(hour: number): string {
  if (hour >= 5 && hour < 7) return "The sun is rising.";
  if (hour >= 7 && hour < 12) return "The morning sun is shining.";
  if (hour >= 12 && hour < 14) return "The sun is at its peak.";
  if (hour >= 14 && hour < 17) return "The afternoon sun is warm.";
  if (hour >= 17 && hour < 19) return "Golden hour has begun.";
  if (hour >= 19 && hour < 21) return "The sun has just set.";
  if (hour >= 21 && hour < 23) return "The night sky is awakening.";
  if (hour >= 23 || hour < 2) return "The stars are shining bright.";
  if (hour >= 2 && hour < 5) return "The moon watches over the city.";
  return "A beautiful moment in time.";
}

// Curated Unsplash image database with specific landmarks/locations
const locationImages: Record<string, string> = {
  // Major cities with iconic landmarks
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80', // Eiffel Tower
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80', // Big Ben
  'New York': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1920&q=80', // Statue of Liberty
  'Tokyo': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80', // Tokyo Tower
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80', // Colosseum
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', // Burj Khalifa
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80', // Opera House
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&q=80', // Sagrada Familia
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1920&q=80', // Canals
  'Berlin': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80', // Brandenburg Gate
  'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1920&q=80', // Schönbrunn
  'Prague': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80', // Charles Bridge
  'Budapest': 'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=1920&q=80', // Parliament
  'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1920&q=80', // Acropolis
  'Istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1920&q=80', // Blue Mosque
  'Cairo': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=80', // Pyramids
  'Marrakech': 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80', // Medina
  'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80', // Table Mountain
  'Rio de Janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80', // Christ the Redeemer
  'Buenos Aires': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1920&q=80', // Obelisco
  'Mexico City': 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1920&q=80', // Palacio
  'Toronto': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80', // CN Tower
  'Beijing': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80', // Great Wall
  'Shanghai': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1920&q=80', // Skyline
  'Mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1920&q=80', // Gateway of India
  'Delhi': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80', // India Gate
  'Bangkok': 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1920&q=80', // Grand Palace
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80', // Marina Bay
  'Hong Kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1920&q=80', // Victoria Harbour
  'Seoul': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920&q=80', // Gyeongbokgung
  'Lisbon': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=80', // Tram
  'Madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80', // Royal Palace
  'Milan': 'https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=1920&q=80', // Duomo
  'Venice': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&q=80', // Grand Canal
  'Florence': 'https://images.unsplash.com/photo-1543429776-2782fc8e319c?w=1920&q=80', // Duomo
  'Moscow': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1920&q=80', // Red Square
  'St Petersburg': 'https://images.unsplash.com/photo-1548834925-e48f8a27ae6f?w=1920&q=80', // Hermitage
  'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80', // Blue Domes
  'Reykjavik': 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1920&q=80', // Northern Lights
  'Stockholm': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1920&q=80', // Gamla Stan
  'Copenhagen': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1920&q=80', // Nyhavn
  'Oslo': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80', // Fjords
  'Helsinki': 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=1920&q=80', // Cathedral
  'Dublin': 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1920&q=80', // Temple Bar
  'Edinburgh': 'https://images.unsplash.com/photo-1506377585622-bedcbb5f7f8c?w=1920&q=80', // Castle
  'Warsaw': 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=1920&q=80', // Old Town
  'Zurich': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80', // Alps
  'Geneva': 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?w=1920&q=80', // Jet d'Eau
  'Brussels': 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1920&q=80', // Grand Place
  'Dubrovnik': 'https://images.unsplash.com/photo-1555990538-1e6e9a8a9d52?w=1920&q=80', // Old Town
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80', // Temple
  'Hanoi': 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920&q=80', // Old Quarter
  'Manila': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1920&q=80', // Skyline
  'Kuala Lumpur': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80', // Petronas
  'Auckland': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80', // Sky Tower
  'Tel Aviv': 'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=1920&q=80', // Beach
  'Riyadh': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1920&q=80', // Kingdom Tower
  'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1920&q=80', // Hollywood
  'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80', // Golden Gate
  'Chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1920&q=80', // Skyline
  'Miami': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1920&q=80', // Beach
  'Las Vegas': 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=1920&q=80', // Strip
  'Washington': 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1920&q=80', // Capitol
  'Boston': 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=1920&q=80', // Harbor
  'Seattle': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1920&q=80', // Space Needle
  'Vancouver': 'https://images.unsplash.com/photo-1559511260-66a68eae2be0?w=1920&q=80', // Skyline
  'Montreal': 'https://images.unsplash.com/photo-1519178614-68673b201f36?w=1920&q=80', // Old Port
};

// Country fallback images
const countryImages: Record<string, string> = {
  'France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80',
  'Italy': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80',
  'Spain': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&q=80',
  'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
  'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80',
  'Japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80',
  'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1920&q=80',
  'Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80',
  'Greece': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80',
  'Netherlands': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1920&q=80',
  'Switzerland': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80',
  'Portugal': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=80',
  'Austria': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1920&q=80',
  'Belgium': 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1920&q=80',
  'Sweden': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1920&q=80',
  'Norway': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
  'Denmark': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1920&q=80',
  'Finland': 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=1920&q=80',
  'Ireland': 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1920&q=80',
  'Poland': 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=1920&q=80',
  'Czech Republic': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80',
  'Czechia': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80',
  'Hungary': 'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=1920&q=80',
  'Croatia': 'https://images.unsplash.com/photo-1555990538-1e6e9a8a9d52?w=1920&q=80',
  'Turkey': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1920&q=80',
  'Egypt': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=80',
  'Morocco': 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80',
  'South Africa': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80',
  'Brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80',
  'Argentina': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1920&q=80',
  'Mexico': 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1920&q=80',
  'Canada': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80',
  'China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80',
  'India': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80',
  'Thailand': 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1920&q=80',
  'Vietnam': 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920&q=80',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80',
  'Indonesia': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
  'Malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80',
  'Philippines': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1920&q=80',
  'South Korea': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920&q=80',
  'New Zealand': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80',
  'Iceland': 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1920&q=80',
  'Russia': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1920&q=80',
  'United Arab Emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
  'Israel': 'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=1920&q=80',
  'Saudi Arabia': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1920&q=80',
};

// Get a scenic image URL based on city/country
function getScenicImageUrl(city: string, country: string): string {
  // Try city-specific image first
  if (locationImages[city]) {
    return locationImages[city];
  }

  // Try country fallback
  if (countryImages[country]) {
    return countryImages[country];
  }

  // Default scenic image
  return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80';
}

// Default location data (Paris - an iconic, universally appealing default)
const DEFAULT_LOCATION = {
  city: 'Paris',
  country: 'France',
  lat: 48.8566,
  lng: 2.3522,
  timezone: 'Europe/Paris',
  imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let lat = parseFloat(searchParams.get('lat') || '0');
    let lng = parseFloat(searchParams.get('lng') || '0');

    // Use default location if coordinates are 0,0 (fallback/denied permission)
    const useDefault = !lat && !lng;
    if (useDefault) {
      lat = DEFAULT_LOCATION.lat;
      lng = DEFAULT_LOCATION.lng;
    }

    // Get the current time - use location's timezone if default
    const now = new Date();
    let localTime: string;
    let hour: number;

    if (useDefault) {
      // Use Paris timezone for default location
      localTime = now.toLocaleTimeString('en-US', {
        timeZone: DEFAULT_LOCATION.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      hour = parseInt(localTime.split(':')[0]);
    } else {
      localTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      hour = now.getHours();
    }

    // Try to get city/country using reverse geocoding
    let city = useDefault ? DEFAULT_LOCATION.city : 'Your Location';
    let country = useDefault ? DEFAULT_LOCATION.country : 'Earth';
    let imageUrl = useDefault ? DEFAULT_LOCATION.imageUrl : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80';
    let sunMoonStatus = getSunMoonStatement(hour);

    // Only do geocoding if not using default location
    if (!useDefault) {
      try {
        // Use OpenStreetMap Nominatim for reverse geocoding with English names
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&accept-language=en`,
          {
            headers: {
              'User-Agent': 'Natlaupa/1.0',
              'Accept-Language': 'en'
            }
          }
        );

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          city = geoData.address?.city ||
                 geoData.address?.town ||
                 geoData.address?.village ||
                 geoData.address?.municipality ||
                 geoData.address?.county ||
                 geoData.address?.state ||
                 'Your Location';
          country = geoData.address?.country || 'Earth';

          // Ensure English names (some locations may still return local names)
          // Common translations for major cities
          const cityTranslations: Record<string, string> = {
            'Moskva': 'Moscow',
            'Roma': 'Rome',
            'Milano': 'Milan',
            'Firenze': 'Florence',
            'Venezia': 'Venice',
            'Napoli': 'Naples',
            'München': 'Munich',
            'Köln': 'Cologne',
            'Wien': 'Vienna',
            'Zürich': 'Zurich',
            'Genève': 'Geneva',
            'Bruxelles': 'Brussels',
            'Athina': 'Athens',
            'Praha': 'Prague',
            'Warszawa': 'Warsaw',
            'Lisboa': 'Lisbon',
            'Bucuresti': 'Bucharest',
            'Moskau': 'Moscow',
            'Pékin': 'Beijing',
            'Le Caire': 'Cairo',
          };

          if (cityTranslations[city]) {
            city = cityTranslations[city];
          }

          imageUrl = getScenicImageUrl(city, country);
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError);
      }
    }

    // Try to enhance with AI if available (skip for default location - already have good data)
    if (genAI && !useDefault) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // First, get a better image for the location
        const imagePrompt = `For the location "${city}, ${country}", provide a famous landmark, monument, or iconic scenic place that represents this location.
Return ONLY the name of ONE specific landmark or place (2-4 words max).
Examples: "Eiffel Tower", "Big Ben", "Golden Gate Bridge", "Table Mountain", "Petronas Towers"
If it's a small town, return the most famous landmark from the nearest major city or region.
Just return the landmark name, nothing else.`;

        const imageResult = await model.generateContent(imagePrompt);
        const landmark = imageResult.response.text().trim().replace(/"/g, '');

        if (landmark && landmark.length < 50) {
          // Map landmark to reliable Unsplash image URLs
          const landmarkImages: Record<string, string> = {
            'Eiffel Tower': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80',
            'Big Ben': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
            'Tower Bridge': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
            'Statue of Liberty': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1920&q=80',
            'Empire State Building': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=80',
            'Colosseum': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80',
            'Burj Khalifa': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
            'Sydney Opera House': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80',
            'Sagrada Familia': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&q=80',
            'Brandenburg Gate': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80',
            'Acropolis': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1920&q=80',
            'Parthenon': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1920&q=80',
            'Charles Bridge': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80',
            'Pyramids of Giza': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=80',
            'Great Pyramid': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=80',
            'Taj Mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80',
            'Great Wall': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80',
            'Great Wall of China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80',
            'Mount Fuji': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80',
            'Tokyo Tower': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1920&q=80',
            'Golden Gate Bridge': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
            'Christ the Redeemer': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80',
            'Machu Picchu': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1920&q=80',
            'Petra': 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=1920&q=80',
            'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80',
            'Blue Domes': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80',
            'Hagia Sophia': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1920&q=80',
            'Blue Mosque': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1920&q=80',
            'Kremlin': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1920&q=80',
            'Red Square': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1920&q=80',
            'Petronas Towers': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80',
            'Marina Bay Sands': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80',
            'Table Mountain': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80',
            'CN Tower': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80',
            'Niagara Falls': 'https://images.unsplash.com/photo-1489447068241-b3490214e879?w=1920&q=80',
            'Space Needle': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1920&q=80',
            'Hollywood Sign': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1920&q=80',
            'Las Vegas Strip': 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=1920&q=80',
            'Grand Canyon': 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1920&q=80',
            'Stonehenge': 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?w=1920&q=80',
            'Edinburgh Castle': 'https://images.unsplash.com/photo-1506377585622-bedcbb5f7f8c?w=1920&q=80',
            'Louvre': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=80',
            'Notre Dame': 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=1920&q=80',
            'Arc de Triomphe': 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=1920&q=80',
            'Duomo': 'https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=1920&q=80',
            'Milan Cathedral': 'https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=1920&q=80',
            'Leaning Tower of Pisa': 'https://images.unsplash.com/photo-1543429776-2782fc8e319c?w=1920&q=80',
            'Venice Grand Canal': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&q=80',
            'Rialto Bridge': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&q=80',
            'Vatican': 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1920&q=80',
            'St Peters Basilica': 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1920&q=80',
            'Trevi Fountain': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80',
            'Neuschwanstein Castle': 'https://images.unsplash.com/photo-1534313314376-a72289b6181e?w=1920&q=80',
            'Matterhorn': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80',
            'Swiss Alps': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80',
            'Northern Lights': 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1920&q=80',
            'Aurora Borealis': 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1920&q=80',
            'Angkor Wat': 'https://images.unsplash.com/photo-1551618428-4d46edab3e6c?w=1920&q=80',
            'Bali Temple': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
            'Ha Long Bay': 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920&q=80',
            'Forbidden City': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80',
            'Victoria Harbour': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1920&q=80',
            'Gyeongbokgung Palace': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920&q=80',
            'Fushimi Inari': 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1920&q=80',
            'Sensoji Temple': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=80',
            'Shibuya Crossing': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1920&q=80',
            'Opera House': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80',
            'Harbour Bridge': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80',
            'Uluru': 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=1920&q=80',
            'Milford Sound': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80',
          };

          // Try to find a matching landmark image
          let foundImage = false;
          const landmarkLower = landmark.toLowerCase();
          for (const [key, url] of Object.entries(landmarkImages)) {
            if (landmarkLower.includes(key.toLowerCase()) || key.toLowerCase().includes(landmarkLower)) {
              imageUrl = url;
              foundImage = true;
              break;
            }
          }

          // If no direct match, use country image as fallback
          if (!foundImage && countryImages[country]) {
            imageUrl = countryImages[country];
          }
        }

        // Then get the sun/moon statement
        const sunMoonPrompt = `Based on the time ${localTime} (${hour}:00 hours) and location ${city}, ${country},
generate a short, poetic statement about the sun or moon position.
Keep it under 10 words, elegant and atmospheric.
Examples: "The sun has just set.", "Golden hour paints the sky.", "Stars begin to appear."
Just return the statement, nothing else.`;

        const sunMoonResult = await model.generateContent(sunMoonPrompt);
        const aiResponse = sunMoonResult.response.text().trim();

        if (aiResponse && aiResponse.length < 100) {
          sunMoonStatus = aiResponse.replace(/"/g, '');
        }
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        // Keep the default values
      }
    }

    return NextResponse.json({
      success: true,
      location: `${city}, ${country}`,
      city,
      country,
      time: localTime,
      hour,
      sunMoonStatus,
      imageUrl,
      isDefault: useDefault
    });

  } catch (error) {
    console.error('Error in location-info API:', error);

    // Return Paris as fallback (same as default)
    const now = new Date();
    const localTime = now.toLocaleTimeString('en-US', {
      timeZone: DEFAULT_LOCATION.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const hour = parseInt(localTime.split(':')[0]);

    return NextResponse.json({
      success: true,
      location: `${DEFAULT_LOCATION.city}, ${DEFAULT_LOCATION.country}`,
      city: DEFAULT_LOCATION.city,
      country: DEFAULT_LOCATION.country,
      time: localTime,
      hour,
      sunMoonStatus: getSunMoonStatement(hour),
      imageUrl: DEFAULT_LOCATION.imageUrl,
      isDefault: true
    });
  }
}
