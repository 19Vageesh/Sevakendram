/*
  # Create notices table for admin announcements

  1. New Tables
    - `notices`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notices` table
    - Add policies for:
      - Everyone can read active notices
      - Only admins can manage notices
*/

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Everyone can read active notices
CREATE POLICY "Anyone can read active notices"
  ON notices
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can read all notices
CREATE POLICY "Admins can read all notices"
  ON notices
  FOR SELECT
  TO authenticated
  USING (
    auth.email() = 'nigga@student.nitw.ac.in'
  );

-- Only admins can insert notices
CREATE POLICY "Only admins can create notices"
  ON notices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.email() = 'nigga@student.nitw.ac.in'
  );

-- Only admins can update notices
CREATE POLICY "Only admins can update notices"
  ON notices
  FOR UPDATE
  TO authenticated
  USING (
    auth.email() = 'nigga@student.nitw.ac.in'
  );

-- Only admins can delete notices
CREATE POLICY "Only admins can delete notices"
  ON notices
  FOR DELETE
  TO authenticated
  USING (
    auth.email() = 'nigga@student.nitw.ac.in'
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notices_is_active ON notices(is_active);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);