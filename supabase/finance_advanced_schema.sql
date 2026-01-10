-- Advanced Expenses & Allocations Schema

-- Drop existing expenses if needed to rebuild with allocations
-- DROP TABLE IF EXISTS finance_expenses CASCADE; 

-- Categories for Expenses
CREATE TABLE IF NOT EXISTS finance_expense_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE, -- Fuel, Maintenance, Toll, etc.
    code text,
    type text DEFAULT 'operating', -- operating, administrative, cogs
    budget_limit numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Extended Expenses Table
CREATE TABLE IF NOT EXISTS finance_expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_number text UNIQUE NOT NULL, -- EXP-2024-001
    date date DEFAULT CURRENT_DATE,
    payee_name text NOT NULL, -- Vendor, Driver, Employee
    category_id uuid REFERENCES finance_expense_categories(id),
    category_name text, -- Denormalized for ease
    payment_method text DEFAULT 'cash', -- cash, bank, card, credit
    amount numeric NOT NULL DEFAULT 0,
    tax_amount numeric DEFAULT 0,
    total_amount numeric NOT NULL DEFAULT 0,
    currency text DEFAULT 'PKR',
    status text DEFAULT 'draft', -- draft, submitted, approved, paid, rejected
    description text,
    reference_no text, -- Cheque No, Transaction ID
    proof_url text, -- Attachment
    
    -- Allocations (Optional direct links)
    trip_id text, -- Loose link to trips table
    vehicle_id text, -- Loose link to fleet table
    driver_id text, -- Loose link to hr table
    vendor_id text, -- Loose link to vendor table
    
    created_by uuid,
    approved_by uuid,
    approved_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Expense Allocations (Splitting cost across multiple entities)
CREATE TABLE IF NOT EXISTS finance_expense_allocations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id uuid REFERENCES finance_expenses(id) ON DELETE CASCADE,
    allocation_type text NOT NULL, -- trip, vehicle, branch, department
    entity_id text NOT NULL, -- ID of the trip/vehicle
    amount numeric NOT NULL,
    percentage numeric,
    created_at timestamptz DEFAULT now()
);

-- Approval Workflow Logs
CREATE TABLE IF NOT EXISTS finance_approvals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id uuid NOT NULL, -- Expense ID, Invoice ID
    record_type text NOT NULL, -- expense, invoice
    action text NOT NULL, -- submitted, approved, rejected
    performed_by uuid,
    comments text,
    created_at timestamptz DEFAULT now()
);

-- Seed Categories
INSERT INTO finance_expense_categories (name, code, type) VALUES
('Fuel', 'FUEL', 'operating'),
('Vehicle Maintenance', 'MAINT', 'operating'),
('Toll Taxes', 'TOLL', 'operating'),
('Driver Allowance', 'DRV_ALLOW', 'operating'),
('Office Rent', 'RENT', 'administrative'),
('Utilities', 'UTIL', 'administrative'),
('Salaries', 'SAL', 'administrative'),
('Customs Clearance', 'CUST', 'cogs'),
('Warehouse Handling', 'WH_HAND', 'operating')
ON CONFLICT (name) DO NOTHING;

-- RLS
ALTER TABLE finance_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_expense_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_approvals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable all for demo" ON finance_expense_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON finance_expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON finance_expense_allocations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON finance_approvals FOR ALL USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload config';
