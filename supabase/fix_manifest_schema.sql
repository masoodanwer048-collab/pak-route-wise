-- Migration to fix carrier_manifests table schema and permissions
-- Run this in your Supabase SQL Editor to fix "Could not find the carrier_name column" error

-- 1. Ensure Types Exist
DO $$ BEGIN
    CREATE TYPE manifest_type AS ENUM ('LINEHAUL', 'DELIVERY', 'RTO', 'VENDOR', 'CONTAINER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add Missing Columns (Idempotent)
ALTER TABLE carrier_manifests 
ADD COLUMN IF NOT EXISTS manifest_type text DEFAULT 'LINEHAUL',
ADD COLUMN IF NOT EXISTS carrier_name text,
ADD COLUMN IF NOT EXISTS carrier_phone text,
ADD COLUMN IF NOT EXISTS carrier_id text,
ADD COLUMN IF NOT EXISTS gd_number text,
ADD COLUMN IF NOT EXISTS gd_date date,
ADD COLUMN IF NOT EXISTS igm_number text,
ADD COLUMN IF NOT EXISTS ngm_number text,
ADD COLUMN IF NOT EXISTS index_number text,
ADD COLUMN IF NOT EXISTS bl_number text,
ADD COLUMN IF NOT EXISTS shipping_bill_number text,
ADD COLUMN IF NOT EXISTS container_no text,
ADD COLUMN IF NOT EXISTS container_size text,
ADD COLUMN IF NOT EXISTS container_type text,
ADD COLUMN IF NOT EXISTS seal_no text,
ADD COLUMN IF NOT EXISTS pkg_count numeric,
ADD COLUMN IF NOT EXISTS pkg_type text,
ADD COLUMN IF NOT EXISTS gross_weight numeric,
ADD COLUMN IF NOT EXISTS net_weight numeric,
ADD COLUMN IF NOT EXISTS volume_cbm numeric,
ADD COLUMN IF NOT EXISTS commodity_description text,
ADD COLUMN IF NOT EXISTS hs_code text,
ADD COLUMN IF NOT EXISTS vessel_name text,
ADD COLUMN IF NOT EXISTS voyage_number text,
ADD COLUMN IF NOT EXISTS port_of_loading text,
ADD COLUMN IF NOT EXISTS port_of_discharge text,
ADD COLUMN IF NOT EXISTS consignee_name text,
ADD COLUMN IF NOT EXISTS consignee_phone text,
ADD COLUMN IF NOT EXISTS consignee_address text,
ADD COLUMN IF NOT EXISTS shipper_name text,
ADD COLUMN IF NOT EXISTS shipper_phone text,
ADD COLUMN IF NOT EXISTS clearing_agent_name text,
ADD COLUMN IF NOT EXISTS clearing_agent_phone text,
ADD COLUMN IF NOT EXISTS clearing_agent_ntn text,
ADD COLUMN IF NOT EXISTS remarks text,
ADD COLUMN IF NOT EXISTS driver_address text,
ADD COLUMN IF NOT EXISTS driver_emergency_contact text,
ADD COLUMN IF NOT EXISTS driver_license_expiry date,
ADD COLUMN IF NOT EXISTS vehicle_insurance_expiry date,
ADD COLUMN IF NOT EXISTS tracker_id text;

-- 3. Fix Permissions (Allow Demo/Anon access)
ALTER TABLE carrier_manifests ENABLE ROW LEVEL SECURITY;

-- Drop restrictive policies if they exist
DROP POLICY IF EXISTS "Enable all for authenticated" ON carrier_manifests;
DROP POLICY IF EXISTS "Ops Full Access" ON carrier_manifests;
DROP POLICY IF EXISTS "Allow all for demo" ON carrier_manifests;

-- Add permissive policy for Demo/Dev environment
CREATE POLICY "Allow all for demo" ON carrier_manifests 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 4. Refresh Schema Cache (Instruction only - usually automatic)
-- NOTIFY pgrst, 'reload config'; 
