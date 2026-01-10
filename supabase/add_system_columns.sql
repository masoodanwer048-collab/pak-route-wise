-- Migration: Add missing system columns to carrier_manifests
-- Fixes "Could not find the created_by column" error

ALTER TABLE carrier_manifests 
ADD COLUMN IF NOT EXISTS created_by text,
ADD COLUMN IF NOT EXISTS updated_by text,
ADD COLUMN IF NOT EXISTS submitted_by text,
ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Ensure RLS allows access
ALTER TABLE carrier_manifests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for demo" ON carrier_manifests;
CREATE POLICY "Allow all for demo" ON carrier_manifests 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Reload Schema Cache
NOTIFY pgrst, 'reload config';
