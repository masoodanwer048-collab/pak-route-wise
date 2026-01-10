import React, { useState } from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, AlertTriangle, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface DemurrageRecord {
    id: string;
    containerNo: string;
    vessel: string;
    arrivalDate: string;
    freeDays: number;
    daysOverdue: number;
    chargePerDay: number;
    totalCharge: number;
    status: "Accruing" | "Cleared";
}

const initialDemurrage: DemurrageRecord[] = [
    { id: "1", containerNo: "MSCU-1234567", vessel: "MSC AL GHEZA", arrivalDate: "2023-11-01", freeDays: 14, daysOverdue: 5, chargePerDay: 50, totalCharge: 250, status: "Accruing" },
    { id: "2", containerNo: "MAEU-9876543", vessel: "MAERSK KINLOSS", arrivalDate: "2023-11-10", freeDays: 21, daysOverdue: 0, chargePerDay: 50, totalCharge: 0, status: "Cleared" },
];

const Demurrage = () => {
    const [records, setRecords] = useState<DemurrageRecord[]>(initialDemurrage);
    const [calcResult, setCalcResult] = useState<number | null>(null);

    const handleCalculate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const days = Number(formData.get("days"));
        const rate = Number(formData.get("rate"));
        const total = days * rate;
        setCalcResult(total);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Demurrage Management</h1>
                    <p className="text-muted-foreground">Track container detention and port storage charges.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" /> Calculator
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Demurrage Calculator</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCalculate} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="days">Overdue Days</Label>
                                <Input id="days" name="days" type="number" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rate">Daily Rate ($)</Label>
                                <Input id="rate" name="rate" type="number" defaultValue="50" required />
                            </div>
                            <Button type="submit">Calculate</Button>
                            {calcResult !== null && (
                                <div className="mt-4 text-center p-4 bg-gray-100 rounded-lg">
                                    <span className="text-sm text-gray-500">Estimated Charge:</span>
                                    <div className="text-2xl font-bold text-red-600">${calcResult}</div>
                                </div>
                            )}
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Containers Overdue</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{records.filter(r => r.daysOverdue > 0).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Charges Accrued</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${records.reduce((acc, curr) => acc + curr.totalCharge, 0)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Demurrage Tracking</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input type="search" placeholder="Search container..." className="pl-8" />
                            </div>
                            <ExportActions
                                data={records}
                                fileName="demurrage_report"
                                columnMapping={{
                                    containerNo: "Container No",
                                    vessel: "Vessel",
                                    freeDays: "Free Days",
                                    daysOverdue: "Overdue Days",
                                    totalCharge: "Total Charge ($)"
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Container No</TableHead>
                                <TableHead>Vessel</TableHead>
                                <TableHead>Arrival</TableHead>
                                <TableHead>Free Days</TableHead>
                                <TableHead>Overdue (Days)</TableHead>
                                <TableHead>Total ($)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-mono">{record.containerNo}</TableCell>
                                    <TableCell>{record.vessel}</TableCell>
                                    <TableCell>{record.arrivalDate}</TableCell>
                                    <TableCell>{record.freeDays}</TableCell>
                                    <TableCell className={record.daysOverdue > 0 ? "text-red-600 font-bold" : ""}>{record.daysOverdue}</TableCell>
                                    <TableCell>${record.totalCharge}</TableCell>
                                    <TableCell>
                                        <Badge variant={record.status === "Accruing" ? "destructive" : "outline"}>{record.status}</Badge>
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

export default Demurrage;
