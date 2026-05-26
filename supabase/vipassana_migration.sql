-- Run this in Supabase SQL editor before deploying.
-- Creates 4 tables for the /vipassana chat proxy.

create table if not exists vipassana_conversations (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  intent text,
  follow_up_priority int default 0,
  summary text,
  ip text,
  user_agent text,
  created_at timestamptz default now(),
  last_message_at timestamptz default now()
);

create index if not exists vipassana_conversations_priority_idx
  on vipassana_conversations(follow_up_priority desc, last_message_at desc);

create index if not exists vipassana_conversations_email_idx
  on vipassana_conversations(email);

create table if not exists vipassana_messages (
  id bigserial primary key,
  conversation_id uuid references vipassana_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists vipassana_messages_conv_idx
  on vipassana_messages(conversation_id, created_at);

create table if not exists vipassana_rate_limit (
  ip text not null,
  day date not null,
  count int not null default 0,
  updated_at timestamptz default now(),
  primary key (ip, day)
);

create table if not exists vipassana_cost_tracker (
  id int primary key,
  inr_total numeric not null default 0,
  updated_at timestamptz default now()
);

insert into vipassana_cost_tracker (id, inr_total)
values (1, 0)
on conflict (id) do nothing;
