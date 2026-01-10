-- Fix vehicle_number / vehicle_reg_no NOT NULL constraint
-- Ensures Drafts can be saved without vehicle details

-- 1. Relax constraints on vehicle columns (Handle both naming conventions to be safe)
DO $$ 
BEGIN
    -- Try vehicle_number
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carrier_manifests' AND column_name = 'vehicle_number') THEN
        ALTER TABLE carrier_manifests ALTER COLUMN vehicle_number DROP NOT NULL;
    END IF;

    -- Try vehicle_reg_no
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carrier_manifests' AND column_name = 'vehicle_reg_no') THEN
        ALTER TABLE carrier_manifests ALTER COLUMN vehicle_reg_no DROP NOT NULL;
    END IF;
END $$;

-- 2. Refresh Schema Cache
NOTIFY pgrst, 'reload config';
