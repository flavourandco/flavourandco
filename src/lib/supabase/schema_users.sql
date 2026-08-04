-- Supabase SQL Migration Script for Flavour & Co. Users Table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop previous policies if existing
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.users;
DROP POLICY IF EXISTS "Public Users Select" ON public.users;
DROP POLICY IF EXISTS "Public Users Insert" ON public.users;
DROP POLICY IF EXISTS "Public Users Update" ON public.users;
DROP POLICY IF EXISTS "Public Users Delete" ON public.users;

-- Public & Webhook policies
CREATE POLICY "Public Users Select" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Users Insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Users Update" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Users Delete" ON public.users FOR DELETE USING (true);
