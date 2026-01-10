-- CLEANUP: Drop existing objects to ensure fresh start
DROP FUNCTION IF EXISTS demo_login(text, text);
DROP TABLE IF EXISTS user_workflow_steps CASCADE;
DROP TABLE IF EXISTS user_modules CASCADE;
DROP TABLE IF EXISTS app_users CASCADE;
DROP TABLE IF EXISTS workflow_steps CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. MODULES TABLE
CREATE TABLE modules (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    key text NOT NULL UNIQUE, -- e.g., 'sea_freight', 'customs_gd'
    name text NOT NULL,
    description text
);

-- 2. WORKFLOW STEPS TABLE
CREATE TABLE workflow_steps (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    key text NOT NULL UNIQUE, -- e.g., 'input_invoice'
    title text NOT NULL,
    stage_number integer NOT NULL, -- 1-4
    module_key text REFERENCES modules(key)
);

-- 3. APP USERS (Custom Users Table for Demo)
CREATE TABLE app_users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    role text NOT NULL, -- 'shipping_agent', 'clearing_agent', etc.
    created_at timestamptz DEFAULT now()
);

-- 4. USER MODULES (Access Control)
CREATE TABLE user_modules (
    user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
    module_key text REFERENCES modules(key) ON DELETE CASCADE,
    PRIMARY KEY (user_id, module_key)
);

-- 5. USER WORKFLOW STEPS (Step Permissions)
CREATE TABLE user_workflow_steps (
    user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
    step_key text REFERENCES workflow_steps(key) ON DELETE CASCADE,
    can_view boolean DEFAULT true,
    can_edit boolean DEFAULT false,
    can_complete boolean DEFAULT false,
    PRIMARY KEY (user_id, step_key)
);

-- FUNCTION: Demo Login
CREATE OR REPLACE FUNCTION demo_login(p_email text, p_password text)
RETURNS jsonb AS $$
DECLARE
    v_user app_users;
    v_modules text[];
    v_steps jsonb;
