-- Fix driver_name NOT NULL constraint
-- Ensures Drafts can be saved without driver details

DO $$ 
BEGIN
    -- Remove NOT NULL constraint from driver_name
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carrier_manifests' AND column_name = 'driver_name') THEN
        ALTER TABLE carrier_manifests ALTER COLUMN driver_name DROP NOT NULL;
    END IF;

    -- Also check other driver fields just in case
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carrier_manifests' AND column_name = 'driver_cnic') THEN
        ALTER TABLE carrier_manifests ALTER COLUMN driver_cnic DROP NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carrier_manifests' AND column_name = 'driver_mobile') THEN
        ALTER TABLE carrier_manifests ALTER COLUMN driver_mobile DROP NOT NULL;
    END IF;
END $$;

-- Refresh Schema Cache
NOTIFY pgrst, 'reload config';
