-- Carrier Manifest Module Full Schema

-- 1. Create Drop existing definitions if needed (Be careful in production)
-- DROP TABLE IF EXISTS carrier_manifests CASCADE;

-- 2. Create Enum Types
CREATE TYPE manifest_status AS ENUM (
    'DRAFT', 
    'LOADING', 
    'READY_FOR_HANDOVER', 
    'HANDED_OVER', 
    'IN_TRANSIT', 
    'RECEIVED', 
    'CLOSED', 
    'CANCELLED', 
    'REOPENED'
);

CREATE TYPE carrier_type AS ENUM (
    'OWN_FLEET', 
    'VENDOR', 
    'BUS_CARGO', 
    'AIR', 
    '3PL'
);

CREATE TYPE risk_category AS ENUM (
    'NORMAL', 
    'HIGH_VALUE', 
    'SENSITIVE', 
    'PERISHABLE'
);

-- 3. Create Carrier Manifests Table (50+ fields)
CREATE TABLE IF NOT EXISTS carrier_manifests (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Metadata
    manifest_number text NOT NULL UNIQUE, -- Generated ID
    created_by uuid REFERENCES auth.users(id), -- Creator (Dispatcher/Admin)
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    status manifest_status DEFAULT 'DRAFT',
    
    -- A) Carrier/Vendor Details
    carrier_type carrier_type NOT NULL DEFAULT 'OWN_FLEET',
    carrier_name text NOT NULL, -- Name of Vendor or Internal Fleet Div
    carrier_id text, -- ID ref if external system
    carrier_contact_person text,
    carrier_phone text,
    carrier_email text,
    carrier_address text,
    contract_type text, -- 'PER_TRIP', 'MONTHLY', 'SLA'
    vendor_rate_ref text,
    insurance_policy_no text, -- Carrier Liability Policy
    
    -- B) Vehicle Details
    vehicle_reg_no text NOT NULL,
    vehicle_type text, -- Van, Truck, Bike
    vehicle_make text,
    vehicle_model text,
    vehicle_year text,
    vehicle_color text,
    engine_no text, -- Critical for compliance
    chassis_no text, -- Critical for compliance
    token_tax_status text, -- Paid/Unpaid
    fitness_cert_no text,
    fitness_expiry date,
    route_permit_no text,
    route_permit_expiry date,
    vehicle_insurance_company text,
    vehicle_insurance_expiry date,
    tracker_id text, -- GPS Device ID
    odometer_start numeric,
    odometer_end numeric,
    fuel_type text, -- Petrol, Diesel
    fuel_level_start numeric, -- % or Liters
    
    -- C) Driver & Crew
    driver_name text NOT NULL,
    driver_cnic text,
    driver_mobile text,
    driver_license_no text,
    driver_license_expiry date,
    driver_address text,
    driver_emergency_contact text,
    helper_name text,
    helper_cnic text,
    helper_mobile text,
    
    -- D) Trip / Operational
    trip_id text, -- Manual or Auto Trip ID
    route_name text,
    route_code text,
    origin_hub text NOT NULL, -- Should ideally be UUID ref to locations
    destination_hub text NOT NULL,
    departure_time timestamptz,
    expected_arrival timestamptz,
    actual_arrival timestamptz,
    loading_bay text,
    seal_number text,
    bag_count integer DEFAULT 0,
    container_count integer DEFAULT 0,
    
    -- Special Handling
    temp_req_min numeric, -- Cold Chain
    temp_req_max numeric,
    temp_reading_start numeric,
    risk_category risk_category DEFAULT 'NORMAL',
    security_escort_required boolean DEFAULT false,
    otp_required boolean DEFAULT false,
    handover_otp text, -- Secret OTP
    
    -- Signatures / Handover
    driver_accepted_at timestamptz,
    dispatch_officer_name text,
    receiving_officer_name text,
    
    -- Status Flags
    incident_flag boolean DEFAULT false,
    notes text,
    
    -- Totals (Denormalized for performance, updated via triggers/app)
    total_shipments integer DEFAULT 0,
    total_weight numeric DEFAULT 0,
    total_cod_amount numeric DEFAULT 0
);

-- 4. Update Shipments / Consignments Table
-- Assumes 'shipments' table exists. Adding linking fields.

ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS manifest_id uuid REFERENCES carrier_manifests(id),
ADD COLUMN IF NOT EXISTS manifest_status text DEFAULT 'PENDING_SCAN'; -- LOADED, RECEIVED, MISSING, DAMAGED

-- 5. Audit Log Table
CREATE TABLE IF NOT EXISTS manifest_audit_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    manifest_id uuid REFERENCES carrier_manifests(id),
    action text NOT NULL, -- CREATED, UPDATED, STATUS_CHANGE, SHIPMENT_ADDED
    previous_value jsonb,
    new_value jsonb,
    performed_by uuid REFERENCES auth.users(id),
    performed_at timestamptz DEFAULT now(),
    ip_address text,
    notes text
);

-- 6. RLS Policies
ALTER TABLE carrier_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifest_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin & Operations can do everything
CREATE POLICY "Ops Full Access" ON carrier_manifests
    FOR ALL
    USING (
        auth.role() = 'authenticated' 
    ); 
    -- Refine this later with specific role checks e.g. (auth.jwt() ->> 'role' IN ('admin', 'hub_manager'))

-- Policy: Read only for Drivers (if they access via this API)
-- ...

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_manifest_number ON carrier_manifests(manifest_number);
CREATE INDEX IF NOT EXISTS idx_manifest_status ON carrier_manifests(status);
CREATE INDEX IF NOT EXISTS idx_shipments_manifest_id ON shipments(manifest_id);
