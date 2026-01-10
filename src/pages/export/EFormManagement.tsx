import React, { useState } from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, FileText } from "lucide-react";

interface EForm {
    id: string;
    formNumber: string;
    exporter: string;
    bank: string;
    amount: string;
    status: "Pending" | "Approved" | "Rejected";
    date: string;
}

const initialEForms: EForm[] = [
    { id: "1", formNumber: "EF-2023-001", exporter: "ABC Textiles", bank: "HBL", amount: "$50,000", status: "Approved", date: "2023-10-01" },
    { id: "2", formNumber: "EF-2023-002", exporter: "XYZ Logistics", bank: "UBL", amount: "$12,000", status: "Pending", date: "2023-10-05" },
    { id: "3", formNumber: "EF-2023-003", exporter: "Global Traders", bank: "Meezan", amount: "$8,500", status: "Rejected", date: "2023-10-10" },
];

const EFormManagement = () => {
    const [eForms, setEForms] = useState<EForm[]>(initialEForms);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const filteredForms = eForms.filter((form) =>
        form.formNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.exporter.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newForm: EForm = {
            id: Math.random().toString(),
            formNumber: `EF-2023-${Math.floor(Math.random() * 1000)}`,
            exporter: formData.get("exporter") as string,
            bank: formData.get("bank") as string,
            amount: formData.get("amount") as string,
            status: "Pending",
            date: new Date().toISOString().split("T")[0],
        };

        setEForms([newForm, ...eForms]);
        toast({
            title: "E-Form Created",
            description: `E-Form ${newForm.formNumber} has been successfully submitted.`,
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">E-Form Management</h1>
                    <p className="text-muted-foreground">Manage and track your electronic forms.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Issue New E-Form
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Issue New E-Form</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddForm} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="exporter">Exporter Name</Label>
                                <Input id="exporter" name="exporter" placeholder="Enter exporter name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bank">Bank Name</Label>
                                <Input id="bank" name="bank" placeholder="Enter bank name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (USD)</Label>
                                <Input id="amount" name="amount" placeholder="e.g. $10,000" required />
                            </div>
                            <Button type="submit" className="w-full">Create E-Form</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>All E-Forms</CardTitle>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search forms..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <div className="px-6 pb-2 flex justify-end">
                    <ExportActions
                        data={filteredForms}
                        fileName="e_forms"
                        columnMapping={{
                            formNumber: "Form No",
                            exporter: "Exporter",
                            bank: "Bank",
                            amount: "Amount",
                            status: "Status",
                            date: "Date"
                        }}
                    />
                </div>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Form Number</TableHead>
                                    <TableHead>Exporter</TableHead>
                                    <TableHead>Bank</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredForms.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredForms.map((form) => (
                                        <TableRow key={form.id}>
                                            <TableCell className="font-medium">{form.formNumber}</TableCell>
                                            <TableCell>{form.exporter}</TableCell>
                                            <TableCell>{form.bank}</TableCell>
                                            <TableCell>{form.amount}</TableCell>
                                            <TableCell>{form.date}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        form.status === "Approved"
                                                            ? "default" // "success" if defined, else generic default usually primary clr. defaulting to secondary or outline for others if needed.
                                                            : form.status === "Pending"
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                    className={
                                                        form.status === "Approved" ? "bg-green-600 hover:bg-green-700" : ""
                                                    }
                                                >
                                                    {form.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <FileText className="h-4 w-4" />
                                                    <span className="sr-only">View</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EFormManagement;
