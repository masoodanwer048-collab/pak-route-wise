import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Truck, Package, Clock, FileText, CloudDownload, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BiltyTemplate from "@/components/documents/BiltyTemplate";
import ActionsMenu from "@/components/common/ActionsMenu";
import ExportActions from "@/components/common/ExportActions";

interface DispatchRecord {
    id: string;
    dispatchId: string;
    vehicle: string;
    driver: string;
    destination: string;
    loadType: string;
    status: "Scheduled" | "In Transit" | "Delivered";
    departureTime: string;
}

const initialDispatches: DispatchRecord[] = [
    { id: "1", dispatchId: "DSP-5001", vehicle: "LES-9901", driver: "Ahmed Ali", destination: "Lahore Distribution Center", loadType: "FMCG", status: "In Transit", departureTime: "08:00 AM" },
    { id: "2", dispatchId: "DSP-5002", vehicle: "LHR-3321", driver: "Bilal Khan", destination: "Islamabad Warehouse", loadType: "Electronics", status: "Scheduled", departureTime: "Pending" },
    { id: "3", dispatchId: "DSP-5003", vehicle: "KHI-1122", driver: "Chaudhry Riaz", destination: "Multan Depot", loadType: "Textiles", status: "Delivered", departureTime: "Yesterday" },
];

const Dispatch = () => {
    const [dispatches, setDispatches] = useState<DispatchRecord[]>(initialDispatches);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // State for Bilty Dialog
    const [selectedDispatch, setSelectedDispatch] = useState<DispatchRecord | null>(null);
    const [isBiltyOpen, setIsBiltyOpen] = useState(false);

    const { toast } = useToast();

    const handleCreateDispatch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newDispatch: DispatchRecord = {
            id: Math.random().toString(),
            dispatchId: `DSP-${Math.floor(Math.random() * 10000)}`,
            vehicle: formData.get("vehicle") as string,
            driver: formData.get("driver") as string,
            destination: formData.get("destination") as string,
            loadType: formData.get("loadType") as string,
            status: "Scheduled",
            departureTime: "Pending"
        };
        setDispatches([newDispatch, ...dispatches]);
        setIsCreateOpen(false);
        toast({
            title: "Dispatch Created",
            description: `Dispatch ${newDispatch.dispatchId} scheduled for ${newDispatch.destination}.`
        });
    };

    const handleDelete = (id: string) => {
        setDispatches(dispatches.filter(d => d.id !== id));
        toast({ title: "Record Deleted", description: "Dispatch record removed." });
    };

    const handleGenerateBilty = (dispatch: DispatchRecord) => {
        setSelectedDispatch(dispatch);
        setIsBiltyOpen(true);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Local Dispatch</h1>
                    <p className="text-muted-foreground">Manage local fleet dispatch and transportation schedules.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportActions
                        data={dispatches}
                        fileName="dispatch_records"
                        columnMapping={{
                            dispatchId: "Dispatch ID",
                            loadType: "Cargo Type"
                        }}
                    />
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Create Dispatch
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule New Dispatch</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateDispatch} className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="vehicle">Vehicle Number</Label>
                                        <Input id="vehicle" name="vehicle" placeholder="e.g. LES-1234" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="driver">Driver Name</Label>
                                        <Input id="driver" name="driver" placeholder="Driver Name" required />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="destination">Destination</Label>
                                    <Input id="destination" name="destination" placeholder="Warehouse / Client Location" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="loadType">Load Type</Label>
                                    <Select name="loadType" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Load Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FMCG">FMCG</SelectItem>
                                            <SelectItem value="Electronics">Electronics</SelectItem>
                                            <SelectItem value="Textiles">Textiles</SelectItem>
                                            <SelectItem value="Perishables">Perishables</SelectItem>
                                            <SelectItem value="General Cargo">General Cargo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit">Schedule Dispatch</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled Today</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dispatches.filter(d => d.status === "Scheduled").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Fleet</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dispatches.filter(d => d.status === "In Transit").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dispatches.filter(d => d.status === "Delivered").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Dispatch Board</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search dispatch..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Load</TableHead>
                                <TableHead>Departure</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dispatches.map((dispatch) => (
                                <TableRow key={dispatch.id}>
                                    <TableCell className="font-mono">{dispatch.dispatchId}</TableCell>
                                    <TableCell>{dispatch.vehicle}</TableCell>
                                    <TableCell>{dispatch.driver}</TableCell>
                                    <TableCell>{dispatch.destination}</TableCell>
                                    <TableCell>{dispatch.loadType}</TableCell>
                                    <TableCell>{dispatch.departureTime}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            dispatch.status === "Delivered" ? "default" :
                                                dispatch.status === "In Transit" ? "secondary" : "outline"
                                        } className={dispatch.status === "Delivered" ? "bg-green-600 hover:bg-green-700" : ""}>
                                            {dispatch.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ActionsMenu
                                            onView={() => toast({ description: `Viewing details for ${dispatch.dispatchId}` })}
                                            onEdit={() => toast({ description: `Editing ${dispatch.dispatchId} (Demo)` })}
                                            onDelete={() => handleDelete(dispatch.id)}
                                            onPrint={() => window.print()}
                                            customActions={[
                                                {
                                                    label: "Generate Bilty",
                                                    icon: <FileText className="h-4 w-4" />,
                                                    onClick: () => handleGenerateBilty(dispatch)
                                                },
                                                {
                                                    label: "Download Manifest",
                                                    icon: <CloudDownload className="h-4 w-4" />,
                                                    onClick: () => toast({ description: "Downloading Manifest..." })
                                                },
                                                {
                                                    label: "Email to Driver",
                                                    icon: <Mail className="h-4 w-4" />,
                                                    onClick: () => toast({ description: "Email sent." })
                                                }
                                            ]}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Bilty Dialog Managed Externally */}
            <Dialog open={isBiltyOpen} onOpenChange={setIsBiltyOpen}>
                <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generate Bilty (S.No: {selectedDispatch?.dispatchId})</DialogTitle>
                    </DialogHeader>
                    {selectedDispatch && (
                        <BiltyTemplate data={{
                            grNumber: selectedDispatch.dispatchId.replace('DSP-', ''),
                            date: new Date().toLocaleDateString(),
                            vehicleNo: selectedDispatch.vehicle,
                            driverName: selectedDispatch.driver,
                            driverMobile: "0300-1234567",
                            driverCNIC: "35201-1234567-1",
                            from: "Lahore",
                            to: selectedDispatch.destination,
                            sender: { name: "Sender Ltd", address: "Lahore, Pakistan", phone: "042-111-222" },
                            receiver: { name: "Receiver Corp", address: selectedDispatch.destination, phone: "021-333-444" },
                            items: [
                                { qty: 50, description: selectedDispatch.loadType, packing: "Carton", weight: 500, chargedWeight: 500, rate: "10/kg" }
                            ],
                            totals: {
                                qty: 50,
                                freight: 5000,
                                biltyCharges: 200,
                                labor: 500,
                                other: 0,
                                total: 5700,
                                totalInWords: "Five Thousand Seven Hundred Only"
                            },
                            paymentType: "ToPay"
                        }} />
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default Dispatch;
