import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import DefibrillatorList from './components/DefibrillatorList';
import { fetchDefibrillators, filterDefibrillators } from './services/defibrillatorService';
import type { Defibrillator } from './types/defibrillator';

function App() {
  const [defibrillators, setDefibrillators] = useState<Defibrillator[]>([]);
  const [filteredDefibrillators, setFilteredDefibrillators] = useState<Defibrillator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDefibrillator, setSelectedDefibrillator] = useState<Defibrillator | null>(null);

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

  const handleDefibrillatorSelect = (defibrillator: Defibrillator) => {
    setSelectedDefibrillator(defibrillator);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-red-400 mb-4">
            AED MAP
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find automated external defibrillators near you through our interactive map.
            Every second counts in a cardiac emergency.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600">Loading defibrillators...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                resultCount={filteredDefibrillators.length}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-4 h-[600px]">
                  <Map
                    defibrillators={filteredDefibrillators}
                    onMarkerClick={handleDefibrillatorSelect}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Defibrillator List
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Total: {defibrillators.length} defibrillators
                  </p>
                  <DefibrillatorList
                    defibrillators={filteredDefibrillators}
                    onSelect={handleDefibrillatorSelect}
                    selectedId={selectedDefibrillator?.id}
                  />
                </div>
              </div>
            </div>

            <footer className="mt-16 text-center text-sm text-gray-600 pb-8">
              <p>
                Data from{' '}
                <a
                  href="https://www.data.gouv.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  data.gouv.fr
                </a>
              </p>
              <p className="mt-2">
                In case of emergency, dial{' '}
                <span className="font-bold text-red-600">15 (SAMU)</span> or{' '}
                <span className="font-bold text-red-600">112</span>
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
