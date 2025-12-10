'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { MapDestination } from '@/lib/constants';

interface InteractiveMapProps {
  destinations: MapDestination[];
}

export default function InteractiveMap({ destinations }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<MapDestination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Handle marker click with fly animation
  const handleMarkerClick = useCallback((dest: MapDestination) => {
    if (!mapRef.current) return;

    // Toggle selection
    if (selectedDestination?.id === dest.id) {
      setSelectedDestination(null);
      mapRef.current.flyTo({
        center: [20, 20],
        zoom: 1.5,
        duration: 1500,
        essential: true,
      });
    } else {
      setSelectedDestination(dest);
      mapRef.current.flyTo({
        center: [dest.lng, dest.lat],
        zoom: 4,
        duration: 1500,
        essential: true,
      });
    }

    // Update marker styles
    markersRef.current.forEach(marker => {
      const markerEl = marker.getElement();
      const markerDiv = markerEl.querySelector('.map-marker');
      if (markerDiv) {
        const markerId = markerDiv.getAttribute('data-id');
        if (markerId === String(dest.id) && selectedDestination?.id !== dest.id) {
          markerDiv.classList.add('selected');
        } else {
          markerDiv.classList.remove('selected');
        }
      }
    });
  }, [selectedDestination]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Check for access token
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      setMapError('Mapbox access token not configured. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file.');
      return;
    }

    mapboxgl.accessToken = accessToken;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [20, 20],
        zoom: 1.5,
        projection: 'globe',
        interactive: true,
        attributionControl: false,
      });

      // Disable scroll zoom to prevent conflict with Lenis
      map.scrollZoom.disable();

      // Add navigation controls
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      map.on('load', () => {
        // Apply dark atmosphere/fog effect
        map.setFog({
          color: 'rgb(18, 18, 18)',
          'high-color': 'rgb(0, 0, 0)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(0, 0, 0)',
          'star-intensity': 0.15,
        });

        setMapLoaded(true);
      });

      map.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map. Please check your Mapbox configuration.');
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map.');
    }
  }, []);

  // Create markers when map loads
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create markers for each destination
    destinations.forEach((dest, index) => {
      const el = document.createElement('div');
      el.className = 'map-marker-container';
      el.innerHTML = `
        <div class="map-marker" data-id="${dest.id}">
          <span class="marker-dot"></span>
          <span class="marker-pulse" style="animation-delay: ${index * 0.2}s"></span>
        </div>
        <span class="marker-label">${dest.name}</span>
      `;

      el.addEventListener('click', () => {
        handleMarkerClick(dest);
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([dest.lng, dest.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, destinations, handleMarkerClick]);

  // Show error state
  if (mapError) {
    return (
      <div className="relative aspect-[16/9] sm:aspect-[2/1] max-w-5xl mx-auto rounded-lg overflow-hidden bg-midnight/50 border border-gold/20 flex items-center justify-center" style={{ minHeight: '300px' }}>
        <div className="text-center p-4 sm:p-8">
          <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-gold/50 mx-auto mb-4" />
          <p className="text-slate-400 text-sm sm:text-base px-4">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] sm:aspect-[2/1] max-w-5xl mx-auto rounded-lg overflow-hidden">
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-midnight flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-gold">Loading map...</div>
          </div>
        </div>
      )}

      {/* Destination Card */}
      <AnimatePresence>
        {selectedDestination && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-80 bg-midnight/95 backdrop-blur-sm border border-gold/20 rounded-lg p-4 sm:p-6 z-10"
          >
            <button
              onClick={() => {
                setSelectedDestination(null);
                mapRef.current?.flyTo({
                  center: [20, 20],
                  zoom: 1.5,
                  duration: 1500,
                });
              }}
              className="absolute top-2 right-3 text-slate-400 hover:text-white text-xl leading-none"
            >
              &times;
            </button>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl text-white font-serif">
                  {selectedDestination.name}
                </h3>
                <p className="text-gold text-sm mb-2">
                  {selectedDestination.country}
                </p>
                <p className="text-slate-400 text-sm italic">
                  &ldquo;{selectedDestination.story}&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
