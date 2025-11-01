# AED MAP - Backend

Ce répertoire contient l'infrastructure backend de l'application AED MAP.

## Structure

- `supabase/` - Configuration Supabase et edge functions
  - `migrations/` - Migrations de base de données
  - `functions/` - Edge functions pour la synchronisation des données

## Base de Données

L'application utilise Supabase comme base de données et infrastructure backend.

### Tables

- `defibrillators` - Stocke les données de localisation des DAE en France

### Edge Functions

- `sync-defibrillators` - Récupère les données des défibrillateurs depuis data.gouv.fr et les synchronise dans la base de données

## Variables d'Environnement

Le fichier `.env` contient la configuration Supabase :

```
SUPABASE_URL=url_supabase
SUPABASE_ANON_KEY=clé_anonyme_supabase
```
