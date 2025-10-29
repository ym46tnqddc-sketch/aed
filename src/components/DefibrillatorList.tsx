import type { Defibrillator } from '../types/defibrillator';
import { MapPin, Navigation } from 'lucide-react';

interface DefibrillatorListProps {
  defibrillators: Defibrillator[];
  onSelect: (defibrillator: Defibrillator) => void;
  selectedId?: string | null;
}

export default function DefibrillatorList({
  defibrillators,
  onSelect,
  selectedId,
}: DefibrillatorListProps) {
  const openInMaps = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
  };

  return (
    <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
      {defibrillators.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
          <p>No defibrillators found</p>
        </div>
      ) : (
        defibrillators.map((defibrillator) => (
          <div
            key={defibrillator.id}
            className={`p-4 bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
              selectedId === defibrillator.id
                ? 'border-red-500 ring-2 ring-red-200'
                : 'border-transparent'
            }`}
            onClick={() => onSelect(defibrillator)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{defibrillator.nom}</h3>
                <p className="text-sm text-gray-600 mb-1">{defibrillator.adresse}</p>
                <p className="text-sm text-gray-600">
                  {defibrillator.code_postal} {defibrillator.ville}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openInMaps(defibrillator.latitude, defibrillator.longitude);
                }}
                className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Open in Google Maps"
              >
                <Navigation size={20} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
