# AED MAP

Interactive application for locating automated external defibrillators (AEDs) across France.

## Project Structure

```
.
├── frontend/          # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
│
└── backend/          # Supabase backend
    ├── supabase/     # Supabase configuration
    │   ├── migrations/  # Database migrations
    │   └── functions/   # Edge functions
    └── .env          # Backend environment variables
```

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

The backend uses Supabase. Configuration is in the `backend/` directory.

- Database migrations are in `backend/supabase/migrations/`
- Edge functions are in `backend/supabase/functions/`

## Features

- Real-time AED location mapping
- Search by city, postal code, or address
- Medical-themed responsive design
- Data sourced from data.gouv.fr via Supabase backend

## Technology

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase Client

**Backend:**
- Supabase (PostgreSQL database)
- Edge Functions (Deno runtime)
- Row Level Security (RLS)
