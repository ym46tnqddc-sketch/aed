import { useEffect, useRef, useState } from 'react';
import type { Defibrillator } from '../types/defibrillator';
import { MapPin } from 'lucide-react';

interface MapProps {
  defibrillators: Defibrillator[];
  onMarkerClick: (defibrillator: Defibrillator) => void;
}

export default function Map({ defibrillators, onMarkerClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const bounds = {
      minLat: 41.0,
      maxLat: 51.5,
      minLon: -5.5,
      maxLon: 10.0,
    };

    if (defibrillators.length > 0) {
      const lats = defibrillators.map(d => d.latitude);
      const lons = defibrillators.map(d => d.longitude);
      bounds.minLat = Math.min(...lats);
      bounds.maxLat = Math.max(...lats);
      bounds.minLon = Math.min(...lons);
      bounds.maxLon = Math.max(...lons);
    }

    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    const centerLon = (bounds.minLon + bounds.maxLon) / 2;

    mapRef.current.style.setProperty('--center-lat', centerLat.toString());
    mapRef.current.style.setProperty('--center-lon', centerLon.toString());
  }, [defibrillators]);

  const handleMarkerClick = (defibrillator: Defibrillator) => {
    setSelectedId(defibrillator.id);
    onMarkerClick(defibrillator);
  };

  const getMarkerPosition = (lat: number, lon: number) => {
    const bounds = {
      minLat: 41.0,
      maxLat: 51.5,
      minLon: -5.5,
      maxLon: 10.0,
    };

    if (defibrillators.length > 0) {
      const lats = defibrillators.map(d => d.latitude);
      const lons = defibrillators.map(d => d.longitude);
      bounds.minLat = Math.min(...lats);
      bounds.maxLat = Math.max(...lats);
      bounds.minLon = Math.min(...lons);
      bounds.maxLon = Math.max(...lons);
    }

    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;

    return { x, y };
  };

  return (
    <div ref={mapRef} className="relative w-full h-full bg-slate-100 overflow-hidden rounded-lg shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        {defibrillators.map((defibrillator) => {
          const pos = getMarkerPosition(defibrillator.latitude, defibrillator.longitude);
          return (
            <button
              key={defibrillator.id}
              className={`absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-125 z-10 ${
                selectedId === defibrillator.id ? 'scale-150 z-20' : ''
              }`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              onClick={() => handleMarkerClick(defibrillator)}
              title={`${defibrillator.nom} - ${defibrillator.ville}`}
            >
              <MapPin
                className={`${
                  selectedId === defibrillator.id
                    ? 'text-red-600 fill-red-500'
                    : 'text-red-500 fill-red-400'
                } drop-shadow-lg`}
                size={selectedId === defibrillator.id ? 32 : 24}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
