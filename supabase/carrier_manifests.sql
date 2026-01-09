/* 
Enterprise Carrier Manifest Schema (Flexible Workflow)
This is the authoritative schema for the carrier_manifests module.
It supports over 80 fields for Logistics, Customs, Security, and Financials.
Most fields are nullable to support "Save as Draft" functionality.
*/

-- 1. Create Types (Safe creation)
DO $$ BEGIN
    CREATE TYPE manifest_status AS ENUM (
        'DRAFT', 'LOADING', 'READY_FOR_HANDOVER', 'HANDED_OVER', 
        'IN_TRANSIT', 'RECEIVED', 'CLOSED', 'CANCELLED', 'REOPENED', 'SUBMITTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE manifest_type AS ENUM (
        'LINEHAUL', 'DELIVERY', 'RTO', 'VENDOR', 'CONTAINER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Table
CREATE TABLE IF NOT EXISTS carrier_manifests (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Core Identifiers
    manifest_number text NOT NULL UNIQUE,
    manifest_type manifest_type DEFAULT 'LINEHAUL',
    status manifest_status DEFAULT 'DRAFT',
    
    -- Logistics (Nullable for Drafts)
    origin_hub text,
    destination_hub text,
    route_name text,
    route_code text,
    
    -- Timestamps
    dispatch_date_time timestamptz,
    expected_arrival_date_time timestamptz,
    actual_arrival_date_time timestamptz,
    
    -- Audit
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    
    -- Rejection/Cancellation
    reopen_reason text,
    reopen_approved_by uuid,
    cancel_reason text,
    cancelled_by uuid,

    -- Carrier Profile
    carrier_type text, -- 'OWN_FLEET', 'VENDOR', etc.
    carrier_name text,
    carrier_id text,
    carrier_phone text,
    carrier_address text,
    
    -- Driver Profile
    driver_name text,
    driver_cnic text,
    driver_mobile text,
    driver_license_no text,
    driver_license_expiry date,
    driver_address text,
    driver_emergency_contact text,
    helper_name text,
    helper_cnic text,
    helper_mobile text,
    driver_signature_url text,
    driver_otp_verified boolean,

    -- Vehicle Profile
    vehicle_reg_no text,
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
    fuel_level_start numeric,
    fuel_level_end numeric,
    vehicle_capacity_weight numeric,
    vehicle_capacity_volume numeric,

    -- Customs & Shipping
    gd_number text,
    gd_date date,
    igm_number text,
    ngm_number text,
    index_number text,
    bl_number text,
    shipping_bill_number text,
    container_no text,
    container_size text, -- 20FT, 40FT etc
    container_type text, -- DRY, REEFER
    seal_no text,
    pkg_count numeric,
    pkg_type text,
    pkg_marks text,
    gross_weight numeric,
    net_weight numeric,
    volume_cbm numeric,
    hs_code text,
    commodity_description text,
    
    port_of_loading text,
    port_of_discharge text,
    final_destination text,
    vessel_name text,
    voyage_number text,
    shipping_line_name text,
    freight_terms text,
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

    -- Trip Ops
    trip_id text,
    departure_gate text,
    dispatch_shift text,
    loading_start_time timestamptz,
    loading_end_time timestamptz,
    handover_time timestamptz,
    transit_start_time timestamptz,
    transit_stop_time timestamptz,
    receiving_start_time timestamptz,
    receiving_end_time timestamptz,

    -- Security
    security_check_status text DEFAULT 'PENDING', -- PASSED, FAILED
    security_guard_name text,
    cctv_reference_id text,
    seal_verification_status text,
    seal_broken_reason text,
    high_value_approval_id text,
    police_escort_required boolean DEFAULT false,

    -- Financials
    carrier_cost numeric,
    fuel_cost numeric,
    toll_charges numeric,
    loading_charges numeric,
    other_charges numeric,

    -- Tracking / Proof
    qr_code text,
    proof_of_handover_url text,
    proof_of_receiving_url text
);

-- 3. Audit Logs
CREATE TABLE IF NOT EXISTS manifest_audit_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    manifest_id uuid REFERENCES carrier_manifests(id) ON DELETE CASCADE,
    action text NOT NULL,
    performed_by uuid REFERENCES auth.users(id),
    performed_at timestamptz DEFAULT now(),
    details jsonb
);

-- 4. RLS Policies
ALTER TABLE carrier_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifest_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow everything for authenticated users for now
CREATE POLICY "Enable all for authenticated" ON carrier_manifests
    FOR ALL USING (auth.role() = 'authenticated');
    
CREATE POLICY "Enable audit read/write" ON manifest_audit_logs
    FOR ALL USING (auth.role() = 'authenticated');
