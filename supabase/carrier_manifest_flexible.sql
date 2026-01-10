-- Relax Constraints for Flexible Manifest Workflow
-- This script alters the carrier_manifests table to make fields optional.

DO $$
BEGIN
    -- 1. Alter Route Columns
    ALTER TABLE carrier_manifests ALTER COLUMN origin_hub DROP NOT NULL;
    ALTER TABLE carrier_manifests ALTER COLUMN destination_hub DROP NOT NULL;
    
    -- 2. Alter Carrier/Driver Columns
    ALTER TABLE carrier_manifests ALTER COLUMN carrier_name DROP NOT NULL;
    ALTER TABLE carrier_manifests ALTER COLUMN driver_name DROP NOT NULL;
    ALTER TABLE carrier_manifests ALTER COLUMN driver_cnic DROP NOT NULL;
    ALTER TABLE carrier_manifests ALTER COLUMN vehicle_reg_no DROP NOT NULL;

    -- 3. Ensure defaults
    ALTER TABLE carrier_manifests ALTER COLUMN status SET DEFAULT 'DRAFT';
    ALTER TABLE carrier_manifests ALTER COLUMN manifest_type SET DEFAULT 'LINEHAUL';
    
    -- 4. Check if we need to drop other constraints (e.g. unique keys if any were too strict beyond manifest_number)
    -- manifest_number should remain UNIQUE and NOT NULL
    
END $$;
