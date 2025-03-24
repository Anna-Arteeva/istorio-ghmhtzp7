/*
  # Create Info Cards Table
  
  1. New Tables
    - `info_cards`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `active_days` (integer, not null)
      - `content_json` (jsonb, stores content in different languages)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
  
  2. Security
    - Enable RLS on `info_cards` table
    - Add policy for authenticated users to read info cards
*/

CREATE TABLE IF NOT EXISTS info_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  active_days integer NOT NULL,
  content_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE info_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read info cards"
  ON info_cards
  FOR SELECT
  TO public
  USING (true);

-- Create an example info card
INSERT INTO info_cards (name, active_days, content_json) VALUES
('welcome_card', 1, '{
  "en": {
    "title": "Welcome to Language Learning!",
    "description": "Start your journey by exploring stories and saving phrases you want to learn."
  },
  "es": {
    "title": "¡Bienvenido al Aprendizaje de Idiomas!",
    "description": "Comienza tu viaje explorando historias y guardando frases que quieras aprender."
  },
  "fr": {
    "title": "Bienvenue dans l''Apprentissage des Langues !",
    "description": "Commencez votre voyage en explorant des histoires et en sauvegardant les phrases que vous souhaitez apprendre."
  }
}');