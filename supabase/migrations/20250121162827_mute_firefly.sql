/*
  # Add is_sold column to listings table

  1. Changes
    - Add `is_sold` boolean column to listings table with default value false
    - Update existing rows to have is_sold = false
    - Add index on is_sold for better query performance

  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'is_sold'
  ) THEN
    ALTER TABLE listings 
    ADD COLUMN is_sold boolean NOT NULL DEFAULT false;

    CREATE INDEX idx_listings_is_sold ON listings(is_sold);
  END IF;
END $$;