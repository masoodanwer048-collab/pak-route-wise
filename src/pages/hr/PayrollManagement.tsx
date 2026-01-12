
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Plus, Download, Printer, Lock, CheckCircle, FileSpreadsheet, Calculator, Calendar, FileText, Eye, MoreHorizontal, FileCheck, FileOutput, Trash2, UserPlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// --- Types ---
interface PayrollItem {
    id: string;
    employee_id: string;
    employee_name: string;
    designation: string;
    basic_pay: number;
    allowances: number;
    overtime_hours: number;
    overtime_amount: number;
    bonus: number;
    gross_pay: number;
    tax: number;
    loan_deduction: number;
    other_deductions: number;
    net_pay: number;
}

interface PayrollBatch {
    id: string;
    month: string;
    year: string;
    status: "Draft" | "Review" | "Approved" | "Paid" | "Locked";
    total_cost: number;
    items: PayrollItem[];
    processing_date: string;
}

// --- Mock Data ---
const generateMockPayroll = (month: string, year: string): PayrollBatch => {
    return {
        id: `BATCH-${year}-${month}`,
        month,
        year,
        status: "Draft",
        total_cost: 0,
        processing_date: new Date().toISOString().split('T')[0],
        items: [
            {
                id: "PI-001",
                employee_id: "EMP-001",
                employee_name: "Ahmed Khan",
                designation: "Logistics Manager",
                basic_pay: 80000,
                allowances: 30000,
                overtime_hours: 0,
                overtime_amount: 0,
                bonus: 0,
                gross_pay: 110000,
                tax: 5000,
                loan_deduction: 0,
                other_deductions: 0,
                net_pay: 105000
            },
            {
                id: "PI-002",
                employee_id: "EMP-002",
                employee_name: "Sarah Ali",
                designation: "Senior Accountant",
                basic_pay: 60000,
                allowances: 30000,
                overtime_hours: 10,
                overtime_amount: 5000,
                bonus: 0,
                gross_pay: 95000,
                tax: 2500,
                loan_deduction: 5000,
                other_deductions: 0,
                net_pay: 87500
            }
        ]
    };
};