BEGIN
    -- Find user (Case Insensitive)
    SELECT * INTO v_user FROM app_users WHERE lower(email) = lower(p_email);

    -- 1. Check if user exists
    IF v_user IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'User not found in database');
    END IF;

    -- 2. Verify password
    IF v_user.password_hash != crypt(p_password, v_user.password_hash) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid password (hash mismatch)');
    END IF;

    -- Get allowed modules
    SELECT array_agg(module_key) INTO v_modules
    FROM user_modules
    WHERE user_id = v_user.id;

    -- Get allowed steps
    SELECT jsonb_agg(jsonb_build_object(
        'step_key', step_key,
        'can_view', can_view,
        'can_edit', can_edit,
        'can_complete', can_complete
    )) INTO v_steps
    FROM user_workflow_steps
    WHERE user_id = v_user.id;

    RETURN jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'id', v_user.id,
            'email', v_user.email,
            'fullName', v_user.full_name,
            'role', v_user.role
        ),
        'allowedModules', coalesce(v_modules, ARRAY[]::text[]),
        'allowedSteps', coalesce(v_steps, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- IMPORTANT: Grant permissions to allow the API to call this function
GRANT EXECUTE ON FUNCTION demo_login(text, text) TO anon, authenticated, service_role;

-- Simple Ping Function to verify connection
CREATE OR REPLACE FUNCTION demo_ping()
RETURNS jsonb AS $$
BEGIN
    RETURN jsonb_build_object('status', 'ok', 'message', 'Supabase Connection Successful');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION demo_ping() TO anon, authenticated, service_role;


-- SEED DATA

-- Insert Modules
INSERT INTO modules (key, name) VALUES
('ops_workflow', 'Operations Workflow'),
('documents', 'Documents'),
('customs_gd', 'Customs (C&F)'),
('import', 'Imports'),
('export', 'Exports'),
('transshipment', 'Transshipment'),
('afghan_transit', 'Afghan Transit'),
('local_logistics', 'Local Logistics'),
('maritime', 'Maritime Operations'),
('air_cargo', 'Air Cargo'),
('courier', 'Courier Service'),
('warehousing', 'Warehousing'),
('fleet', 'Fleet Management'),
('finance', 'Finance & Accounts'),
('hr', 'Human Resources'),
('compliance', 'Compliance'),
('tracking', 'Tracking'),
('reports', 'Reports'),
('settings', 'System Settings')
ON CONFLICT (key) DO NOTHING;

-- Insert Workflow Steps
INSERT INTO workflow_steps (key, title, stage_number) VALUES
-- Stage 1: Shipping Agent
('input_invoice', 'Input Invoice & Packing List', 1),
('consignor_details', 'Consignor & Consignee Details', 1),
('vessel_details', 'Vessel & Voyage Details', 1),
('output_bl', 'Output Bill of Lading', 1),
('output_do', 'Output Delivery Order', 1),
-- Stage 2: Clearing Agent
('record_bl', 'Record B/L Details', 2),
('file_gd', 'File Goods Declaration (GD)', 2),
('tax_assessment', 'Tax Assessment', 2),
('gd_out_charge', 'GD Out of Charge', 2),
-- Stage 3: Transporter
('carrier_manifest', 'Produce Carrier Manifest', 3),
('excise_payment', 'Make Excise Payment (NBP)', 3),
('loading_arrangements', 'Arrangements of Loading', 3),
('transport_border', 'Transport to Border / DryPort', 3),
-- Stage 4: Terminal
('gate_pass', 'Generate Gate Pass', 4),
('final_loading', 'Final Arrangements of Loading', 4),
('transport_dest', 'Transport to Destination', 4)
ON CONFLICT (key) DO NOTHING;

-- Insert Demo Users (Passwords hashed with 'Demo@1234' or 'Admin@1234')
-- Note: crypt('Demo@1234', gen_salt('bf'))
DO $$
DECLARE
    v_shipping_id uuid;
    v_clearing_id uuid;
    v_transport_id uuid;
    v_terminal_id uuid;
    v_admin_id uuid;
BEGIN
    -- Shipping Agent
    INSERT INTO app_users (email, password_hash, full_name, role)
    VALUES ('shipping@demo.com', crypt('Demo@1234', gen_salt('bf')), 'Shipping Agent', 'shipping_agent')
    RETURNING id INTO v_shipping_id;
    
    -- Clearing Agent
    INSERT INTO app_users (email, password_hash, full_name, role)
    VALUES ('clearing@demo.com', crypt('Demo@1234', gen_salt('bf')), 'Clearing Agent', 'clearing_agent')
    RETURNING id INTO v_clearing_id;

    -- Transport Agent
    INSERT INTO app_users (email, password_hash, full_name, role)
    VALUES ('transport@demo.com', crypt('Demo@1234', gen_salt('bf')), 'Transport Admin', 'transport_agent')
    RETURNING id INTO v_transport_id;

    -- Terminal Agent
    INSERT INTO app_users (email, password_hash, full_name, role)
    VALUES ('terminal@demo.com', crypt('Demo@1234', gen_salt('bf')), 'Terminal Manager', 'terminal_manager')
    RETURNING id INTO v_terminal_id;

    -- Admin
    INSERT INTO app_users (email, password_hash, full_name, role)
    VALUES ('admin@demo.com', crypt('Admin@1234', gen_salt('bf')), 'System Administrator', 'admin')
    RETURNING id INTO v_admin_id;


    -- ASSIGN MODULES
    
    -- Shipping Agent: Ops Workflow + Documents
    INSERT INTO user_modules (user_id, module_key) VALUES
    (v_shipping_id, 'ops_workflow'),
    (v_shipping_id, 'documents');

    -- Clearing Agent: Customs
    INSERT INTO user_modules (user_id, module_key) VALUES
    (v_clearing_id, 'customs_gd');

    -- Transport: Afghan Transit
    INSERT INTO user_modules (user_id, module_key) VALUES
    (v_transport_id, 'afghan_transit'); -- Closest match to "Transport / Bonded"

    -- Terminal: Local Logistics
    INSERT INTO user_modules (user_id, module_key) VALUES
    (v_terminal_id, 'local_logistics');

    -- Admin: ALL
    INSERT INTO user_modules (user_id, module_key)
    SELECT v_admin_id, key FROM modules;


    -- ASSIGN WORKFLOW STEPS
    
    -- Shipping Agent: Stage 1 (Full Access), Status View others? Let's give view on all, edit on stage 1
    INSERT INTO user_workflow_steps (user_id, step_key, can_view, can_edit, can_complete)
    SELECT v_shipping_id, key, true, (stage_number = 1), (stage_number = 1) FROM workflow_steps;

    -- Clearing Agent: Stage 2
    INSERT INTO user_workflow_steps (user_id, step_key, can_view, can_edit, can_complete)
    SELECT v_clearing_id, key, true, (stage_number = 2), (stage_number = 2) FROM workflow_steps;

    -- Transport: Stage 3
    INSERT INTO user_workflow_steps (user_id, step_key, can_view, can_edit, can_complete)
    SELECT v_transport_id, key, true, (stage_number = 3), (stage_number = 3) FROM workflow_steps;

    -- Terminal: Stage 4
    INSERT INTO user_workflow_steps (user_id, step_key, can_view, can_edit, can_complete)
    SELECT v_terminal_id, key, true, (stage_number = 4), (stage_number = 4) FROM workflow_steps;

    -- Admin: All Access
    INSERT INTO user_workflow_steps (user_id, step_key, can_view, can_edit, can_complete)
    SELECT v_admin_id, key, true, true, true FROM workflow_steps;

END $$;
