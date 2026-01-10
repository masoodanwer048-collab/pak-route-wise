-- Fix carrier_user_id NOT NULL constraint and permissions
-- Option A: Allow NULL for Drafts, Enforce on Submit (via App Logic)

-- 1. Make carrier_user_id nullable
ALTER TABLE carrier_manifests 
ALTER COLUMN carrier_user_id DROP NOT NULL;

-- 2. Add carrier_user_id column if it doesn't exist (Safety check)
ALTER TABLE carrier_manifests 
ADD COLUMN IF NOT EXISTS carrier_user_id uuid REFERENCES auth.users(id);

-- 3. Refresh Schema Cache
NOTIFY pgrst, 'reload config';
