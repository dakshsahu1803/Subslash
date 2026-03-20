-- SubSlash Database Schema (v2 — Production)
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- Table 1: uploads
-- ============================================
create table if not exists uploads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  file_name text not null,
  file_url text not null,
  status text not null default 'processing'
    check (status in ('processing', 'done', 'error')),
  session_id text not null
);

create index if not exists idx_uploads_session_id on uploads(session_id);

-- ============================================
-- Table 2: subscriptions
-- ============================================
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  upload_id uuid not null references uploads(id) on delete cascade,
  service_name text not null,
  amount numeric not null,
  currency text not null default 'INR',
  billing_cycle text not null default 'monthly'
    check (billing_cycle in ('monthly', 'yearly', 'weekly')),
  last_charged date,
  times_charged integer not null default 1,
  category text not null default 'other'
    check (category in ('entertainment', 'productivity', 'fitness', 'food', 'utilities', 'education', 'other')),
  is_forgotten boolean not null default false,
  logo_url text,
  cancel_url text,
  is_cancelled boolean not null default false,
  next_renewal date,
  price_increased boolean not null default false,
  original_amount numeric,
  is_manually_added boolean not null default false,
  notes text,
  lifetime_spent numeric not null default 0,
  session_id text,
  confidence text default 'medium'
    check (confidence in ('high', 'medium', 'low'))
);

create index if not exists idx_subscriptions_upload_id on subscriptions(upload_id);
create index if not exists idx_subscriptions_session_id on subscriptions(session_id);

-- ============================================
-- Table 3: ai_analysis
-- ============================================
create table if not exists ai_analysis (
  id uuid primary key default uuid_generate_v4(),
  upload_id uuid not null references uploads(id) on delete cascade,
  total_monthly_burn numeric not null default 0,
  potential_savings numeric not null default 0,
  summary text not null default '',
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  duplicate_groups jsonb default '[]'::jsonb,
  category_breakdown jsonb default '{}'::jsonb,
  total_yearly_projection numeric not null default 0,
  potential_yearly_savings numeric not null default 0,
  top_recommendation text default ''
);

create index if not exists idx_ai_analysis_upload_id on ai_analysis(upload_id);

-- ============================================
-- Table 4: notifications
-- ============================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  type text not null
    check (type in ('renewal_reminder', 'forgotten_alert', 'price_increase', 'savings_tip', 'trial_expiry', 'audit_reminder')),
  title text not null,
  message text not null,
  service_name text,
  is_read boolean not null default false,
  created_at timestamp with time zone default now(),
  unique(session_id, service_name, type)
);

create index if not exists idx_notifications_session_id on notifications(session_id);

-- ============================================
-- Table 5: feedback
-- ============================================
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text,
  email text,
  topic text,
  message text
);

-- ============================================
-- Storage bucket for PDF uploads
-- ============================================
-- Create a storage bucket called 'statements' in Supabase Dashboard:
-- Storage -> New Bucket -> Name: "statements" -> Public: OFF

-- RLS Policies (permissive for this no-auth personal project)
alter table uploads enable row level security;
alter table subscriptions enable row level security;
alter table ai_analysis enable row level security;
alter table notifications enable row level security;
alter table feedback enable row level security;

create policy "Allow all on uploads" on uploads for all using (true) with check (true);
create policy "Allow all on subscriptions" on subscriptions for all using (true) with check (true);
create policy "Allow all on ai_analysis" on ai_analysis for all using (true) with check (true);
create policy "Allow all on notifications" on notifications for all using (true) with check (true);
create policy "Allow all on feedback" on feedback for all using (true) with check (true);
