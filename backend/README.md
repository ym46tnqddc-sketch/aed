# AED MAP - Backend

This directory contains the backend infrastructure for the AED MAP application.

## Structure

- `supabase/` - Supabase configuration and edge functions
  - `migrations/` - Database migrations
  - `functions/` - Edge functions for data synchronization

## Database

The application uses Supabase as its database and backend infrastructure.

### Tables

- `defibrillators` - Stores AED location data across France

### Edge Functions

- `sync-defibrillators` - Fetches defibrillator data from data.gouv.fr and syncs to the database

## Environment Variables

See `.env` file for Supabase configuration.
