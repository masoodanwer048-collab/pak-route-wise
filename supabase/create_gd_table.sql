-- Create or Update goods_declarations table to support full GD form
-- Using JSONB for complex nested structures to simplify schema management

CREATE TABLE IF NOT EXISTS goods_declarations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Header
    gd_number text,
    gd_type text, -- Import, Export, Transit
    status text DEFAULT 'Draft', -- Draft, Submitted, Assessed, etc.
    filing_date date DEFAULT CURRENT_DATE,
    
    -- Customs Info
    weboc_ref text,
    customs_station text,
    collectorate text,
    
    -- Parties (JSONB for flexibility)
    exporter jsonb DEFAULT '{}'::jsonb, -- name, address
    importer jsonb DEFAULT '{}'::jsonb, -- name, address, ntn, strn
    agent jsonb DEFAULT '{}'::jsonb, -- name, address, chal_no
    
    -- Details
    pages text,
    
    -- Shipment & Cargo (JSONB)
    shipment_details jsonb DEFAULT '{}'::jsonb, -- origin, ports, mode, transport, bl, igm, etc.
    cargo_details jsonb DEFAULT '{}'::jsonb, -- weights, packages, marks, location
    
    -- Valuation (JSONB)
    valuation_details jsonb DEFAULT '{}'::jsonb, -- terms, currency, invoice, charges
    
    -- Items (JSONB Array)
    items jsonb DEFAULT '[]'::jsonb,
    
    -- Assessment & Totals
    total_customs_duty numeric DEFAULT 0,
    total_sales_tax numeric DEFAULT 0,
    total_regulatory_duty numeric DEFAULT 0,
    total_taxes numeric DEFAULT 0,
    
    examiner_remarks text,
    
    -- Declaration
    declarant_name text,
    declarant_cnic text
);

-- RLS
ALTER TABLE goods_declarations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for demo" ON goods_declarations;
CREATE POLICY "Enable all for demo" ON goods_declarations FOR ALL USING (true) WITH CHECK (true);

-- Notify
NOTIFY pgrst, 'reload config';
