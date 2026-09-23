-- Migration: 001_create_profiles.sql
-- Description: Create profiles table with accessibility preferences and timestamps

-- Enable pgcrypto extension for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  accessibility_preferences JSONB DEFAULT '{
    "fontSize": "medium",
    "highContrast": false,
    "reducedMotion": false,
    "preferredLanguage": "English",
    "voiceEnabled": false
  }'::jsonb NOT NULL
);

-- Index for case-insensitive email lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles(LOWER(email));

-- Function and trigger to automatically manage updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;

CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Comment descriptions for schema clarity
COMMENT ON TABLE public.profiles IS 'Stores user profiles, credentials, and accessibility preferences for AccessAI';
COMMENT ON COLUMN public.profiles.accessibility_preferences IS 'User preferences for text size, contrast, language, voice, and motion';
