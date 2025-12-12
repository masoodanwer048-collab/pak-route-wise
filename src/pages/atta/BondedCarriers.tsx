import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Truck, Building2 } from "lucide-react";

interface Carrier {
    id: string;
    name: string;
    licenseNumber: string;
    fleetSize: number;
    contact: string;
    status: "Authorized" | "Suspended" | "Pending Renewal";
}

const initialCarriers: Carrier[] = [
    { id: "1", name: "Afghan National Logistics", licenseNumber: "LIC-001", fleetSize: 50, contact: "+92-300-1234567", status: "Authorized" },
    { id: "2", name: "Khyber Transporters", licenseNumber: "LIC-002", fleetSize: 120, contact: "+92-321-9876543", status: "Authorized" },
    { id: "3", name: "Border Quick Move", licenseNumber: "LIC-005", fleetSize: 30, contact: "+92-333-5551122", status: "Suspended" },
];

const BondedCarriers = () => {
    const [carriers, setCarriers] = useState<Carrier[]>(initialCarriers);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { toast } = useToast();

    const handleAddCarrier = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCarrier: Carrier = {
            id: Math.random().toString(),
            name: formData.get("name") as string,
            licenseNumber: formData.get("licenseNumber") as string,
            fleetSize: parseInt(formData.get("fleetSize") as string) || 0,
            contact: formData.get("contact") as string,
            status: "Authorized"
        };

        setCarriers([...carriers, newCarrier]);
        setIsAddOpen(false);
        toast({
            title: "Carrier Added",
            description: `${newCarrier.name} has been successfully registered.`
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Bonded Carriers</h1>
                    <p className="text-muted-foreground">Registry of authorized bonded carriers for transit trade.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Register Carrier
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Register New Bonded Carrier</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCarrier} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Company Name</Label>
                                <Input id="name" name="name" placeholder="e.g. National Logistics" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="licenseNumber">License Number</Label>
                                <Input id="licenseNumber" name="licenseNumber" placeholder="LIC-XXXX" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fleetSize">Fleet Size</Label>
                                    <Input id="fleetSize" name="fleetSize" type="number" placeholder="0" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact">Contact Number</Label>
                                    <Input id="contact" name="contact" placeholder="+92..." required />
                                </div>
                            </div>
                            <Button type="submit">Register</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Authorized Fleets</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{carriers.filter(c => c.status === "Authorized").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vehicles Registered</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{carriers.reduce((acc, curr) => acc + curr.fleetSize, 0)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Carrier Registry</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search carrier..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Carrier Name</TableHead>
                                <TableHead>License</TableHead>
                                <TableHead>Fleet Size</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carriers.map((carrier) => (
                                <TableRow key={carrier.id}>
                                    <TableCell className="font-medium">{carrier.name}</TableCell>
                                    <TableCell>{carrier.licenseNumber}</TableCell>
                                    <TableCell>{carrier.fleetSize}</TableCell>
                                    <TableCell>{carrier.contact}</TableCell>
                                    <TableCell>
                                        <Badge variant={carrier.status === "Authorized" ? "default" : "destructive"}>
                                            {carrier.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
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

export default BondedCarriers;
