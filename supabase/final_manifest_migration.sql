-- Final migration to ensure ALL Carrier Manifest fields exist
-- Run this to fix "Unable to save manifest" errors permanently.

-- 1. Ensure Types
DO $$ BEGIN
    CREATE TYPE manifest_type AS ENUM ('LINEHAUL', 'DELIVERY', 'RTO', 'VENDOR', 'CONTAINER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add ALL missing columns (Idempotent)
ALTER TABLE carrier_manifests 
-- Basic
ADD COLUMN IF NOT EXISTS manifest_type text DEFAULT 'LINEHAUL',
ADD COLUMN IF NOT EXISTS manifest_number text,
ADD COLUMN IF NOT EXISTS origin_hub text,
ADD COLUMN IF NOT EXISTS destination_hub text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'DRAFT',
ADD COLUMN IF NOT EXISTS route_name text,
ADD COLUMN IF NOT EXISTS dispatch_date_time timestamptz,
ADD COLUMN IF NOT EXISTS expected_arrival_date_time timestamptz,
ADD COLUMN IF NOT EXISTS remarks text,

-- Driver
ADD COLUMN IF NOT EXISTS driver_name text,
ADD COLUMN IF NOT EXISTS driver_cnic text,
ADD COLUMN IF NOT EXISTS driver_mobile text,
ADD COLUMN IF NOT EXISTS driver_license_no text,
ADD COLUMN IF NOT EXISTS driver_license_expiry date,
ADD COLUMN IF NOT EXISTS driver_address text,
ADD COLUMN IF NOT EXISTS driver_emergency_contact text,

-- Vehicle
ADD COLUMN IF NOT EXISTS vehicle_reg_no text,
ADD COLUMN IF NOT EXISTS vehicle_type text,
ADD COLUMN IF NOT EXISTS vehicle_make text,
ADD COLUMN IF NOT EXISTS vehicle_model text,
ADD COLUMN IF NOT EXISTS vehicle_year text,
ADD COLUMN IF NOT EXISTS engine_no text,
ADD COLUMN IF NOT EXISTS chassis_no text,
ADD COLUMN IF NOT EXISTS vehicle_insurance_expiry date,
ADD COLUMN IF NOT EXISTS tracker_id text,
ADD COLUMN IF NOT EXISTS carrier_name text,
ADD COLUMN IF NOT EXISTS carrier_phone text,

-- Customs
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

-- Maritime
ADD COLUMN IF NOT EXISTS vessel_name text,
ADD COLUMN IF NOT EXISTS voyage_number text,
ADD COLUMN IF NOT EXISTS port_of_loading text,
ADD COLUMN IF NOT EXISTS port_of_discharge text,

-- Cargo
ADD COLUMN IF NOT EXISTS pkg_count numeric,
ADD COLUMN IF NOT EXISTS pkg_type text,
ADD COLUMN IF NOT EXISTS gross_weight numeric,
ADD COLUMN IF NOT EXISTS net_weight numeric,
ADD COLUMN IF NOT EXISTS volume_cbm numeric,
ADD COLUMN IF NOT EXISTS commodity_description text,
ADD COLUMN IF NOT EXISTS hs_code text,

-- Parties
ADD COLUMN IF NOT EXISTS consignee_name text,
ADD COLUMN IF NOT EXISTS consignee_phone text,
ADD COLUMN IF NOT EXISTS consignee_address text,
ADD COLUMN IF NOT EXISTS shipper_name text,
ADD COLUMN IF NOT EXISTS shipper_phone text,
ADD COLUMN IF NOT EXISTS clearing_agent_name text,
ADD COLUMN IF NOT EXISTS clearing_agent_phone text,
ADD COLUMN IF NOT EXISTS clearing_agent_ntn text;

-- 3. Fix Permissions
ALTER TABLE carrier_manifests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for demo" ON carrier_manifests;
CREATE POLICY "Allow all for demo" ON carrier_manifests 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);
