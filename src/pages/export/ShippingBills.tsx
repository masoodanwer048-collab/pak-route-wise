import React, { useState } from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Ship, Download, Plus, FileText, MapPin, Calendar, Anchor } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ShippingBill {
    id: string;
    billNumber: string;
    vessel: string;
    portOfLoading: string;
    portOfDischarge: string;
    status: "Sailed" | "Pending" | "Customs Cleared";
    date: string;
}

const initialBills: ShippingBill[] = [
    { id: "1", billNumber: "SB-789012", vessel: "MSC ALICE", portOfLoading: "Karachi", portOfDischarge: "Dubai", status: "Sailed", date: "2023-11-12" },
    { id: "2", billNumber: "SB-789013", vessel: "MAERSK SEALAND", portOfLoading: "Qasim", portOfDischarge: "Singapore", status: "Pending", date: "2023-11-14" },
    { id: "3", billNumber: "SB-789014", vessel: "COSCO SHIPPING", portOfLoading: "Karachi", portOfDischarge: "Shanghai", status: "Customs Cleared", date: "2023-11-10" },
];

const ShippingBills = () => {
    const [bills, setBills] = useState<ShippingBill[]>(initialBills);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<ShippingBill | null>(null);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const handleCreateBill = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const newBill: ShippingBill = {
            id: Math.random().toString(36).substr(2, 9),
            billNumber: formData.get("billNumber") as string,
            vessel: formData.get("vessel") as string,
            portOfLoading: formData.get("portOfLoading") as string,
            portOfDischarge: formData.get("portOfDischarge") as string,
            status: "Pending", // Default new status
            date: new Date().toISOString().split('T')[0]
        };

        setBills([newBill, ...bills]);
        setIsCreateOpen(false);
        toast({
            title: "Shipping Bill Created",
            description: `Bill ${newBill.billNumber} for ${newBill.vessel} has been created successfully.`,
        });
    };



    const filteredBills = bills.filter(bill =>
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.vessel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Shipping Bills</h1>
                    <p className="text-muted-foreground">Monitor and manage your export shipping bills.</p>
                </div>
                <div className="flex gap-2">
                    <ExportActions
                        data={bills}
                        fileName="shipping_bills"
                        columnMapping={{
                            billNumber: "Bill Number",
                            vessel: "Vessel",
                            portOfLoading: "Loading Port",
                            portOfDischarge: "Discharge Port",
                            status: "Status",
                            date: "Date"
                        }}
                    />

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Create Bill
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Shipping Bill</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateBill} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="billNumber">Bill Number</Label>
                                    <Input id="billNumber" name="billNumber" placeholder="e.g. SB-123456" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="vessel">Vessel Name</Label>
                                    <Input id="vessel" name="vessel" placeholder="e.g. EVER GIVEN" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="portOfLoading">Port of Loading</Label>
                                        <Select name="portOfLoading" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Karachi">Karachi</SelectItem>
                                                <SelectItem value="Qasim">Qasim</SelectItem>
                                                <SelectItem value="Gwadar">Gwadar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="portOfDischarge">Port of Discharge</Label>
                                        <Input id="portOfDischarge" name="portOfDischarge" placeholder="e.g. Dubai" required />
                                    </div>
                                </div>
                                <Button type="submit">Create Bill</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                        <Ship className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bills.length}</div>
                        <p className="text-xs text-muted-foreground">Total active bills</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cleared by Customs</CardTitle>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Cleared</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bills.filter(b => b.status === "Customs Cleared").length}</div>
                        <p className="text-xs text-muted-foreground">Clearance count</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Departure</CardTitle>
                        <Badge variant="secondary">Pending</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bills.filter(b => b.status === "Pending").length}</div>
                        <p className="text-xs text-muted-foreground">Scheduled for this week</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Bills</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search bills..."
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
                                <TableHead>Bill Number</TableHead>
                                <TableHead>Vessel</TableHead>
                                <TableHead>Loading Port</TableHead>
                                <TableHead>Discharge Port</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBills.map((bill) => (
                                <TableRow key={bill.id}>
                                    <TableCell className="font-medium">{bill.billNumber}</TableCell>
                                    <TableCell>{bill.vessel}</TableCell>
                                    <TableCell>{bill.portOfLoading}</TableCell>
                                    <TableCell>{bill.portOfDischarge}</TableCell>
                                    <TableCell>{bill.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={bill.status === "Sailed" ? "secondary" : bill.status === "Customs Cleared" ? "outline" : "default"}
                                            className={bill.status === "Sailed" ? "bg-blue-100 text-blue-800" : bill.status === "Customs Cleared" ? "bg-green-100 text-green-800 border-green-200" : ""}
                                        >
                                            {bill.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedBill(bill)}>Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Bill Details {selectedBill?.billNumber}
                        </DialogTitle>
                        <DialogDescription>
                            Detailed information about the shipping bill and its current status.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBill && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Bill Number</Label>
                                    <div className="font-medium">{selectedBill.billNumber}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Date</Label>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span>{selectedBill.date}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Vessel Information</Label>
                                <div className="flex items-center gap-2 font-medium">
                                    <Anchor className="h-4 w-4 text-blue-600" />
                                    {selectedBill.vessel}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Port of Loading</Label>
                                    <div className="flex items-center gap-1 text-sm">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        {selectedBill.portOfLoading}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Port of Discharge</Label>
                                    <div className="flex items-center gap-1 text-sm">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        {selectedBill.portOfDischarge}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Current Status</Label>
                                <div>
                                    <Badge variant={selectedBill.status === "Sailed" ? "secondary" : selectedBill.status === "Customs Cleared" ? "outline" : "default"}
                                        className={`text-sm py-1 ${selectedBill.status === "Sailed" ? "bg-blue-100 text-blue-800" : selectedBill.status === "Customs Cleared" ? "bg-green-100 text-green-800 border-green-200" : ""}`}
                                    >
                                        {selectedBill.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedBill(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ShippingBills;
