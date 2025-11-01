# AED MAP - Frontend

Application React pour localiser les défibrillateurs automatiques externes (DAE) en France.

## Fonctionnalités

- Carte interactive affichant les emplacements des DAE
- Recherche par ville, code postal ou adresse
- Design responsive avec thème médical
- Données en temps réel depuis Supabase

## Technologies

- React 18
- Vite
- CSS vanilla
- JSX (JavaScript)
- Supabase Client

## Développement

```bash
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Variables d'Environnement

Le fichier `.env` contient :

```
VITE_SUPABASE_URL=url_supabase
VITE_SUPABASE_SUPABASE_ANON_KEY=clé_anonyme_supabase
```
