-- ═══════════════════════════════════════════════════════
--  NEXUS NFC v3 — SUPABASE SQL SCHEMA
--  Ejecuta completo en SQL Editor de Supabase
-- ═══════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  email         TEXT,
  avatar_url    TEXT,
  avatar_emoji  TEXT DEFAULT '🚀',
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','enterprise')),
  domain_mode   TEXT NOT NULL DEFAULT 'path' CHECK (domain_mode IN ('path','subdomain')),
  custom_domain TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Cards ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  type            TEXT NOT NULL DEFAULT 'personal' CHECK (type IN (
    'personal','business','portfolio','restaurant','medical',
    'academic','event','product','blank',
    'gamer','fitness','creator','access'
  )),
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active','draft','archived')),
  theme           TEXT DEFAULT 'dark-nexus',
  blocks          JSONB DEFAULT '[]'::jsonb,
  settings        JSONB DEFAULT '{
    "save_contact_btn": true,
    "analytics_enabled": true,
    "whatsapp_button": true,
    "whatsapp_message": null,
    "auto_dark_mode": true,
    "animations": true,
    "seo_enabled": true,
    "password_protected": false,
    "show_emergency_banner": false,
    "realtime_enabled": false,
    "show_online_status": false,
    "require_check_in": false,
    "card_style": "dark",
    "profile_layout": "standard",
    "font_style": "outfit"
  }'::jsonb,
  cover_gradient  TEXT DEFAULT 'linear-gradient(135deg,#6366f1,#06ffa5)',
  cover_image_url TEXT,
  full_name       TEXT,
  role            TEXT,
  company         TEXT,
  bio             TEXT,
  avatar_emoji    TEXT DEFAULT '🚀',
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  address         TEXT,
  public_url      TEXT,
  scan_count      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Scans ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id     UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_type TEXT DEFAULT 'other',
  user_agent  TEXT,
  action      TEXT DEFAULT 'viewed',
  referrer    TEXT,
  ip_city     TEXT,
  ip_country  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_type ON cards(type);
CREATE INDEX IF NOT EXISTS idx_scans_card_id ON scans(card_id);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);

-- ─── RLS ──────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans    ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_own"   ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON profiles;
DROP POLICY IF EXISTS "service_role_all"      ON profiles;
CREATE POLICY "profiles_select_own"   ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "service_role_all"      ON profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Cards policies
DROP POLICY IF EXISTS "cards_select_own"      ON cards;
DROP POLICY IF EXISTS "cards_all_own"         ON cards;
DROP POLICY IF EXISTS "cards_public_active"   ON cards;
DROP POLICY IF EXISTS "service_role_cards"    ON cards;
CREATE POLICY "cards_select_own"      ON cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cards_all_own"         ON cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "cards_public_active"   ON cards FOR SELECT USING (status = 'active');
CREATE POLICY "service_role_cards"    ON cards FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Scans policies
DROP POLICY IF EXISTS "scans_own"             ON scans;
DROP POLICY IF EXISTS "service_role_scans"    ON scans;
CREATE POLICY "scans_own"             ON scans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "service_role_scans"    ON scans FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── RPC: increment_scan_count ────────────────────────────
CREATE OR REPLACE FUNCTION increment_scan_count(p_card_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.cards SET scan_count = scan_count + 1 WHERE id = p_card_id;
END;
$$;

-- ─── Trigger: auto-create profile on OAuth ───────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  base_username := lower(regexp_replace(
    coalesce(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'user'),
    '[^a-z0-9]', '-', 'g'
  ));
  base_username := regexp_replace(base_username, '-+', '-', 'g');
  base_username := trim(both '-' from base_username);
  base_username := left(base_username, 20) || '-' || left(replace(NEW.id::text, '-', ''), 6);
  final_username := base_username;
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username);
    counter := counter + 1;
    final_username := base_username || '-' || counter;
  END LOOP;
  INSERT INTO public.profiles (id, user_id, username, full_name, email, avatar_url, avatar_emoji, plan, domain_mode)
  VALUES (
    NEW.id, NEW.id, final_username,
    coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    coalesce(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    '🚀', 'free', 'path'
  ) ON CONFLICT DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── avatar_url column (if not exists) ───────────────────
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ─── Realtime: enable for cards table ────────────────────
-- Permite suscripciones Supabase Realtime (opcional, para WS en el futuro)
ALTER PUBLICATION supabase_realtime ADD TABLE public.cards;

-- ─── Migration: add new visual settings to existing cards ─
-- Ejecutar una vez para rellenar campos nuevos en cards existentes:
/*
UPDATE public.cards
SET settings = settings
  || '{"card_style":"dark","profile_layout":"standard","font_style":"outfit"}'::jsonb
WHERE settings->>'card_style' IS NULL;
*/
