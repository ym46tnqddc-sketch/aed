import { createClient } from '@supabase/supabase-js';
import type { Defibrillator } from '../types/defibrillator';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

let isSyncing = false;

async function syncDataIfNeeded(): Promise<void> {
  if (isSyncing) return;

  const { count } = await supabase
    .from('defibrillators')
    .select('*', { count: 'exact', head: true });

  if (count === 0 && !isSyncing) {
    isSyncing = true;
    console.log('Database empty, triggering initial sync...');

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
        console.log('Sync completed:', result);
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      isSyncing = false;
    }
  }
}

export async function fetchDefibrillators(): Promise<Defibrillator[]> {
  try {
    await syncDataIfNeeded();

    const { data, error } = await supabase
      .from('defibrillators')
      .select('*')
      .order('ville', { ascending: true });

    if (error) {
      console.error('Error fetching defibrillators:', error);
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
    console.error('Error in fetchDefibrillators:', error);
    return [];
  }
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
