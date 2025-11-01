import React from 'react';

function DefibrillatorList({ defibrillators, onSelect, selectedId }) {
  const openInMaps = (lat, lon, event) => {
    event.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
  };

  return (
    <div className="defibrillator-list">
      {defibrillators.length === 0 ? (
        <div className="list-empty">
          <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>Aucun défibrillateur trouvé</p>
        </div>
      ) : (
        defibrillators.map((defibrillator) => (
          <div
            key={defibrillator.id}
            className={`defibrillator-card ${selectedId === defibrillator.id ? 'selected' : ''}`}
            onClick={() => onSelect(defibrillator)}
          >
            <div className="card-content">
              <div className="card-info">
                <h3 className="card-title">{defibrillator.nom}</h3>
                <p className="card-address">{defibrillator.adresse}</p>
                <p className="card-location">
                  {defibrillator.code_postal} {defibrillator.ville}
                </p>
              </div>
              <button
                className="nav-button"
                onClick={(e) => openInMaps(defibrillator.latitude, defibrillator.longitude, e)}
                title="Ouvrir dans Google Maps"
              >
                <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DefibrillatorList;
