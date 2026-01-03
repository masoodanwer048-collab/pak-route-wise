import React, { useState } from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, FileText, DollarSign, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExportActions from "@/components/common/ExportActions";

interface Invoice {
    id: string;
    invoiceNo: string;
    client: string;
    type: string;
    amount: number;
    date: string;
    dueDate: string;
    status: "Paid" | "Pending" | "Overdue";
}

const initialInvoices: Invoice[] = [
    { id: "1", invoiceNo: "INV-2023-001", client: "ABC Textiles", type: "Freight Check", amount: 150000, date: "2023-11-20", dueDate: "2023-11-27", status: "Paid" },
    { id: "2", invoiceNo: "INV-2023-002", client: "Global Traders", type: "Customs Clearance", amount: 45000, date: "2023-11-25", dueDate: "2023-12-02", status: "Pending" },
    { id: "3", invoiceNo: "INV-2023-003", client: "Auto Parts Ltd", type: "Warehousing", amount: 25000, date: "2023-11-10", dueDate: "2023-11-17", status: "Overdue" },
];

const Invoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newInvoice: Invoice = {
            id: Math.random().toString(),
            invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            client: formData.get("client") as string,
            type: formData.get("type") as string,
            amount: Number(formData.get("amount")),
            date: new Date().toISOString().split('T')[0],
            dueDate: formData.get("dueDate") as string,
            status: "Pending"
        };

        setInvoices([newInvoice, ...invoices]);
        setIsCreateOpen(false);
        toast({
            title: "Invoice Generated",
            description: `${newInvoice.invoiceNo} for ${newInvoice.client} created.`
        });
    };

    return (
        <MainLayout title="Invoices" subtitle="Manage client billing and payment tracking.">
            <div className="space-y-6 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <ExportActions
                            data={invoices}
                            fileName="invoices_export"
                            columnMapping={{
                                invoiceNo: "Invoice #",
                                client: "Client Name",
                                amount: "Amount (PKR)"
                            }}
                        />
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Create Invoice
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Invoice</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateInvoice} className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="client">Client Name</Label>
                                        <Input id="client" name="client" placeholder="e.g. ABC Corp" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Service Type</Label>
                                        <Select name="type" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Freight Check">Freight & Transport</SelectItem>
                                                <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                                                <SelectItem value="Warehousing">Warehousing</SelectItem>
                                                <SelectItem value="Consultancy">Consultancy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="amount">Amount (PKR)</Label>
                                            <Input id="amount" name="amount" type="number" placeholder="0.00" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dueDate">Due Date</Label>
                                            <Input id="dueDate" name="dueDate" type="date" required />
                                        </div>
                                    </div>
                                    <Button type="submit">Generate Invoice</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rs. {invoices.reduce((acc, curr) => acc + (curr.status === "Paid" ? curr.amount : 0), 0).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                            <CreditCard className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">Rs. {invoices.reduce((acc, curr) => acc + (curr.status !== "Paid" ? curr.amount : 0), 0).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Invoices Issued</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{invoices.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Invoices</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search client..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.filter(i => i.client.toLowerCase().includes(searchTerm.toLowerCase()) || i.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())).map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-mono">{inv.invoiceNo}</TableCell>
                                        <TableCell className="font-medium">{inv.client}</TableCell>
                                        <TableCell>{inv.type}</TableCell>
                                        <TableCell>{inv.date}</TableCell>
                                        <TableCell>Rs. {inv.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                inv.status === "Paid" ? "default" :
                                                    inv.status === "Overdue" ? "destructive" : "secondary"
                                            } className={inv.status === "Paid" ? "bg-green-600" : ""}>
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};

export default Invoices;
