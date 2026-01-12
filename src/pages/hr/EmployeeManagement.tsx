
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Plus, Pencil, Trash2, Search, User, FileText, Building, Wallet, Upload, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---
interface Employee {
    id: string;
    employee_code: string;
    name: string;
    designation: string;
    department: string;
    joining_date: string;
    status: "Active" | "Resigned" | "Terminated";
    cnic: string;
    email: string;
    phone: string;
    // Bank Info
    bank_name?: string;
    bank_account_no?: string;
    bank_iban?: string;
    // Salary Structure
    basic_pay: number;
    house_rent_allowance: number;
    medical_allowance: number;
    conveyance_allowance: number;
    other_allowances: number;
    gross_salary: number;
}

// --- Mock Data ---
const initialEmployees: Employee[] = [
    {
        id: "1",
        employee_code: "EMP-001",
        name: "Ahmed Khan",
        designation: "Logistics Manager",
        department: "Operations",
        joining_date: "2022-01-15",
        status: "Active",
        cnic: "42101-1234567-1",
        email: "ahmed@kohesar.com",
        phone: "+92 300 1234567",
        bank_name: "HBL",
        bank_account_no: "1234567890",
        basic_pay: 80000,
        house_rent_allowance: 20000,
        medical_allowance: 5000,
        conveyance_allowance: 5000,
        other_allowances: 0,
        gross_salary: 110000
    },
    {
        id: "2",
        employee_code: "EMP-002",
        name: "Sarah Ali",
        designation: "Senior Accountant",
        department: "Finance",
        joining_date: "2023-03-01",
        status: "Active",
        cnic: "42201-7654321-2",
        email: "sarah@kohesar.com",
        phone: "+92 333 9876543",
        bank_name: "Meezan Bank",
        bank_account_no: "0101234567",
        basic_pay: 60000,
        house_rent_allowance: 15000,
        medical_allowance: 5000,
        conveyance_allowance: 5000,
        other_allowances: 5000,
        gross_salary: 90000
    }
];

// --- Form Schema ---
const formSchema = z.object({
    // Personal
    name: z.string().min(2, "Name required"),
    designation: z.string().min(2, "Designation required"),
    department: z.string().min(2, "Department required"),
    joining_date: z.string().min(1, "Joining date required"),
    email: z.string().email(),
    phone: z.string().min(10, "Phone required"),
    cnic: z.string().min(13, "CNIC must be 13 digits"),
    status: z.enum(["Active", "Resigned", "Terminated"]),

    // Bank
    bank_name: z.string().optional(),
    bank_account_no: z.string().optional(),
    bank_iban: z.string().optional(),

    // Compensation
    basic_pay: z.string().transform((val) => Number(val) || 0),
    house_rent_allowance: z.string().transform((val) => Number(val) || 0),
    medical_allowance: z.string().transform((val) => Number(val) || 0),
    conveyance_allowance: z.string().transform((val) => Number(val) || 0),
    other_allowances: z.string().transform((val) => Number(val) || 0),
});


