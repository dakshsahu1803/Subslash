-- SubSlash Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- Table 1: uploads
-- Tracks uploaded bank statement PDFs
-- ============================================
create table uploads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  file_name text not null,
  file_url text not null,
  status text not null default 'processing'
    check (status in ('processing', 'done', 'error')),
  session_id text not null
);

create index idx_uploads_session_id on uploads(session_id);

-- ============================================
-- Table 2: subscriptions
-- Detected recurring subscriptions from statements
-- ============================================
create table subscriptions (
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
    check (category in ('entertainment', 'productivity', 'fitness', 'food', 'other')),
  is_forgotten boolean not null default false,
  logo_url text,
  cancel_url text
);

create index idx_subscriptions_upload_id on subscriptions(upload_id);

-- ============================================
-- Table 3: ai_analysis
-- AI-generated analysis and savings recommendations
-- ============================================
create table ai_analysis (
  id uuid primary key default uuid_generate_v4(),
  upload_id uuid not null references uploads(id) on delete cascade,
  total_monthly_burn numeric not null default 0,
  potential_savings numeric not null default 0,
  summary text not null default '',
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

create index idx_ai_analysis_upload_id on ai_analysis(upload_id);

-- ============================================
-- Storage bucket for PDF uploads
-- ============================================
-- Create a storage bucket called 'statements' in Supabase Dashboard:
-- Storage → New Bucket → Name: "statements" → Public: OFF

-- RLS Policies (permissive for this no-auth personal project)
alter table uploads enable row level security;
alter table subscriptions enable row level security;
alter table ai_analysis enable row level security;

create policy "Allow all on uploads" on uploads for all using (true) with check (true);
create policy "Allow all on subscriptions" on subscriptions for all using (true) with check (true);
create policy "Allow all on ai_analysis" on ai_analysis for all using (true) with check (true);