const PayrollManagement = () => {
    const [activeBatch, setActiveBatch] = useState<PayrollBatch | null>(null);
    const [isRunModalOpen, setIsRunModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<string>("October");
    const [selectedYear, setSelectedYear] = useState<string>("2023");
    const [logoBase64, setLogoBase64] = useState<string | null>(null);

    // New Entry State
    const [newEntry, setNewEntry] = useState({ name: '', designation: '', basic: 0 });

    useEffect(() => {
        const loadLogo = async () => {
            try {
                const response = await fetch('/kohesar_logo.png');
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = () => setLogoBase64(reader.result as string);
                reader.readAsDataURL(blob);
            } catch (e) { console.error("Logo load failed", e); }
        };
        loadLogo();
    }, []);

    const calculateBatchTotals = (batch: PayrollBatch | null) => {
        if (!batch) return { totalGross: 0, totalNet: 0, totalTax: 0, totalDeductions: 0 };
        return batch.items.reduce((acc, item) => ({
            totalGross: acc.totalGross + item.gross_pay,
            totalNet: acc.totalNet + item.net_pay,
            totalTax: acc.totalTax + item.tax,
            totalDeductions: acc.totalDeductions + item.tax + item.loan_deduction + item.other_deductions
        }), { totalGross: 0, totalNet: 0, totalTax: 0, totalDeductions: 0 });
    };

    const totals = calculateBatchTotals(activeBatch);

    // --- Actions ---

    const handleRunPayroll = () => {
        const newBatch = generateMockPayroll(selectedMonth, selectedYear);
        setActiveBatch(newBatch);
        setIsRunModalOpen(false);
        toast.success(`Payroll Draft Generated for ${selectedMonth} ${selectedYear}`);
    };

    const handleAddEntry = () => {
        if (!activeBatch) return;
        const newItem: PayrollItem = {
            id: `PI-${Date.now()}`,
            employee_id: `EMP-${Math.floor(Math.random() * 1000)}`,
            employee_name: newEntry.name || "New Employee",
            designation: newEntry.designation || "Staff",
            basic_pay: newEntry.basic,
            allowances: 0,
            overtime_hours: 0,
            overtime_amount: 0,
            bonus: 0,
            gross_pay: newEntry.basic,
            tax: 0,
            loan_deduction: 0,
            other_deductions: 0,
            net_pay: newEntry.basic
        };
        setActiveBatch({
            ...activeBatch,
            items: [...activeBatch.items, newItem]
        });
        setIsAddModalOpen(false);
        setNewEntry({ name: '', designation: '', basic: 0 });
        toast.success("Employee added to payroll");
    };

    const handleDeleteRow = (id: string) => {
        if (!activeBatch) return;
        if (activeBatch.status === 'Locked') {
            toast.error("Cannot delete from locked payroll");
            return;
        }
        const updatedItems = activeBatch.items.filter(item => item.id !== id);
        setActiveBatch({ ...activeBatch, items: updatedItems });
        toast.success("Row deleted");
    };

    const handleValueChange = (itemId: string, field: keyof PayrollItem, value: number) => {
        if (!activeBatch || activeBatch.status === 'Locked') return;

        const updatedItems = activeBatch.items.map(item => {
            if (item.id === itemId) {
                const newItem = { ...item, [field]: value };

                // Auto-Calc Logic
                if (field === 'overtime_hours') {
                    newItem.overtime_amount = value * 300; // Rate 300/hr
                }

                // If Basic, Allow, Bonus, OT changed -> Update Gross (Standard Calc)
                if (['basic_pay', 'allowances', 'overtime_amount', 'bonus'].includes(field)) {
                    newItem.gross_pay = newItem.basic_pay + newItem.allowances + newItem.overtime_amount + newItem.bonus;
                }

                // If Gross Pay is manually edited, it stays as input. 
                // Tax Logic (Simple Bracket for auto-calc if not manually edited? 
                // Creating a complex 'isManual' state is too much, let's just re-calc Tax if Gross changes, 
                // BUT if user edits Tax directly, we trust them until Gross changes again).
                // Actually, simple rule: Re-calc Tax only if Gross was the trigger or upstream.
                // If Field == Tax, don't re-calc Tax.

                if (field !== 'tax') {
                    // 5% Tax > 50k simple logic
                    newItem.tax = newItem.gross_pay > 50000 ? newItem.gross_pay * 0.05 : 0;
                }

                newItem.net_pay = newItem.gross_pay - newItem.tax - newItem.loan_deduction - newItem.other_deductions;
                return newItem;
            }
            return item;
        });
        setActiveBatch({ ...activeBatch, items: updatedItems });
    };

    const handleStatusChange = (newStatus: PayrollBatch['status']) => {
        if (!activeBatch) return;
        setActiveBatch({ ...activeBatch, status: newStatus });
        toast.success(`Payroll Batch Status changed to: ${newStatus}`);
    };

    // --- Exports (Refined from previous) ---
    const handleExportExcel = () => {
        if (!activeBatch) return;
        const headerRows = [
            ["Kohesar Logistics (Private Limited)"],
            [`Payroll Sheet for ${activeBatch.month} ${activeBatch.year}`],
            [`Generated on: ${new Date().toLocaleDateString()}`],
            []
        ];
        const dataRows = activeBatch.items.map(item => ({
            "Employee Code": item.employee_id, "Name": item.employee_name, "Designation": item.designation,
            "Basic Pay": item.basic_pay, "Total Allowances": item.allowances, "Overtime Amt": item.overtime_amount,
            "Gross Pay": item.gross_pay, "Tax Deduction (FBR)": item.tax, "Loan": item.loan_deduction,
            "Other Ded": item.other_deductions, "Total Deductions": item.tax + item.loan_deduction + item.other_deductions,
            "Net Pay": item.net_pay
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataRows, { origin: 'A5' });
        XLSX.utils.sheet_add_aoa(worksheet, headerRows, { origin: 'A1' });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Sheet");
        XLSX.writeFile(workbook, `Payroll_${activeBatch.month}_${activeBatch.year}.xlsx`);
        toast.success("Excel exported successfully");
    };

    const addPdfHeader = (doc: jsPDF, title: string) => {
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 14, 10, 25, 25);
            doc.setFontSize(18);
            doc.text("Kohesar Logistics (Private Limited)", 45, 20);
            doc.setFontSize(12);
            doc.text(title, 45, 30);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 45, 36);
        } else {
            doc.setFontSize(18);
            doc.text("Kohesar Logistics (Private Limited)", 14, 20);
            doc.setFontSize(12);
            doc.text(title, 14, 30);
        }
    };

    const handleExportPDF = () => {
        if (!activeBatch) return;
        const doc = new jsPDF();
        addPdfHeader(doc, `Payroll Sheet for ${activeBatch.month} ${activeBatch.year}`);
        autoTable(doc, {
            startY: 45,
            head: [['Code', 'Name', 'Basic', 'Allow', 'Gross', 'Tax', 'Ded', 'Net Pay']],
            body: activeBatch.items.map(item => [
                item.employee_id, item.employee_name, item.basic_pay.toLocaleString(),
                item.allowances.toLocaleString(), item.gross_pay.toLocaleString(),
                item.tax.toLocaleString(), (item.loan_deduction + item.other_deductions).toLocaleString(),
                item.net_pay.toLocaleString()
            ]),
            foot: [['', 'TOTAL', '', '', totals.totalGross.toLocaleString(), totals.totalTax.toLocaleString(), '', totals.totalNet.toLocaleString()]],
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
        });
        // Footer
        const finalY = (doc as any).lastAutoTable.finalY || 150;
        doc.text("Prepared By: ___________", 14, finalY + 30);
        doc.text("Approved By: ___________", 120, finalY + 30);
        doc.save(`Payroll_${activeBatch.month}_${activeBatch.year}.pdf`);
    };

    const handleExportSalarySlip = (item: PayrollItem) => {
        if (!activeBatch) return;
        const doc = new jsPDF();
        addPdfHeader(doc, `Salary Slip - ${activeBatch.month} ${activeBatch.year}`);
        doc.setDrawColor(0); doc.setFillColor(245, 245, 245); doc.rect(14, 45, 180, 25, 'F');
        doc.setFontSize(11);
        doc.text(`Name: ${item.employee_name}`, 18, 55); doc.text(`ID: ${item.employee_id}`, 110, 55);

        autoTable(doc, {
            startY: 75,
            head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
            body: [
                ['Basic', item.basic_pay.toLocaleString(), 'Tax', item.tax.toLocaleString()],
                ['Allowances', item.allowances.toLocaleString(), 'Loan', item.loan_deduction.toLocaleString()],
                ['Overtime', item.overtime_amount.toLocaleString(), 'Other', item.other_deductions.toLocaleString()],
                ['Gross Pay', item.gross_pay.toLocaleString(), 'Total Ded', (item.tax + item.loan_deduction + item.other_deductions).toLocaleString()]
            ],
            theme: 'grid'
        });
        doc.text(`Net Payable: ${item.net_pay.toLocaleString()}`, 14, (doc as any).lastAutoTable.finalY + 10);
        doc.save(`Slip_${item.employee_name}.pdf`);
    };

    const handleExportTaxReport = (type: 'monthly' | 'slab' | 'annual') => {
        if (!activeBatch) return;
        const doc = new jsPDF();

        if (type === 'monthly') {
            addPdfHeader(doc, `Monthly Tax Report - ${activeBatch.month} ${activeBatch.year}`);
            autoTable(doc, {
                startY: 45,
                head: [['Code', 'Name', 'Gross Pay', 'Tax Deduction']],
                body: activeBatch.items.map(item => [
                    item.employee_id,
                    item.employee_name,
                    item.gross_pay.toLocaleString(),
                    item.tax.toLocaleString()
                ]),
                foot: [['', 'TOTAL', '', totals.totalTax.toLocaleString()]],
                theme: 'striped'
            });
            doc.save(`Tax_Report_${activeBatch.month}_${activeBatch.year}.pdf`);
        } else if (type === 'slab') {
            addPdfHeader(doc, `Tax Slab Summary - ${activeBatch.month} ${activeBatch.year}`);
            const slabs = {
                "0 - 50k": activeBatch.items.filter(i => i.gross_pay <= 50000).length,
                "50k - 100k": activeBatch.items.filter(i => i.gross_pay > 50000 && i.gross_pay <= 100000).length,
                "100k+": activeBatch.items.filter(i => i.gross_pay > 100000).length,
            };
            autoTable(doc, {
                startY: 45,
                head: [['Tax Slab (Monthly Gross)', 'Employee Count']],
                body: Object.entries(slabs).map(([slab, count]) => [slab, count]),
                theme: 'grid'
            });
            doc.save(`Tax_Slab_Summary.pdf`);
        } else if (type === 'annual') {
            const emp = activeBatch.items[0];
            addPdfHeader(doc, `Annual Tax Certificate`);
            autoTable(doc, {
                startY: 55,
                head: [['Description', 'Amount (PKR)']],
                body: [
                    ['Annual Basic Salary', (emp.basic_pay * 12).toLocaleString()],
                    ['Annual Allowances', (emp.allowances * 12).toLocaleString()],
                    ['Annual Gross Salary', (emp.gross_pay * 12).toLocaleString()],
                    ['Taxable Income', (emp.gross_pay * 12).toLocaleString()],
                    ['Tax Deducted', (emp.tax * 12).toLocaleString()]
                ],
                theme: 'grid'
            });
            doc.save(`Annual_Tax_Cert_${emp.employee_id}.pdf`);
        }
    };


    // --- Empty State ---
    if (!activeBatch) {
        return (
            <MainLayout title="Payroll Operations" subtitle="Process monthly payrolls.">
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <div className="bg-primary/10 p-6 rounded-full"><Calculator className="h-12 w-12 text-primary" /></div>
                    <Button onClick={() => setIsRunModalOpen(true)} size="lg" className="gap-2"><Plus className="h-4 w-4" /> Run Payroll Wizard</Button>
                    <Dialog open={isRunModalOpen} onOpenChange={setIsRunModalOpen}>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Run Payroll</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <label>Month</label><Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{["January", "February", "October", "November", "December"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                </Select>
                                <label>Year</label><Input value={selectedYear} onChange={e => setSelectedYear(e.target.value)} />
                            </div>
                            <Button onClick={handleRunPayroll}>Generate Draft</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </MainLayout>
        );
    }

    const isLocked = activeBatch.status === 'Locked';

    return (
        <MainLayout title={`Payroll: ${activeBatch.month} ${activeBatch.year}`} subtitle="Review and finalize monthly salaries.">
            {/* Header / Actions */}
            <div className="flex justify-between mb-4">
                <div className="print:hidden flex gap-2">
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2" disabled={isLocked}><UserPlus className="h-4 w-4" /> Add Entry</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add Manual Entry</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input placeholder="Name" value={newEntry.name} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} />
                                <Input placeholder="Designation" value={newEntry.designation} onChange={e => setNewEntry({ ...newEntry, designation: e.target.value })} />
                                <Input type="number" placeholder="Basic Pay" value={newEntry.basic} onChange={e => setNewEntry({ ...newEntry, basic: Number(e.target.value) })} />
                            </div>
                            <Button onClick={handleAddEntry}>Add to Batch</Button>
                        </DialogContent>
                    </Dialog>
                    {/* Status Badges */}
                    <Badge variant="outline" className="ml-2">{activeBatch.status}</Badge>
                </div>
                <div className="print:hidden flex gap-2">
                    {/* Tax Reports Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <FileCheck className="h-4 w-4" /> Reports
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>FBR Reports</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExportTaxReport('monthly')}>
                                Monthly Tax Deduction Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportTaxReport('slab')}>
                                Tax Slab Summary
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportTaxReport('annual')}>
                                Annual Tax Certificate (Sample)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button size="sm" variant="outline" onClick={handleExportExcel}><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
                    <Button size="sm" variant="outline" onClick={handleExportPDF}><FileText className="h-4 w-4" /> PDF</Button>
                    <Button size="sm" variant="default" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
                    {activeBatch.status === 'Draft' ?
                        <Button className="bg-blue-600" onClick={() => handleStatusChange('Approved')}>Approve</Button> :
                        activeBatch.status === 'Approved' ?
                            <Button variant="destructive" onClick={() => handleStatusChange('Locked')}><Lock className="h-4 w-4" /> Lock</Button> :
                            <span className="text-sm text-muted-foreground italic flex items-center px-4"><Lock className="h-3 w-3 mr-1" /> Locked</span>
                    }
                </div>
            </div>

            {/* Print Header */}
            <div className="hidden print:flex mb-6 border-b pb-4 gap-4 items-center">
                <img src="/kohesar_logo.png" className="h-16 w-auto" />
                <div><h1 className="text-xl font-bold">Kohesar Logistics</h1><p>Payroll Sheet {activeBatch.month} {activeBatch.year}</p></div>
            </div>

            {/* Main Table */}
            <Card className="print:border-0 print:shadow-none">
                <div className="overflow-x-auto">
                    <Table className="text-xs md:text-sm">
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="w-[120px]">Employee</TableHead>
                                <TableHead className="w-[80px]">Basic</TableHead>
                                <TableHead className="w-[80px]">Allow</TableHead>
                                <TableHead className="w-[60px]">OT(Hrs)</TableHead>
                                <TableHead className="w-[80px]">Bonus</TableHead>
                                <TableHead className="w-[90px] bg-blue-50">Gross</TableHead>
                                <TableHead className="w-[80px]">Tax</TableHead>
                                <TableHead className="w-[80px]">Tot.Ded</TableHead>
                                <TableHead className="w-[90px] bg-green-50">Net Pay</TableHead>
                                <TableHead className="print:hidden w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeBatch.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.employee_name}</div>
                                        <div className="text-xs text-muted-foreground">{item.designation}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" className="h-7 w-full px-1"
                                            value={item.basic_pay} disabled={isLocked}
                                            onChange={(e) => handleValueChange(item.id, 'basic_pay', Number(e.target.value))} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" className="h-7 w-full px-1"
                                            value={item.allowances} disabled={isLocked}
                                            onChange={(e) => handleValueChange(item.id, 'allowances', Number(e.target.value))} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" className="h-7 w-full px-1 text-center"
                                            value={item.overtime_hours} disabled={isLocked}
                                            onChange={(e) => handleValueChange(item.id, 'overtime_hours', Number(e.target.value))} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" className="h-7 w-full px-1"
                                            value={item.bonus} disabled={isLocked}
                                            onChange={(e) => handleValueChange(item.id, 'bonus', Number(e.target.value))} />
                                    </TableCell>
                                    <TableCell className="bg-blue-50/50">
                                        <Input type="number" className="h-7 w-full px-1 font-bold bg-transparent border-0"
                                            value={item.gross_pay} disabled={isLocked}
                                            onChange={(e) => handleValueChange(item.id, 'gross_pay', Number(e.target.value))} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" className="h-7 w-full px-1 text-red-600"
                                            value={item.tax} disabled={isLocked}
                                            onChange={(e) => handleValueChange(item.id, 'tax', Number(e.target.value))} />
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-red-500">{(item.tax + item.loan_deduction + item.other_deductions).toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell className="bg-green-50/50 font-bold text-green-700">
                                        {item.net_pay.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="print:hidden flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" disabled={isLocked}
                                            onClick={() => handleDeleteRow(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"
                                            onClick={() => handleExportSalarySlip(item)}>
                                            <FileOutput className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <div className="hidden print:flex justify-between mt-12 pt-8 border-t-2 border-gray-300 text-xs">
                <div className="text-center w-1/3"><div className="border-b mb-2"></div>HR Manager</div>
                <div className="text-center w-1/3"><div className="border-b mb-2"></div>Finance Dept</div>
                <div className="text-center w-1/3"><div className="border-b mb-2"></div>CEO</div>
            </div>
        </MainLayout>
    );
};

export default PayrollManagement;
