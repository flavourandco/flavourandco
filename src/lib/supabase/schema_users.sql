-- Supabase SQL Migration Script for Flavour & Co. Users Table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE IF NOT EXISTS public.users (
  clerk_user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users to their own profile
CREATE POLICY "Allow users to read own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = clerk_user_id);

-- Service role bypasses RLS automatically for backend operations
