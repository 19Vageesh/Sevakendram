/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - phone_number (text)
      - created_at (timestamp)
    - messages
      - id (uuid, primary key)
      - content (text)
      - sender_id (uuid, references users)
      - receiver_id (uuid, references users)
      - created_at (timestamp)
    - complaints
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - name (text)
      - roll_number (text)
      - phone_number (text)
      - room_number (text)
      - complaint (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sender_id uuid REFERENCES users(id) NOT NULL,
  receiver_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  roll_number text NOT NULL,
  phone_number text NOT NULL,
  room_number text NOT NULL,
  complaint text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Messages policies
CREATE POLICY "Users can read their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert their messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Complaints policies
CREATE POLICY "Users can read own complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);