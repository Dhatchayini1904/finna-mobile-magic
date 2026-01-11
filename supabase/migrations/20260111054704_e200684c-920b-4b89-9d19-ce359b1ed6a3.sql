-- Add onboarding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_income DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS risk_profile TEXT CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
ADD COLUMN IF NOT EXISTS financial_goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta')),
ADD COLUMN IF NOT EXISTS voice_enabled BOOLEAN DEFAULT true;