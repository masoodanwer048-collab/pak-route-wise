-- Finance Module Schema

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS finance_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    type text NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
    currency text DEFAULT 'PKR',
    balance numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Invoices (AR)
CREATE TABLE IF NOT EXISTS finance_invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number text UNIQUE NOT NULL,
    customer_id uuid, -- Link to customer table if exists
    customer_name text NOT NULL,
    customer_address text,
    issue_date date DEFAULT CURRENT_DATE,
    due_date date,
    currency text DEFAULT 'PKR',
    subtotal numeric DEFAULT 0,
    tax_total numeric DEFAULT 0,
    total_amount numeric DEFAULT 0,
    status text DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Invoice Items
CREATE TABLE IF NOT EXISTS finance_invoice_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id uuid REFERENCES finance_invoices(id) ON DELETE CASCADE,
    description text NOT NULL,
    quantity numeric DEFAULT 1,
    unit_price numeric DEFAULT 0,
    amount numeric DEFAULT 0,
    tax_rate numeric DEFAULT 0
);

-- Expenses / Bills (AP)
CREATE TABLE IF NOT EXISTS finance_expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number text,
    payee_name text NOT NULL, -- Vendor or Employee
    category text NOT NULL, -- Rent, Fuel, Repair, Salary, etc.
    type text NOT NULL, -- Internal, External
    amount numeric NOT NULL,
    currency text DEFAULT 'PKR',
    date date DEFAULT CURRENT_DATE,
    status text DEFAULT 'pending', -- pending, approved, paid, rejected
    proof_url text,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Payroll Runs
CREATE TABLE IF NOT EXISTS hr_payroll_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    month text NOT NULL, -- e.g., "January"
    year integer NOT NULL,
    total_amount numeric DEFAULT 0,
    status text DEFAULT 'draft', -- draft, approved, paid
    created_at timestamptz DEFAULT now()
);

-- Payslips
CREATE TABLE IF NOT EXISTS hr_payslips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id uuid REFERENCES hr_payroll_runs(id) ON DELETE CASCADE,
    employee_id uuid, -- Link to employee table
    employee_name text NOT NULL,
    basic_salary numeric DEFAULT 0,
    allowances numeric DEFAULT 0,
    deductions numeric DEFAULT 0,
    net_salary numeric DEFAULT 0,
    status text DEFAULT 'pending', -- pending, paid
    payment_method text, -- Bank Transfer, Cash
    created_at timestamptz DEFAULT now()
);

-- Transactions (GL)
CREATE TABLE IF NOT EXISTS finance_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date DEFAULT CURRENT_DATE,
    description text NOT NULL,
    account_id uuid REFERENCES finance_accounts(id),
    amount numeric NOT NULL,
    type text NOT NULL, -- Credit, Debit
    reference_id uuid, -- Invoice ID, Expense ID, Payroll ID
    reference_type text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;

-- Policies (Open for demo)
CREATE POLICY "Enable all for demo" ON finance_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON finance_invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON finance_invoice_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON finance_expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON hr_payroll_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON hr_payslips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for demo" ON finance_transactions FOR ALL USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload config';
