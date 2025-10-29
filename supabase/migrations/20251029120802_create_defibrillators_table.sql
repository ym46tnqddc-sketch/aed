/*
  # Create defibrillators table

  ## Overview
  This migration creates the core table for storing defibrillator (AED) location data across France.
  The data will be populated from data.gouv.fr API to avoid CORS issues.

  ## New Tables
  1. `defibrillators`
     - `id` (uuid, primary key) - Unique identifier for each defibrillator
     - `external_id` (text, unique) - Original ID from data source
     - `nom` (text) - Name/identifier of the location
     - `adresse` (text) - Street address
     - `ville` (text) - City name
     - `code_postal` (text) - Postal code
     - `latitude` (numeric) - Geographic latitude coordinate
     - `longitude` (numeric) - Geographic longitude coordinate
     - `acces` (text, optional) - Access information
     - `disponibilite` (text, optional) - Availability information
     - `tel` (text, optional) - Contact phone number
     - `source_dataset` (text) - Which dataset this came from
     - `created_at` (timestamptz) - When record was created
     - `updated_at` (timestamptz) - When record was last updated

  ## Indexes
  - Geographic coordinates for spatial queries
  - City and postal code for location-based searches
  - External ID for deduplication

  ## Security
  - Enable RLS on `defibrillators` table
  - Add public read policy (defibrillator locations are public safety data)
  - No write access for public users (data managed by edge functions)

  ## Important Notes
  - Data is publicly accessible as it's critical safety information
  - Updates managed via edge functions to ensure data integrity
  - Geographic indexes enable efficient proximity searches
*/

-- Create defibrillators table
CREATE TABLE IF NOT EXISTS defibrillators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE,
  nom text NOT NULL DEFAULT '',
  adresse text NOT NULL DEFAULT '',
  ville text NOT NULL DEFAULT '',
  code_postal text NOT NULL DEFAULT '',
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  acces text DEFAULT '',
  disponibilite text DEFAULT '',
  tel text DEFAULT '',
  source_dataset text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_defibrillators_location ON defibrillators(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_defibrillators_city ON defibrillators(ville);
CREATE INDEX IF NOT EXISTS idx_defibrillators_postal_code ON defibrillators(code_postal);
CREATE INDEX IF NOT EXISTS idx_defibrillators_external_id ON defibrillators(external_id);

-- Enable Row Level Security
ALTER TABLE defibrillators ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (defibrillator locations are public safety data)
CREATE POLICY "Allow public read access to defibrillators"
  ON defibrillators
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policy for service role to insert/update data
CREATE POLICY "Allow service role to manage defibrillators"
  ON defibrillators
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);