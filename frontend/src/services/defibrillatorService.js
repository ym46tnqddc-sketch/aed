import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

let isSyncing = false;

async function syncDataIfNeeded() {
  if (isSyncing) return;

  const { count } = await supabase
    .from('defibrillators')
    .select('*', { count: 'exact', head: true });

  if (count === 0 && !isSyncing) {
    isSyncing = true;
    console.log('Base de données vide, synchronisation initiale...');

    try {
      const syncUrl = `${supabaseUrl}/functions/v1/sync-defibrillators`;
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Synchronisation terminée:', result);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      isSyncing = false;
    }
  }
}

export async function fetchDefibrillators() {
  try {
    await syncDataIfNeeded();

    const { data, error } = await supabase
      .from('defibrillators')
      .select('*')
      .order('ville', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des défibrillateurs:', error);
      return [];
    }

    return (data || []).map(d => ({
      id: d.id,
      nom: d.nom,
      adresse: d.adresse,
      ville: d.ville,
      code_postal: d.code_postal,
      latitude: parseFloat(d.latitude),
      longitude: parseFloat(d.longitude),
      acces: d.acces,
      disponibilite: d.disponibilite,
      tel: d.tel,
    }));
  } catch (error) {
    console.error('Erreur dans fetchDefibrillators:', error);
    return [];
  }
}

export function filterDefibrillators(defibrillators, searchTerm) {
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
