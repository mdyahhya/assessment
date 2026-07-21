-- ============================================================
-- AjaiaDoc — Database Setup & Initial Seed
-- Clean SQL Migration for Supabase Postgres
-- ============================================================

-- 1. Create Core Database Tables
------------------------------------------------------------
create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default 'Untitled Document',
  content     jsonb default '{}'::jsonb,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.document_shares (
  id                  uuid primary key default gen_random_uuid(),
  document_id         uuid not null references public.documents(id) on delete cascade,
  shared_with_email   text not null,
  role                text not null check (role in ('viewer', 'editor')),
  created_at          timestamptz default now(),
  unique (document_id, shared_with_email)
);

create table if not exists public.document_versions (
  id              uuid primary key default gen_random_uuid(),
  document_id     uuid not null references public.documents(id) on delete cascade,
  version_number  integer not null default 1,
  title           text not null,
  content         jsonb not null default '{}'::jsonb,
  created_at      timestamptz default now()
);


-- 2. Configure Row Level Security (RLS) & Access Policies
------------------------------------------------------------
alter table public.documents         enable row level security;
alter table public.document_shares   enable row level security;
alter table public.document_versions enable row level security;

-- Documents: Owner Access (Full Control)
create policy "owner_documents_access" on public.documents
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Documents: Shared Read Access
create policy "shared_documents_read" on public.documents
  for select to authenticated
  using (
    exists (
      select 1 from public.document_shares
      where document_id = id
        and shared_with_email = (auth.jwt() ->> 'email')
    )
  );

-- Documents: Shared Editor Update Access
create policy "shared_documents_update" on public.documents
  for update to authenticated
  using (
    exists (
      select 1 from public.document_shares
      where document_id = id
        and shared_with_email = (auth.jwt() ->> 'email')
        and role = 'editor'
    )
  );

-- Document Shares: Owner Access
create policy "owner_manage_shares" on public.document_shares
  for all to authenticated
  using (
    exists (
      select 1 from public.documents
      where id = document_id and owner_id = auth.uid()
    )
  );

-- Document Shares: Recipient Read Access
create policy "recipient_view_shares" on public.document_shares
  for select to authenticated
  using (shared_with_email = (auth.jwt() ->> 'email'));

-- Document Versions: Owner & Editor Access
create policy "owner_manage_versions" on public.document_versions
  for all to authenticated
  using (
    exists (
      select 1 from public.documents
      where id = document_id and owner_id = auth.uid()
    )
  );

create policy "shared_user_read_versions" on public.document_versions
  for select to authenticated
  using (
    exists (
      select 1 from public.document_shares
      where document_id = document_id
        and shared_with_email = (auth.jwt() ->> 'email')
    )
  );


-- 3. Seed Pre-Confirmed Reviewer Test Accounts
------------------------------------------------------------
create extension if not exists pgcrypto with schema extensions;

-- Remove existing test users if present
delete from auth.users where email in ('user1@test.com', 'user2@test.com');

-- Seed User 1 (Document Owner)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated', 'user1@test.com',
  extensions.crypt('123456', extensions.gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);

-- Seed User 2 (Collaborator)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated', 'authenticated', 'user2@test.com',
  extensions.crypt('123456', extensions.gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
);

-- Seed Auth Identities
insert into auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) values 
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub":"11111111-1111-1111-1111-111111111111","email":"user1@test.com"}',
  'email', now(), now(), now()
),
(
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '{"sub":"22222222-2222-2222-2222-222222222222","email":"user2@test.com"}',
  'email', now(), now(), now()
);


-- 4. Seed Initial Sample Documents
------------------------------------------------------------
insert into public.documents (id, title, content, owner_id, created_at, updated_at)
values (
  'a1111111-1111-1111-1111-111111111111',
  'Welcome to AjaiaDoc 🚀',
  '{"type":"doc","content":[
    {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Welcome to AjaiaDoc"}]},
    {"type":"paragraph","content":[{"type":"text","text":"A lightweight collaborative document editor built for the Ajaia LLC Full Stack Product Engineer assessment by Yahya Mundewadi."}]},
    {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Key Features"}]},
    {"type":"bulletList","content":[
      {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Rich text formatting (Bold, Italic, Headings, Lists, Quotes)"}]}]},
      {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"File import (.txt and .md)"}]}]},
      {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Sharing with Viewer and Editor roles"}]}]},
      {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Version history with one-click restore"}]}]},
      {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"PDF and Markdown export"}]}]}
    ]}
  ]}'::jsonb,
  '11111111-1111-1111-1111-111111111111',
  now(), now()
) on conflict (id) do nothing;

insert into public.documents (id, title, content, owner_id, created_at, updated_at)
values (
  'b2222222-2222-2222-2222-222222222222',
  'Shared Project Specs',
  '{"type":"doc","content":[
    {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Shared Project Specs"}]},
    {"type":"paragraph","content":[{"type":"text","text":"This document is owned by user1@test.com and shared with user2@test.com as an Editor."}]},
    {"type":"paragraph","content":[{"type":"text","text":"Sign in as user2@test.com to find this in the Shared with Me tab and edit it!"}]}
  ]}'::jsonb,
  '11111111-1111-1111-1111-111111111111',
  now(), now()
) on conflict (id) do nothing;

insert into public.document_shares (document_id, shared_with_email, role)
values ('b2222222-2222-2222-2222-222222222222', 'user2@test.com', 'editor')
on conflict (document_id, shared_with_email) do nothing;
