import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Lock, CalendarClock, ShieldCheck, FileKey } from "lucide-react";

interface BondedItem {
    id: string;
    bondNumber: string;
    gdRef: string;
    consignee: string;
    itemDesc: string;
    valueUsd: string;
    expiryDate: string;
    status: "Bonded" | "Ex-Bonded" | "Expired";
}

const initialBonded: BondedItem[] = [
    { id: "1", bondNumber: "BND-8890", gdRef: "KHI-GD-1001", consignee: "Global Traders", itemDesc: "Electronics Components", valueUsd: "$50,000", expiryDate: "2024-06-30", status: "Bonded" },
    { id: "2", bondNumber: "BND-8891", gdRef: "KHI-GD-1022", consignee: "Auto Parts Ltd", itemDesc: "Engine Parts", valueUsd: "$120,000", expiryDate: "2024-01-15", status: "Bonded" },
    { id: "3", bondNumber: "BND-8850", gdRef: "KHI-GD-0900", consignee: "Textile Mills", itemDesc: "Raw Silk", valueUsd: "$5,000", expiryDate: "2023-10-01", status: "Ex-Bonded" },
];

const BondedWarehouse = () => {
    const [bondedItems, setBondedItems] = useState<BondedItem[]>(initialBonded);
    const [isEntryOpen, setIsEntryOpen] = useState(false);
    const { toast } = useToast();

    const handleBondEntry = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItem: BondedItem = {
            id: Math.random().toString(),
            bondNumber: `BND-${Math.floor(Math.random() * 10000)}`,
            gdRef: formData.get("gdRef") as string,
            consignee: formData.get("consignee") as string,
            itemDesc: formData.get("itemDesc") as string,
            valueUsd: `$${formData.get("value")}`,
            expiryDate: formData.get("expiry") as string,
            status: "Bonded"
        };

        setBondedItems([newItem, ...bondedItems]);
        setIsEntryOpen(false);
        toast({
            title: "Bond Entry Successful",
            description: `Bond ${newItem.bondNumber} registered for ${newItem.consignee}.`
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Bonded Warehouse</h1>
                    <p className="text-muted-foreground">Manage customs bonded cargo and expiry tracking.</p>
                </div>
                <Dialog open={isEntryOpen} onOpenChange={setIsEntryOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Lock className="h-4 w-4" /> New Bond Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Register Bonded Cargo</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBondEntry} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="gdRef">GD Reference Number</Label>
                                <Input id="gdRef" name="gdRef" placeholder="e.g. KHI-GD-..." required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="consignee">Consignee Name</Label>
                                <Input id="consignee" name="consignee" placeholder="Importer Name" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="itemDesc">Item Description</Label>
                                <Input id="itemDesc" name="itemDesc" placeholder="Brief description of goods" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="value">Declared Value (USD)</Label>
                                    <Input id="value" name="value" type="number" placeholder="0.00" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="expiry">Bond Expiry Date</Label>
                                    <Input id="expiry" name="expiry" type="date" required />
                                </div>
                            </div>
                            <Button type="submit">Submit Entry</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bonds</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bondedItems.filter(i => i.status === "Bonded").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <CalendarClock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        {/* Mock logic for "Expiring Soon" */}
                        <div className="text-2xl font-bold text-yellow-600">1</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clearance Pending</CardTitle>
                        <FileKey className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Bond Register</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search bond no..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bond No</TableHead>
                                <TableHead>GD Ref</TableHead>
                                <TableHead>Consignee</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bondedItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono">{item.bondNumber}</TableCell>
                                    <TableCell>{item.gdRef}</TableCell>
                                    <TableCell>{item.consignee}</TableCell>
                                    <TableCell>{item.valueUsd}</TableCell>
                                    <TableCell>{item.expiryDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "Bonded" ? "default" : "secondary"}>{item.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Audit</Button>
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

export default BondedWarehouse;
