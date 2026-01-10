-- Ultimate GD Schema Fix: Add all potential JSONB columns and a safe fallback
-- This script ensures no "column not found" error ever happens again for GDs.

-- 1. Add all explicit JSONB columns used in the form
ALTER TABLE goods_declarations 
ADD COLUMN IF NOT EXISTS agent jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS exporter jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS importer jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS shipment_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cargo_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS valuation_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;

-- 2. Add other missing columns
ALTER TABLE goods_declarations 
ADD COLUMN IF NOT EXISTS pages text,
ADD COLUMN IF NOT EXISTS total_customs_duty numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_sales_tax numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_regulatory_duty numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_taxes numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS examiner_remarks text,
ADD COLUMN IF NOT EXISTS declarant_name text,
ADD COLUMN IF NOT EXISTS declarant_cnic text;

-- 3. THE SAFETY NET: Add 'extra_data' column for any unknown fields
ALTER TABLE goods_declarations 
ADD COLUMN IF NOT EXISTS extra_data jsonb DEFAULT '{}'::jsonb;

-- 4. Refresh Schema Cache
NOTIFY pgrst, 'reload config';
