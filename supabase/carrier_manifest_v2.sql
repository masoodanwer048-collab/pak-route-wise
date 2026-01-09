-- Enterprise Carrier Manifest V2 Schema
-- This script reconstructs the carrier_manifests table to support enterprise requirements.

-- 1. Create Necessary ENUMS (Safe creation)
DO $$ BEGIN
    CREATE TYPE manifest_status AS ENUM ('DRAFT', 'LOADING', 'READY_FOR_HANDOVER', 'HANDED_OVER', 'IN_TRANSIT', 'RECEIVED', 'CLOSED', 'CANCELLED', 'REOPENED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE carrier_type AS ENUM ('OWN_FLEET', 'VENDOR', 'BUS_CARGO', 'AIR', '3PL', 'SHIPPING_LINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE manifest_type AS ENUM ('LINEHAUL', 'DELIVERY', 'RTO', 'VENDOR', 'CONTAINER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE container_size AS ENUM ('20FT', '40FT', '40HQ', 'LCL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE container_type AS ENUM ('DRY', 'REEFER', 'OPEN_TOP', 'FLAT_RACK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE security_check_status AS ENUM ('PASSED', 'FAILED', 'PENDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Drop existing table to ensure clean slate (Schema has changed significantly)
DROP TABLE IF EXISTS carrier_manifests CASCADE;

-- 3. Create Comprehensive Table
CREATE TABLE carrier_manifests (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- A) Internal Manifest Fields (System + Workflow)
    manifest_number text NOT NULL UNIQUE,
    manifest_type manifest_type DEFAULT 'LINEHAUL',
    status manifest_status DEFAULT 'DRAFT',
    
    origin_hub text NOT NULL, -- Should be UUID in strict relational DB, keeping text for flexibility as per current app
    destination_hub text NOT NULL,
    route_name text,
    route_code text,
    
    dispatch_date_time timestamptz,
    expected_arrival_date_time timestamptz,
    actual_arrival_date_time timestamptz,
    
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    
    reopen_reason text,
    reopen_approved_by uuid REFERENCES auth.users(id),
    
    cancel_reason text,
    cancelled_by uuid REFERENCES auth.users(id),

    -- B) Carrier + Driver + Vehicle Profile
    carrier_type carrier_type NOT NULL DEFAULT 'OWN_FLEET',
    carrier_name text NOT NULL,
    carrier_id text,
    carrier_phone text,
    carrier_address text,
    
    -- Driver
    driver_name text NOT NULL,
    driver_cnic text NOT NULL, -- Validation in APP
    driver_mobile text,
    driver_license_no text,
    driver_license_expiry date,
    driver_address text,
    driver_emergency_contact text,
    
    helper_name text,
    helper_cnic text,
    helper_mobile text,
    
    driver_signature_url text,
    driver_otp_verified boolean DEFAULT false,
    
    -- Vehicle
    vehicle_reg_no text NOT NULL,
    vehicle_type text,
    vehicle_make text,
    vehicle_model text,
    vehicle_year text,
    vehicle_color text,
    
    engine_no text,
    chassis_no text,
    fitness_cert_no text,
    fitness_expiry date,
    
    vehicle_insurance_company text,
    vehicle_insurance_expiry date,
    
    tracker_id text,
    
    odometer_start numeric,
    odometer_end numeric,
    fuel_level_start numeric, -- Percentage 0-100 or Liters
    fuel_level_end numeric,
    
    vehicle_capacity_weight numeric, -- KG
    vehicle_capacity_volume numeric, -- CBM

    -- C) Customs / Shipping Documentation (Import/Export/Transit)
    gd_number text,
    gd_date date,
    igm_number text,
    ngm_number text,
    index_number text,
    bl_number text,
    shipping_bill_number text,
    
    container_no text, -- Comma separated if multiple or link to separate table
    container_size container_size,
    container_type container_type,
    seal_no text, -- Primary Seal
    
    pkg_count integer DEFAULT 0,
    pkg_type text,
    pkg_marks text,
    
    gross_weight numeric DEFAULT 0,
    net_weight numeric DEFAULT 0,
    volume_cbm numeric DEFAULT 0,
    
    hs_code text,
    commodity_description text,
    
    port_of_loading text,
    port_of_discharge text,
    final_destination text,
    
    vessel_name text,
    voyage_number text,
    shipping_line_name text,
    
    freight_terms text, -- Prepaid / Collect
    insurance_details text,
    
    customs_station_code text,
    
    clearing_agent_name text,
    clearing_agent_phone text,
    clearing_agent_ntn text,
    
    consignee_name text,
    consignee_phone text,
    consignee_address text,
    
    shipper_name text,
    shipper_phone text,
    notify_party text,
    
    remarks text,

    -- D) Trip & Operational Controls
    trip_id text, -- Run sheet ID
    departure_gate text,
    dispatch_shift text, -- Morning/Evening
    
    loading_start_time timestamptz,
    loading_end_time timestamptz,
    
    handover_time timestamptz,
    
    transit_start_time timestamptz,
    transit_stop_time timestamptz,
    
    receiving_start_time timestamptz,
    receiving_end_time timestamptz,

    -- E) Security & Compliance
    security_check_status security_check_status DEFAULT 'PENDING',
    security_guard_name text,
    cctv_reference_id text,
    
    seal_verification_status text, -- MATCHED / TAMPERED
    seal_broken_reason text,
    
    high_value_approval_id text,
    police_escort_required boolean DEFAULT false,

    -- F) Financial & Billing
    carrier_cost numeric DEFAULT 0,
    fuel_cost numeric DEFAULT 0,
    toll_charges numeric DEFAULT 0,
    loading_charges numeric DEFAULT 0,
    other_charges numeric DEFAULT 0,

    -- G) Tracking & Proof
    qr_code text, -- Generated String
    proof_of_handover_url text,
    proof_of_receiving_url text
);

-- 4. Update Shipments Table
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS manifest_id uuid REFERENCES carrier_manifests(id),
ADD COLUMN IF NOT EXISTS manifest_status text DEFAULT 'PENDING_SCAN';

-- 5. Audit Log Table
CREATE TABLE IF NOT EXISTS manifest_audit_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    manifest_id uuid REFERENCES carrier_manifests(id),
    action text NOT NULL,
    performed_by uuid REFERENCES auth.users(id),
    performed_at timestamptz DEFAULT now(),
    details jsonb
);

-- 6. RLS Policies
ALTER TABLE carrier_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifest_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read/write for authenticated users" ON carrier_manifests
    FOR ALL USING (auth.role() = 'authenticated');
    
CREATE POLICY "Enable audit read/write" ON manifest_audit_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_manifests_number ON carrier_manifests(manifest_number);
CREATE INDEX idx_manifests_status ON carrier_manifests(status);
CREATE INDEX idx_manifests_vehicle ON carrier_manifests(vehicle_reg_no);
