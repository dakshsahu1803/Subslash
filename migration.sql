-- SubSlash Migration: v1 -> v2
-- Run this on your EXISTING database to add new columns and tables.
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS patterns).

-- ============================================
-- Alter subscriptions table — new columns
-- ============================================
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS is_cancelled boolean NOT NULL DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS next_renewal date;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS price_increased boolean NOT NULL DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS original_amount numeric;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS is_manually_added boolean NOT NULL DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS lifetime_spent numeric NOT NULL DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS confidence text DEFAULT 'medium';

-- Update the category CHECK constraint to allow new values
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_category_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_category_check
  CHECK (category IN ('entertainment', 'productivity', 'fitness', 'food', 'utilities', 'education', 'other'));

-- Add confidence CHECK
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_confidence_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_confidence_check
  CHECK (confidence IN ('high', 'medium', 'low'));

CREATE INDEX IF NOT EXISTS idx_subscriptions_session_id ON subscriptions(session_id);

-- ============================================
-- Alter ai_analysis table — new columns
-- ============================================
ALTER TABLE ai_analysis ADD COLUMN IF NOT EXISTS duplicate_groups jsonb DEFAULT '[]'::jsonb;
ALTER TABLE ai_analysis ADD COLUMN IF NOT EXISTS category_breakdown jsonb DEFAULT '{}'::jsonb;
ALTER TABLE ai_analysis ADD COLUMN IF NOT EXISTS total_yearly_projection numeric NOT NULL DEFAULT 0;
ALTER TABLE ai_analysis ADD COLUMN IF NOT EXISTS potential_yearly_savings numeric NOT NULL DEFAULT 0;
ALTER TABLE ai_analysis ADD COLUMN IF NOT EXISTS top_recommendation text DEFAULT '';

-- ============================================
-- New table: notifications
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  type text NOT NULL
    CHECK (type IN ('renewal_reminder', 'forgotten_alert', 'price_increase', 'savings_tip', 'trial_expiry', 'audit_reminder')),
  title text NOT NULL,
  message text NOT NULL,
  service_name text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(session_id, service_name, type)
);

CREATE INDEX IF NOT EXISTS idx_notifications_session_id ON notifications(session_id);

-- ============================================
-- New table: feedback
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  name text,
  email text,
  topic text,
  message text
);

-- ============================================
-- RLS for new tables
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow all on notifications') THEN
    CREATE POLICY "Allow all on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'Allow all on feedback') THEN
    CREATE POLICY "Allow all on feedback" ON feedback FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
