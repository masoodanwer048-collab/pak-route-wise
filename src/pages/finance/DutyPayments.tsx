import React, { useState } from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, CreditCard, Banknote, ShieldCheck } from "lucide-react";

interface DutyPayment {
    id: string;
    psid: string;
    gdRef: string;
    amount: number;
    head: string;
    bank: string;
    status: "Paid" | "Unpaid";
}

const initialDuties: DutyPayment[] = [
    { id: "1", psid: "PSID-99887766", gdRef: "KHI-GD-1001", amount: 250000, head: "Customs Duty", bank: "NBP", status: "Paid" },
    { id: "2", psid: "PSID-55443322", gdRef: "KHI-GD-1022", amount: 120000, head: "Sales Tax", bank: "-", status: "Unpaid" },
];

const DutyPayments = () => {
    const [duties, setDuties] = useState<DutyPayment[]>(initialDuties);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const { toast } = useToast();

    const handleCreatePSID = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newDuty: DutyPayment = {
            id: Math.random().toString(),
            psid: `PSID-${Math.floor(Math.random() * 100000000)}`,
            gdRef: formData.get("gdRef") as string,
            amount: Number(formData.get("amount")),
            head: formData.get("head") as string,
            bank: "-",
            status: "Unpaid"
        };

        setDuties([newDuty, ...duties]);
        setIsPayOpen(false);
        toast({
            title: "PSID Generated",
            description: `Payment Slip ID: ${newDuty.psid} created successfully.`
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Duty Payments</h1>
                    <p className="text-muted-foreground">Customs duties, taxes, and PSID management.</p>
                </div>
                <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" /> Generate PSID
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate Payment Slip (PSID)</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreatePSID} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="gdRef">GD Reference Number</Label>
                                <Input id="gdRef" name="gdRef" placeholder="e.g. KHI-GD-..." required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="head">Duty Head</Label>
                                <Input id="head" name="head" placeholder="e.g. Customs Duty, Sales Tax" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount (PKR)</Label>
                                <Input id="amount" name="amount" type="number" placeholder="0.00" required />
                            </div>
                            <Button type="submit">Create PSID</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Duties Paid Today</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. 0</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding PSIDs</CardTitle>
                        <CreditCard className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{duties.filter(d => d.status === "Unpaid").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>PSID Registry</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input type="search" placeholder="Search PSID..." className="pl-8" />
                            </div>
                            <ExportActions
                                data={duties}
                                fileName="duty_payments"
                                columnMapping={{
                                    psid: "PSID",
                                    gdRef: "GD Ref",
                                    amount: "Amount (PKR)",
                                    head: "Duty Head"
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PSID</TableHead>
                                <TableHead>GD Ref</TableHead>
                                <TableHead>Duty Head</TableHead>
                                <TableHead>Amount (PKR)</TableHead>
                                <TableHead>Bank</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {duties.map((duty) => (
                                <TableRow key={duty.id}>
                                    <TableCell className="font-mono">{duty.psid}</TableCell>
                                    <TableCell>{duty.gdRef}</TableCell>
                                    <TableCell>{duty.head}</TableCell>
                                    <TableCell>{duty.amount.toLocaleString()}</TableCell>
                                    <TableCell>{duty.bank}</TableCell>
                                    <TableCell>
                                        <Badge variant={duty.status === "Paid" ? "default" : "destructive"}>{duty.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {duty.status === "Unpaid" && (
                                            <Button size="sm" onClick={() => {
                                                const updated = duties.map(d => d.id === duty.id ? { ...d, status: "Paid" as const, bank: "Online" } : d);
                                                setDuties(updated);
                                                toast({ title: "Paid", description: `PSID ${duty.psid} marked as paid.` });
                                            }}>Pay Now</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default DutyPayments;
