import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useWebSocket } from '@/lib/websocket-context';
import { LoadingSpinner } from './loading-spinner';

interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  showRoute?: boolean;
  routeId?: string;
}

export function Map({ 
  initialCenter = [-7.5898, 33.5731], // Default to Morocco
  initialZoom = 6,
  showRoute = false,
  routeId
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCenter,
      zoom: initialZoom
    });

    map.current.on('load', () => {
      setIsLoading(false);
    });

    return () => {
      map.current?.remove();
    };
  }, [initialCenter, initialZoom]);

  useEffect(() => {
    if (!map.current || !showRoute || !routeId) return;

    // Add route source and layer
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4
      }
    });
  }, [showRoute, routeId]);

  useEffect(() => {
    if (!map.current || !lastMessage || lastMessage.type !== 'tracking_update') return;

    const { coordinates } = lastMessage.payload;
    if (!coordinates) return;

    // Update route if showing
    if (showRoute && map.current.getSource('route')) {
      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      });
    }

    // Add or update marker
    const markerId = 'current-location';
    if (map.current.getLayer(markerId)) {
      map.current.removeLayer(markerId);
    }
    if (map.current.getSource(markerId)) {
      map.current.removeSource(markerId);
    }

    map.current.addSource(markerId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates
        }
      }
    });

    map.current.addLayer({
      id: markerId,
      type: 'circle',
      source: markerId,
      paint: {
        'circle-radius': 8,
        'circle-color': '#ef4444',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Center map on new location
    map.current.flyTo({
      center: coordinates,
      zoom: 12
    });
  }, [lastMessage, showRoute]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <LoadingSpinner size="lg" color="blue" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
} 