import React, { useEffect, useState } from 'react';
import Map from './components/Map.jsx';
import SearchBar from './components/SearchBar.jsx';
import DefibrillatorList from './components/DefibrillatorList.jsx';
import { fetchDefibrillators, filterDefibrillators } from './services/defibrillatorService.js';

function App() {
  const [defibrillators, setDefibrillators] = useState([]);
  const [filteredDefibrillators, setFilteredDefibrillators] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDefibrillator, setSelectedDefibrillator] = useState(null);

  useEffect(() => {
    const loadDefibrillators = async () => {
      setLoading(true);
      try {
        const data = await fetchDefibrillators();
        setDefibrillators(data);
        setFilteredDefibrillators(data);
      } catch (error) {
        console.error('Error loading defibrillators:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDefibrillators();
  }, []);

  useEffect(() => {
    const filtered = filterDefibrillators(defibrillators, searchTerm);
    setFilteredDefibrillators(filtered);
  }, [searchTerm, defibrillators]);

  const handleDefibrillatorSelect = (defibrillator) => {
    setSelectedDefibrillator(defibrillator);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>AED MAP</h1>
        <p>
          Trouvez les défibrillateurs automatiques externes près de chez vous grâce à notre carte interactive.
          Chaque seconde compte en cas d'urgence cardiaque.
        </p>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Chargement des défibrillateurs...</p>
        </div>
      ) : (
        <>
          <div className="search-section">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              resultCount={filteredDefibrillators.length}
            />
          </div>

          <div className="main-grid">
            <div className="map-container">
              <Map
                defibrillators={filteredDefibrillators}
                onMarkerClick={handleDefibrillatorSelect}
              />
            </div>

            <div className="list-container">
              <div className="list-header">
                <h2 className="list-title">Liste des Défibrillateurs</h2>
                <p className="list-count">
                  Total : {defibrillators.length} défibrillateurs
                </p>
              </div>
              <DefibrillatorList
                defibrillators={filteredDefibrillators}
                onSelect={handleDefibrillatorSelect}
                selectedId={selectedDefibrillator?.id}
              />
            </div>
          </div>

          <footer className="footer">
            <p>
              Données issues de{' '}
              <a
                href="https://www.data.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                data.gouv.fr
              </a>
            </p>
            <p className="emergency-info">
              En cas d'urgence, composez le{' '}
              <span className="emergency-number">15 (SAMU)</span> ou le{' '}
              <span className="emergency-number">112</span>
            </p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
