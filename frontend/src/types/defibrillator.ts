export interface Defibrillator {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  latitude: number;
  longitude: number;
  acces?: string;
  disponibilite?: string;
  tel?: string;
}
