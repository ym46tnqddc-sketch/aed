# AED MAP

Application interactive pour localiser les défibrillateurs automatiques externes (DAE) en France.

## Structure du Projet

```
.
├── frontend/          # Application frontend React
│   ├── public/        # Assets statiques (HTML, CSS)
│   ├── src/           # Code source
│   │   ├── components/  # Composants React (JSX)
│   │   ├── services/    # Services API
│   │   └── types/       # Types de données
│   ├── package.json   # Dépendances frontend
│   └── .env           # Variables d'environnement frontend
│
└── backend/           # Backend Supabase
    ├── supabase/      # Configuration Supabase
    │   ├── migrations/  # Migrations de base de données
    │   └── functions/   # Edge Functions
    ├── .env           # Variables d'environnement backend
    └── README.md      # Documentation backend
```

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### Backend

Le backend utilise Supabase. La configuration se trouve dans le répertoire `backend/`.

- Migrations de la base de données : `backend/supabase/migrations/`
- Edge Functions : `backend/supabase/functions/`

## Fonctionnalités

- Carte interactive des emplacements de DAE
- Recherche par ville, code postal ou adresse
- Design responsive à thème médical
- Données provenant de data.gouv.fr via le backend Supabase

## Technologies

**Frontend:**
- React 18
- Vite
- CSS vanilla
- JSX (JavaScript)
- Supabase Client

**Backend:**
- Supabase (base de données PostgreSQL)
- Edge Functions (Deno runtime)
- Row Level Security (RLS)
