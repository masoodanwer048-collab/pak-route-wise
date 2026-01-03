import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, QrCode } from "lucide-react";

interface TransitPass {
    id: string;
    passNumber: string;
    gdRef: string;
    driverName: string;
    vehicleNo: string;
    issuedDate: string;
    validUntil: string;
    status: "Active" | "Expired";
}

const initialPasses: TransitPass[] = [
    { id: "1", passNumber: "TP-1001", gdRef: "ATTA-2901", driverName: "Rahim Gul", vehicleNo: "KAB-1234", issuedDate: "2023-10-01", validUntil: "2023-10-15", status: "Active" },
    { id: "2", passNumber: "TP-1002", gdRef: "ATTA-2902", driverName: "Dawood Khan", vehicleNo: "KBL-7788", issuedDate: "2023-10-05", validUntil: "2023-10-20", status: "Active" },
]

const TransitPassPage = () => {
    const [passes, setPasses] = useState<TransitPass[]>(initialPasses);
    const [isIssueOpen, setIsIssueOpen] = useState(false);
    const { toast } = useToast();

    const handleIssuePass = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPass: TransitPass = {
            id: Math.random().toString(),
            passNumber: `TP-${Math.floor(Math.random() * 10000)}`,
            gdRef: formData.get("gdRef") as string,
            driverName: formData.get("driverName") as string,
            vehicleNo: formData.get("vehicleNo") as string,
            issuedDate: new Date().toISOString().split('T')[0],
            validUntil: formData.get("validUntil") as string,
            status: "Active"
        };
        setPasses([newPass, ...passes]);
        setIsIssueOpen(false);
        toast({
            title: "Transit Pass Issued",
            description: `Pass ${newPass.passNumber} generated for ${newPass.driverName}.`
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Transit Pass</h1>
                    <p className="text-muted-foreground">Issue and verify transit passes for vehicles crossing the border.</p>
                </div>
                <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Issue New Pass
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Issue Transit Pass</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleIssuePass} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="gdRef">GD Reference Number</Label>
                                <Input id="gdRef" name="gdRef" placeholder="e.g. ATTA-2901" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="driverName">Driver Name</Label>
                                <Input id="driverName" name="driverName" placeholder="Full Name" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="vehicleNo">Vehicle Number</Label>
                                <Input id="vehicleNo" name="vehicleNo" placeholder="Vehicle Registration" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="validUntil">Valid Until</Label>
                                <Input id="validUntil" name="validUntil" type="date" required />
                            </div>
                            <Button type="submit">Generate Pass</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Issued Passes</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search pass..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pass Number</TableHead>
                                <TableHead>GD Ref</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Validity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {passes.map((pass) => (
                                <TableRow key={pass.id}>
                                    <TableCell className="font-mono">{pass.passNumber}</TableCell>
                                    <TableCell>{pass.gdRef}</TableCell>
                                    <TableCell>{pass.driverName}</TableCell>
                                    <TableCell>{pass.vehicleNo}</TableCell>
                                    <TableCell>{pass.validUntil}</TableCell>
                                    <TableCell>
                                        <Badge variant={pass.status === "Active" ? "default" : "destructive"}>{pass.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" title="View QR Code">
                                            <QrCode className="h-4 w-4" />
                                        </Button>
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

export default TransitPassPage;