const EmployeeManagement = () => {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
    const [isOpen, setIsOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("personal");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "Active",
            basic_pay: 0,
            house_rent_allowance: 0,
            medical_allowance: 0,
            conveyance_allowance: 0,
            other_allowances: 0
        },
    });

    // Auto-calculate Gross Salary for display
    const { watch } = form;
    const basic = watch("basic_pay");
    const hra = watch("house_rent_allowance");
    const medical = watch("medical_allowance");
    const conveyance = watch("conveyance_allowance");
    const other = watch("other_allowances");
    const estimatedGross = (Number(basic) || 0) + (Number(hra) || 0) + (Number(medical) || 0) + (Number(conveyance) || 0) + (Number(other) || 0);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const gross = values.basic_pay + values.house_rent_allowance + values.medical_allowance + values.conveyance_allowance + values.other_allowances;

        if (editingEmployee) {
            setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...values, gross_salary: gross } : emp));
            toast.success("Employee updated successfully");
        } else {
            const newEmployee: Employee = {
                id: Math.random().toString(36).substr(2, 9),
                employee_code: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
                ...values,
                gross_salary: gross,
            };
            setEmployees([...employees, newEmployee]);
            toast.success("Employee added successfully");
        }
        setIsOpen(false);
        setEditingEmployee(null);
        form.reset();
        setActiveTab("personal");
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        form.reset({
            ...employee,
            basic_pay: employee.basic_pay as any,
            house_rent_allowance: employee.house_rent_allowance as any,
            medical_allowance: employee.medical_allowance as any,
            conveyance_allowance: employee.conveyance_allowance as any,
            other_allowances: employee.other_allowances as any,
        });
        setIsOpen(true);
    };

    const openAddModal = () => {
        setEditingEmployee(null);
        form.reset({
            status: "Active",
            basic_pay: 0,
            house_rent_allowance: 0,
            medical_allowance: 0,
            conveyance_allowance: 0,
            other_allowances: 0
        });
        setIsOpen(true);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout title="Employee Management" subtitle="Manage employee records, salaries, and employment details.">
            <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
                
                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Name, Code, Designation..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={openAddModal} className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4" /> Add New Employee
                    </Button>
                </div>

                {/* Employee List */}
                <Card>
                    <CardHeader className="px-6 py-4 border-b">
                        <CardTitle className="text-base font-medium">Employee Directory</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40">
                                    <TableHead>Code</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Designation & Dept</TableHead>
                                    <TableHead>Joining Date</TableHead>
                                    <TableHead>Gross Salary</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No employees found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <TableRow key={emp.id} className="hover:bg-muted/5">
                                            <TableCell className="font-mono text-xs">{emp.employee_code}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{emp.name}</span>
                                                    <span className="text-xs text-muted-foreground">{emp.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{emp.designation}</span>
                                                    <span className="text-xs text-muted-foreground">{emp.department}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{emp.joining_date}</TableCell>
                                            <TableCell className="font-medium">
                                                Rs. {emp.gross_salary.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={emp.status === "Active" ? "default" : "destructive"}>
                                                    {emp.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(emp)} className="h-8 w-8 p-0">
                                                    <Pencil className="h-4 w-4 text-primary" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Add/Edit Modal */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 gap-0">
                        <DialogHeader className="px-6 py-4 border-b">
                            <DialogTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                {editingEmployee ? `Edit ${editingEmployee.name}` : "New Employee Registration"}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                        <TabsList className="grid w-full grid-cols-3 mb-6">
                                            <TabsTrigger value="personal" className="gap-2"><User className="h-4 w-4"/> Personal</TabsTrigger>
                                            <TabsTrigger value="bank" className="gap-2"><Building className="h-4 w-4"/> Banking</TabsTrigger>
                                            <TabsTrigger value="salary" className="gap-2"><Wallet className="h-4 w-4"/> Comp & Benefits</TabsTrigger>
                                        </TabsList>

                                        {/* Personal Tab */}
                                        <TabsContent value="personal" className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Full Name *</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="cnic"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>CNIC No *</FormLabel>
                                                            <FormControl><Input placeholder="42xxx-xxxxxxx-x" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl><Input type="email" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mobile No *</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Separator className="my-2" />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="designation"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Designation *</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="department"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Department *</FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Operations">Operations</SelectItem>
                                                                        <SelectItem value="Finance">Finance</SelectItem>
                                                                        <SelectItem value="HR">HR</SelectItem>
                                                                        <SelectItem value="IT">IT</SelectItem>
                                                                        <SelectItem value="Transport">Transport</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="joining_date"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Date of Joining *</FormLabel>
                                                            <FormControl><Input type="date" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="status"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Employment Status</FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Active">Active</SelectItem>
                                                                        <SelectItem value="Resigned">Resigned</SelectItem>
                                                                        <SelectItem value="Terminated">Terminated</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TabsContent>

                                        {/* Bank Info Tab */}
                                        <TabsContent value="bank" className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="bank_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bank Name</FormLabel>
                                                        <FormControl><Input placeholder="e.g. Meezan Bank" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="bank_account_no"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Account Number</FormLabel>
                                                        <FormControl><Input placeholder="XXXXXXXX" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="bank_iban"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>IBAN (International Bank Account Number)</FormLabel>
                                                        <FormControl><Input placeholder="PK36 MEZN..." {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TabsContent>

                                        {/* Salary Structure Tab */}
                                        <TabsContent value="salary" className="space-y-4">
                                            <div className="bg-muted/30 p-4 rounded-lg border mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted-foreground">Est. Gross Salary</span>
                                                    <span className="text-2xl font-bold text-primary">Rs. {estimatedGross.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="basic_pay"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Basic Pay</FormLabel>
                                                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="house_rent_allowance"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>House Rent (HRA)</FormLabel>
                                                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="conveyance_allowance"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Conveyance</FormLabel>
                                                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="medical_allowance"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Medical</FormLabel>
                                                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="other_allowances"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Others</FormLabel>
                                                            <FormControl><Input type="number" min="0" {...field} /></FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TabsContent>

                                        <div className="flex justify-between pt-4 border-t mt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                            <Button type="submit">Save Employee Record</Button>
                                        </div>
                                    </Tabs>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
};

export default EmployeeManagement;
