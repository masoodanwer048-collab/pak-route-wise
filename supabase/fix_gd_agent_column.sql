-- Fix "Could not find the agent column" error
-- Ensure the goods_declarations table has the correct JSONB columns

ALTER TABLE goods_declarations 
ADD COLUMN IF NOT EXISTS agent jsonb DEFAULT '{}'::jsonb;

-- Also verify other potentially missing columns from the new form
ALTER TABLE goods_declarations 
ADD COLUMN IF NOT EXISTS exporter jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS importer jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS shipment_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cargo_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS valuation_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pages text,
ADD COLUMN IF NOT EXISTS total_customs_duty numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_sales_tax numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_regulatory_duty numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_taxes numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS examiner_remarks text,
ADD COLUMN IF NOT EXISTS declarant_name text,
ADD COLUMN IF NOT EXISTS declarant_cnic text;

-- Refresh Schema Cache
NOTIFY pgrst, 'reload config';
