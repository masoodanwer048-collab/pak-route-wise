-- Create ENUMs for various statuses
CREATE TYPE employee_status AS ENUM ('Active', 'Resigned', 'Terminated');
CREATE TYPE payroll_status AS ENUM ('Draft', 'HR_Review', 'Accounts_Review', 'Approved', 'Paid');
CREATE TYPE loan_status AS ENUM ('Active', 'Closed');
CREATE TYPE document_entity_type AS ENUM ('Employee', 'Payroll', 'Loan');

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    designation TEXT,
    department TEXT, -- Can be FK to a departments table if exists, keeping simple for now
    joining_date DATE NOT NULL,
    status employee_status DEFAULT 'Active',
    cnic TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    address TEXT,
    bank_name TEXT,
    bank_account_no TEXT,
    bank_iban TEXT,
    profile_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Salary Structure Table (Current Approved Salary)
CREATE TABLE IF NOT EXISTS salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    basic_pay NUMERIC(12, 2) NOT NULL DEFAULT 0,
    house_rent_allowance NUMERIC(12, 2) DEFAULT 0,
    conveyance_allowance NUMERIC(12, 2) DEFAULT 0,
    medical_allowance NUMERIC(12, 2) DEFAULT 0,
    other_allowances NUMERIC(12, 2) DEFAULT 0,
    gross_salary NUMERIC(12, 2) GENERATED ALWAYS AS (basic_pay + house_rent_allowance + conveyance_allowance + medical_allowance + other_allowances) STORED,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE, -- Constraint: Only one active structure per employee
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Payrolls Table (Master Record for a Month)
CREATE TABLE IF NOT EXISTS payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_year DATE NOT NULL, -- Stored as first day of the month e.g., '2023-10-01'
    status payroll_status DEFAULT 'Draft',
    total_gross_pay NUMERIC(15, 2) DEFAULT 0,
    total_deductions NUMERIC(15, 2) DEFAULT 0,
    total_net_pay NUMERIC(15, 2) DEFAULT 0,
    processed_date TIMESTAMP WITH TIME ZONE,
    locked_by UUID, -- References auth.users or internal user table
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(month_year) -- One payroll run per month for simplicity
);

-- 4. Payroll Items (One record per employee per month)
CREATE TABLE IF NOT EXISTS payroll_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id UUID REFERENCES payrolls(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE RESTRICT,
    
    -- Snapshot of values at time of generation
    basic_pay_earned NUMERIC(12, 2) DEFAULT 0,
    
    -- Allowances Snapshot
    house_rent_allowance NUMERIC(12, 2) DEFAULT 0,
    conveyance_allowance NUMERIC(12, 2) DEFAULT 0,
    medical_allowance NUMERIC(12, 2) DEFAULT 0,
    other_allowances NUMERIC(12, 2) DEFAULT 0,
    overtime_amount NUMERIC(12, 2) DEFAULT 0,
    bonus_amount NUMERIC(12, 2) DEFAULT 0,
    commission_amount NUMERIC(12, 2) DEFAULT 0,
    arrears_amount NUMERIC(12, 2) DEFAULT 0,
    
    total_allowances NUMERIC(12, 2) DEFAULT 0,
    
    -- Deductions Snapshot
    tax_deducted NUMERIC(12, 2) DEFAULT 0,
    loan_deduction NUMERIC(12, 2) DEFAULT 0,
    advance_deduction NUMERIC(12, 2) DEFAULT 0,
    absent_deduction NUMERIC(12, 2) DEFAULT 0,
    late_deduction NUMERIC(12, 2) DEFAULT 0,
    other_deductions NUMERIC(12, 2) DEFAULT 0,
    
    total_deductions NUMERIC(12, 2) DEFAULT 0,
    
    gross_pay NUMERIC(12, 2) DEFAULT 0,
    net_pay NUMERIC(12, 2) DEFAULT 0,
    
    payment_status TEXT DEFAULT 'Unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Loans & Advances
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE RESTRICT,
    type TEXT CHECK (type IN ('Loan', 'Advance')),
    total_amount NUMERIC(12, 2) NOT NULL,
    installment_amount NUMERIC(12, 2) NOT NULL,
    start_month DATE NOT NULL,
    balance_remaining NUMERIC(12, 2) NOT NULL,
    status loan_status DEFAULT 'Active',
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Documents (Attachments)
CREATE TABLE IF NOT EXISTS hr_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type document_entity_type NOT NULL,
    entity_id UUID NOT NULL, -- Polymorphic reference (could be employee_id, payroll_id etc.)
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    category TEXT, -- e.g., 'CNIC', 'Contract'
    uploaded_by UUID,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    remarks TEXT
);

-- Indexes for Performance
CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_payroll_items_payroll_id ON payroll_items(payroll_id);
CREATE INDEX idx_payroll_items_employee_id ON payroll_items(employee_id);
CREATE INDEX idx_loans_employee_active ON loans(employee_id) WHERE status = 'Active';

-- Enable RLS (Assuming authentication matches 'public' or specific role)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_documents ENABLE ROW LEVEL SECURITY;

-- Simple Policy: Authenticated users can do everything (Internal App)
CREATE POLICY "Allow all for authenticated users" ON employees FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON salary_structures FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON payrolls FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON payroll_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON loans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON hr_documents FOR ALL USING (auth.role() = 'authenticated');
