
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Plus, Pencil, Trash2, Search, DollarSign, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Mock Employee Data (In real app, fetch from API or Context)
const employees = [
    { id: "EMP001", name: "Ahmed Khan" },
    { id: "EMP002", name: "Sarah Ali" },
    { id: "EMP003", name: "Bilal Hussain" },
];

interface PayrollRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    month: string;
    year: string;
    basicSalary: number;
    deductions: number;
    netSalary: number;
    status: "Paid" | "Pending" | "Processing";
    paymentDate?: string;
}

const initialPayroll: PayrollRecord[] = [
    { id: "PAY001", employeeId: "EMP001", employeeName: "Ahmed Khan", month: "January", year: "2025", basicSalary: 150000, deductions: 5000, netSalary: 145000, status: "Paid", paymentDate: "2025-01-31" },
    { id: "PAY002", employeeId: "EMP002", employeeName: "Sarah Ali", month: "January", year: "2025", basicSalary: 120000, deductions: 2000, netSalary: 118000, status: "Paid", paymentDate: "2025-01-31" },
];

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const formSchema = z.object({
    employeeId: z.string().min(1, "Employee selection is required"),
    month: z.string().min(1, "Month is required"),
    year: z.string().min(4, "Year is required"),
    basicSalary: z.coerce.number().min(0, "Salary must be positive"),
    deductions: z.coerce.number().min(0, "Deductions cannot be negative"),
    status: z.enum(["Paid", "Pending", "Processing"]),
});

const PayrollManagement = () => {
    const [payrolls, setPayrolls] = useState<PayrollRecord[]>(initialPayroll);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            employeeId: "",
            month: new Date().toLocaleString('default', { month: 'long' }),
            year: new Date().getFullYear().toString(),
            basicSalary: 0,
            deductions: 0,
            status: "Pending",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const employee = employees.find(e => e.id === values.employeeId);
        const netSalary = values.basicSalary - values.deductions;

        if (editingId) {
            setPayrolls(payrolls.map(p => p.id === editingId ? {
                ...p,
                employeeId: values.employeeId,
                month: values.month,
                year: values.year,
                basicSalary: values.basicSalary,
                deductions: values.deductions,
                status: values.status,
                employeeName: employee?.name || "Unknown",
                netSalary
            } : p));
            toast.success("Payroll record updated");
        } else {
            const newRecord: PayrollRecord = {
                id: `PAY${String(payrolls.length + 1).padStart(3, '0')}`,
                employeeId: values.employeeId,
                month: values.month,
                year: values.year,
                basicSalary: values.basicSalary,
                deductions: values.deductions,
                status: values.status,
                employeeName: employee?.name || "Unknown",
                netSalary,
                paymentDate: values.status === "Paid" ? new Date().toISOString().split('T')[0] : undefined
            };
            setPayrolls([...payrolls, newRecord]);
            toast.success("Payroll period added successfully");
        }
        setIsOpen(false);
        setEditingId(null);
        form.reset();
    };

    const handleEdit = (record: PayrollRecord) => {
        setEditingId(record.id);
        form.reset({
            employeeId: record.employeeId,
            month: record.month,
            year: record.year,
            basicSalary: record.basicSalary,
            deductions: record.deductions,
            status: record.status,
        });
        setIsOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this payroll record?")) {
            setPayrolls(payrolls.filter(p => p.id !== id));
            toast.success("Record deleted");
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        form.reset({
            employeeId: "",
            month: months[new Date().getMonth()],
            year: new Date().getFullYear().toString(),
            basicSalary: 0,
            deductions: 0,
            status: "Pending",
        });
        setIsOpen(true);
    };

    const filteredPayroll = payrolls.filter(p =>
        p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.month.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout title="Payroll Management" subtitle="Manage employee salaries, generate payroll periods, and track history.">
            <div className="space-y-6 max-w-7xl mx-auto animate-slide-up">
                {/* Header Actions */}
                <div className="flex justify-end items-center">
                    <Button onClick={openAddModal} className="gap-2 bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4" /> Add Payroll Period
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(
                                    payrolls.filter(p => p.status === "Paid").reduce((acc, curr) => acc + curr.netSalary, 0)
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {payrolls.filter(p => p.status === "Pending").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(
                                    payrolls.length ? payrolls.reduce((acc, curr) => acc + curr.basicSalary, 0) / payrolls.length : 0
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by employee or month..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-[300px]">
                        <Select onValueChange={(val) => setSearchQuery(val === "all" ? "" : val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Month..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Months</SelectItem>
                                {months.map(m => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Period</TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead>Basic Salary</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Salary</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayroll.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        No payroll records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPayroll.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium bg-gray-50/50">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {record.month} {record.year}
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.employeeName}</TableCell>
                                        <TableCell>{record.basicSalary.toLocaleString()}</TableCell>
                                        <TableCell className="text-red-600">-{record.deductions.toLocaleString()}</TableCell>
                                        <TableCell className="font-bold text-green-700">{record.netSalary.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${record.status === "Paid" ? "bg-green-100 text-green-800" :
                                                    record.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                                                }`}>
                                                {record.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(record)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Payroll Period" : "Add Payroll Period"}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                <FormField
                                    control={form.control}
                                    name="employeeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Employee</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingId}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose an employee..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {employees.map(emp => (
                                                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="month"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Pay Month</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select month" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {months.map(m => (
                                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="basicSalary"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Basic Salary</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="deductions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deductions</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="Processing">Processing</SelectItem>
                                                    <SelectItem value="Paid">Paid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                    <Button type="submit">{editingId ? "Update Payroll" : "Add Payroll Period"}</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
};

export default PayrollManagement;
