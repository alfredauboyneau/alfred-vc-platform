-- ============================================================
-- SCHÉMA SUPABASE — DealFlow (Plateforme VC x Startup)
-- À copier-coller dans l'éditeur SQL de Supabase
-- https://supabase.com/dashboard > SQL Editor
-- ============================================================

-- 1. Table venture_capitals
CREATE TABLE IF NOT EXISTS venture_capitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  sectors TEXT[] DEFAULT '{}',
  stages TEXT[] DEFAULT '{}',
  ticket_min NUMERIC NOT NULL DEFAULT 0,
  ticket_max NUMERIC NOT NULL DEFAULT 0,
  investment_thesis TEXT NOT NULL,
  notable_investments TEXT,
  contact_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table startups
CREATE TABLE IF NOT EXISTS startups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL,
  amount_sought NUMERIC NOT NULL,
  founded_year INTEGER,
  team_size INTEGER,
  -- Données financières
  mrr NUMERIC,
  arr NUMERIC,
  growth_mom NUMERIC,
  burn_rate NUMERIC,
  runway_months INTEGER,
  cac NUMERIC,
  ltv NUMERIC,
  gross_margin NUMERIC,
  active_customers INTEGER,
  revenue_last_year NUMERIC,
  -- Business
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  market_size TEXT,
  traction TEXT,
  pitch_deck_url TEXT,
  -- Auth
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  contact_email TEXT NOT NULL,
  -- Analyse IA
  financial_analysis JSONB,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  vc_id UUID NOT NULL REFERENCES venture_capitals(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  analysis TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'in_discussion', 'closed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(startup_id, vc_id)
);

-- 4. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_matches_startup_id ON matches(startup_id);
CREATE INDEX IF NOT EXISTS idx_matches_vc_id ON matches(vc_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_startups_sector ON startups(sector);
CREATE INDEX IF NOT EXISTS idx_startups_stage ON startups(stage);

-- 5. Row Level Security (RLS)
-- Activez immédiatement le RLS en production.
-- Pour une base déjà existante, appliquez ensuite le fichier `supabase-security.sql`.

ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE venture_capitals ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ✅ Schéma créé avec succès !
-- Prochaine étape : lancer le script de seed des VCs
-- ============================================================
