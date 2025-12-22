-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES
create type user_role as enum ('admin', 'operations_manager', 'compliance_officer', 'finance', 'customer', 'driver');

-- PROFILES (Extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role user_role default 'customer',
  organization_id uuid, -- For multi-tenant or customer grouping if needed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CUSTOMERS
create table customers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  contact_person text,
  email text,
  phone text,
  address text,
  tax_id text,
  credit_limit numeric(12,2) default 0,
  payment_terms text, -- e.g., 'Net 30'
  is_active boolean default true,
  created_at timestamptz default now()
);

-- CONTRACTS
create table contracts (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references customers(id),
  start_date date not null,
  end_date date not null,
  status text check (status in ('active', 'expired', 'terminated')),
  terms_conditions text,
  rates_json jsonb, -- Flexible structure for agreed rates
  created_at timestamptz default now()
);

-- VEHICLES
create table vehicles (
  id uuid default uuid_generate_v4() primary key,
  registration_number text not null unique,
  type text, -- e.g., 'Truck', 'Trailer'
  capacity_weight numeric,
  capacity_volume numeric,
  status text default 'available', -- 'available', 'in_transit', 'maintenance'
  fitness_expiry date,
  insurance_expiry date,
  created_at timestamptz default now()
);

-- DRIVERS
create table drivers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  license_number text not null unique,
  license_expiry date,
  phone text,
  status text default 'available',
  created_at timestamptz default now()
);

-- LOCATIONS / ROUTES (Mocked geo data for now)
create table routes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  origin_name text not null,
  destination_name text not null,
  distance_km numeric,
  checkpoints_json jsonb, -- List of approved checkpoints
  approved_corridors_json jsonb, -- GeoJSON or list of coords
  created_at timestamptz default now()
);

-- SHIPMENTS
create type shipment_status as enum ('pending', 'approved', 'in_transit', 'customs_hold', 'cleared', 'delivered', 'cancelled');
create table shipments (
  id uuid default uuid_generate_v4() primary key,
  shipment_id text not null unique, -- Human readable ID e.g. TRK-2024-001
  customer_id uuid references customers(id),
  contract_id uuid references contracts(id),
  
  -- Origin/Dest
  origin text not null,
  destination text not null,
  route_id uuid references routes(id),
  
  -- Cargo Details
  commodity text,
  hs_code text,
  weight numeric,
  packages integer,
  container_number text,
  
  -- Transport
  vehicle_id uuid references vehicles(id),
  driver_id uuid references drivers(id),
  
  -- Plan
  eta timestamptz,
  etd timestamptz,
  pld timestamptz, -- Planned Delivery
  
  -- Finance/Terms
  incoterms text,
  insurance_policy text,
  
  status shipment_status default 'pending',
  
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- DOCUMENTS (Permits, etc.)
create table shipment_documents (
  id uuid default uuid_generate_v4() primary key,
  shipment_id uuid references shipments(id) on delete cascade,
  type text not null, -- 'permit', 'invoice', 'packing_list', 'gd'
  document_number text,
  file_url text not null,
  expiry_date date,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  uploaded_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- SEALS
create table seals (
  id uuid default uuid_generate_v4() primary key,
  seal_number text not null unique,
  type text, -- 'electronic', 'mechanical'
  status text default 'available', -- 'available', 'applied', 'broken'
  created_at timestamptz default now()
);

-- SEAL EVENTS (Tracking seal integrity)
create table seal_events (
  id uuid default uuid_generate_v4() primary key,
  seal_id uuid references seals(id),
  shipment_id uuid references shipments(id),
  event_type text not null, -- 'applied', 'verified', 'tampered', 'removed'
  location text,
  description text,
  photo_url text, -- Evidence
  occurred_at timestamptz default now(),
  reported_by uuid references profiles(id)
);

-- INCIDENTS
create table incidents (
  id uuid default uuid_generate_v4() primary key,
  shipment_id uuid references shipments(id),
  type text not null, -- 'delay', 'breakdown', 'accident', 'route_deviation'
  severity text, -- 'low', 'medium', 'high', 'critical'
  description text,
  status text default 'open',
  resolution_notes text,
  created_at timestamptz default now()
);

-- INVOICES
create table invoices (
  id uuid default uuid_generate_v4() primary key,
  shipment_id uuid references shipments(id),
  customer_id uuid references customers(id),
  amount numeric(12,2) not null,
  status text default 'draft', -- 'draft', 'issued', 'paid', 'overdue'
  due_date date,
  items_json jsonb, -- Line items
  created_at timestamptz default now()
);

-- RLS POLICIES (Simple version for now)
alter table shipments enable row level security;
create policy "Allow all for now" on shipments for all using (true); -- TODO: Tighten this later

alter table customers enable row level security;
create policy "Allow all for now customers" on customers for all using (true);

-- Functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;
