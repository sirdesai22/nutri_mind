-- Migration for existing NutriMind projects: add trial support
-- Run in Supabase SQL Editor if your profiles table lacks trial_started_at

-- Add trial_started_at if missing
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT NOW();

-- Update subscription_status CHECK to include 'trial'
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_status_check
  CHECK (subscription_status IN ('none', 'trial', 'lifetime'));

-- Set existing users with 'none' to 'trial' and backfill trial_started_at from created_at
UPDATE public.profiles
SET
  subscription_status = 'trial',
  trial_started_at = COALESCE(trial_started_at, created_at, NOW())
WHERE subscription_status = 'none' OR trial_started_at IS NULL;
