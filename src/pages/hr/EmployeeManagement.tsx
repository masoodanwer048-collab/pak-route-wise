
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Plus, Pencil, Trash2, Search, User } from "lucide-react";
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

interface Employee {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    phone: string;
    status: "Active" | "Inactive";
}

// Mock Data
const initialEmployees: Employee[] = [
    { id: "EMP001", name: "Ahmed Khan", role: "Logistics Manager", email: "ahmed.k@example.com", department: "Operations", phone: "+92 300 1234567", status: "Active" },
    { id: "EMP002", name: "Sarah Ali", role: "Finance Officer", email: "sarah.a@example.com", department: "Finance", phone: "+92 300 7654321", status: "Active" },
    { id: "EMP003", name: "Bilal Hussain", role: "Driver", email: "bilal.h@example.com", department: "Transport", phone: "+92 300 9988776", status: "Active" },
    { id: "EMP004", name: "Zainab Bibi", role: "HR Manager", email: "zainab.b@example.com", department: "HR", phone: "+92 300 5554433", status: "Active" },
];

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    department: z.string().min(2, "Department is required"),
    phone: z.string().min(10, "Phone number is required"),
    status: z.enum(["Active", "Inactive"]),
});

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
    const [isOpen, setIsOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            role: "",
            email: "",
            department: "",
            phone: "",
            status: "Active",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (editingEmployee) {
            setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...values, id: emp.id } : emp));
            toast.success("Employee updated successfully");
        } else {
            const newEmployee = { ...values, id: `EMP${String(employees.length + 1).padStart(3, '0')}` };
            setEmployees([...employees, newEmployee]);
            toast.success("Employee added successfully");
        }
        setIsOpen(false);
        setEditingEmployee(null);
        form.reset();
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        form.reset(employee);
        setIsOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this employee?")) {
            setEmployees(employees.filter(emp => emp.id !== id));
            toast.success("Employee deleted successfully");
        }
    };

    const openAddModal = () => {
        setEditingEmployee(null);
        form.reset({
            name: "",
            role: "",
            email: "",
            department: "",
            phone: "",
            status: "Active",
        });
        setIsOpen(true);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout title="Employee Management" subtitle="Manage employee records, roles, and contact information.">
            <div className="space-y-6 max-w-7xl mx-auto animate-slide-up">
                {/* Header Actions */}
                <div className="flex justify-end items-center">
                    <Button onClick={openAddModal} className="gap-2 bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4" /> Add Employee
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{employees.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Active Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {employees.filter(e => e.status === "Active").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Departments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(employees.map(e => e.department)).size}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search employees by name, ID, or role..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-[300px]">
                        <Select onValueChange={(val) => {
                            const emp = employees.find(e => e.id === val);
                            if (emp) handleEdit(emp);
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Quick Select to Edit..." />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.role})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Email & Phone</TableHead>
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
                                filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium bg-gray-50/50">{employee.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {employee.name.charAt(0)}
                                                </div>
                                                {employee.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{employee.role}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {employee.department}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{employee.email}</span>
                                                <span className="text-muted-foreground text-xs">{employee.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${employee.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                                }`}>
                                                {employee.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
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

                {/* Dialog */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role/Designation</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Manager" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="department"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Dept" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Operations">Operations</SelectItem>
                                                            <SelectItem value="Finance">Finance</SelectItem>
                                                            <SelectItem value="Transport">Transport</SelectItem>
                                                            <SelectItem value="HR">HR</SelectItem>
                                                            <SelectItem value="Sales">Sales</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@example.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+92 300..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Active">Active</SelectItem>
                                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                    <Button type="submit">{editingEmployee ? "Update Employee" : "Add Employee"}</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
};

export default EmployeeManagement;
