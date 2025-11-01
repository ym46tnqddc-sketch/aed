import React, { useEffect, useRef, useState } from 'react';

function Map({ defibrillators, onMarkerClick }) {
  const mapRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  const getBounds = () => {
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

    return bounds;
  };

  const getMarkerPosition = (lat, lon) => {
    const bounds = getBounds();
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };

  const handleMarkerClick = (defibrillator) => {
    setSelectedId(defibrillator.id);
    onMarkerClick(defibrillator);
  };

  return (
    <div ref={mapRef} className="map-viewport">
      {defibrillators.map((defibrillator) => {
        const pos = getMarkerPosition(defibrillator.latitude, defibrillator.longitude);
        const isSelected = selectedId === defibrillator.id;

        return (
          <button
            key={defibrillator.id}
            className={`map-marker ${isSelected ? 'selected' : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
            onClick={() => handleMarkerClick(defibrillator)}
            title={`${defibrillator.nom} - ${defibrillator.ville}`}
          >
            <svg
              className={`marker-icon ${isSelected ? 'selected' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export default Map;
