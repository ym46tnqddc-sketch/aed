import type { Defibrillator } from '../types/defibrillator';

const DATA_SOURCES = [
  'https://www.data.gouv.fr/fr/datasets/r/01aa7df5-1bfc-4ba8-ade1-52e52d8dddf2',
  'https://www.data.gouv.fr/fr/datasets/r/f97ea53c-87c7-4458-957a-7c7de63e0db3',
  'https://www.data.gouv.fr/fr/datasets/r/cc4c1917-73ca-4db7-a7dd-8cdb0c1c7938',
];

function parseCSV(csv: string): Defibrillator[] {
  const lines = csv.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase());
  const defibrillators: Defibrillator[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(/[,;]/).map(v => v.trim().replace(/^"|"$/g, ''));

    const latIndex = headers.findIndex(h => h.includes('lat') && !h.includes('long'));
    const lonIndex = headers.findIndex(h => h.includes('lon'));
    const nomIndex = headers.findIndex(h => h.includes('nom') || h.includes('name'));
    const adresseIndex = headers.findIndex(h => h.includes('adresse') || h.includes('address'));
    const villeIndex = headers.findIndex(h => h.includes('ville') || h.includes('city') || h.includes('commune'));
    const cpIndex = headers.findIndex(h => h.includes('postal') || h.includes('cp'));

    if (latIndex === -1 || lonIndex === -1) continue;

    const lat = parseFloat(values[latIndex]);
    const lon = parseFloat(values[lonIndex]);

    if (isNaN(lat) || isNaN(lon)) continue;

    defibrillators.push({
      id: `${lat}-${lon}-${i}`,
      nom: nomIndex !== -1 ? values[nomIndex] : 'Defibrillator',
      adresse: adresseIndex !== -1 ? values[adresseIndex] : '',
      ville: villeIndex !== -1 ? values[villeIndex] : '',
      code_postal: cpIndex !== -1 ? values[cpIndex] : '',
      latitude: lat,
      longitude: lon,
    });
  }

  return defibrillators;
}

export async function fetchDefibrillators(): Promise<Defibrillator[]> {
  const allDefibrillators: Defibrillator[] = [];

  for (const source of DATA_SOURCES) {
    try {
      const response = await fetch(source);
      if (!response.ok) continue;

      const text = await response.text();
      const defibrillators = parseCSV(text);
      allDefibrillators.push(...defibrillators);
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
    }
  }

  return allDefibrillators;
}

export function filterDefibrillators(
  defibrillators: Defibrillator[],
  searchTerm: string
): Defibrillator[] {
  if (!searchTerm.trim()) return defibrillators;

  const term = searchTerm.toLowerCase();
  return defibrillators.filter(
    d =>
      d.nom.toLowerCase().includes(term) ||
      d.adresse.toLowerCase().includes(term) ||
      d.ville.toLowerCase().includes(term) ||
      d.code_postal.includes(term)
  );
}
