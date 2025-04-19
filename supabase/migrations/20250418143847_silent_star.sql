/*
  # Initial schema setup for blog application

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `username` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `website` (text)
      - `created_at` (timestamp)
    - `blogs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author_id` (uuid, foreign key to profiles.id)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and public access
*/

-- Create profiles table to store user profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create blogs table to store blog posts
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policies for blogs table
CREATE POLICY "Blogs are viewable by everyone"
  ON blogs
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own blogs"
  ON blogs
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blogs"
  ON blogs
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blogs"
  ON blogs
  FOR DELETE
  USING (auth.uid() = author_id);