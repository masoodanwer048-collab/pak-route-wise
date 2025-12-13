import React, { useState } from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Truck, Plus, FileSpreadsheet, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Shipment {
    id: string;
    gdNumber: string;
    consignee: string;
    items: string;
    route: "Torkham" | "Chaman";
    status: "Pending" | "En Route" | "Crossed Border";
}

const initialShipments: Shipment[] = [
    { id: "1", gdNumber: "ATTA-2901", consignee: "Kabul Trading Co", items: "Textiles", route: "Torkham", status: "En Route" },
    { id: "2", gdNumber: "ATTA-2902", consignee: "Afghan Logistics", items: "Electronics", route: "Chaman", status: "Pending" },
    { id: "3", gdNumber: "ATTA-2903", consignee: "Herat Imports", items: "Auto Parts", route: "Torkham", status: "Crossed Border" },
];

const ATTAManagement = () => {
    const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { toast } = useToast();

    const handleCreateShipment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newShipment: Shipment = {
            id: Math.random().toString(36).substr(2, 9),
            gdNumber: formData.get("gdNumber") as string,
            consignee: formData.get("consignee") as string,
            items: formData.get("items") as string,
            route: formData.get("route") as "Torkham" | "Chaman",
            status: "Pending",
        };

        setShipments([newShipment, ...shipments]);
        setIsCreateOpen(false);
        toast({
            title: "ATTA Shipment Created",
            description: `Shipment ${newShipment.gdNumber} for ${newShipment.consignee} has been initiated.`,
        });
    }

    const filteredShipments = shipments.filter(s =>
        s.gdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.consignee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout title="ATTA Management" subtitle="Manage Afghan Transit Trade Agreement shipments.">
            <div className="space-y-6 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">ATTA Management</h1>
                        <p className="text-muted-foreground">Manage Afghan Transit Trade Agreement shipments.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> New Shipment
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New ATTA Shipment</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateShipment} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="gdNumber">GD Number</Label>
                                    <Input id="gdNumber" name="gdNumber" placeholder="AT-..." required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="consignee">Consignee (Afghan Importer)</Label>
                                    <Input id="consignee" name="consignee" placeholder="Company Name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="items">Items Description</Label>
                                    <Input id="items" name="items" placeholder="e.g. Foodstuff, Cement" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="route">Route / Border Crossing</Label>
                                    <Select name="route" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Route" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Torkham">Torkham (Khyber)</SelectItem>
                                            <SelectItem value="Chaman">Chaman (Balochistan)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit">Create Shipment</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">En Route</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.filter(s => s.status === "En Route").length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Crossed Border</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.filter(s => s.status === "Crossed Border").length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Shipment Manifest</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search shipments..."
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
                                    <TableHead>GD Number</TableHead>
                                    <TableHead>Consignee</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredShipments.map((shipment) => (
                                    <TableRow key={shipment.id}>
                                        <TableCell className="font-medium">{shipment.gdNumber}</TableCell>
                                        <TableCell>{shipment.consignee}</TableCell>
                                        <TableCell>{shipment.items}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                {shipment.route}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                shipment.status === "Crossed Border" ? "default" :
                                                    shipment.status === "En Route" ? "secondary" : "outline"
                                            } className={shipment.status === "Crossed Border" ? "bg-green-600 hover:bg-green-700" : ""}>
                                                {shipment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Details</Button>
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

export default ATTAManagement;
