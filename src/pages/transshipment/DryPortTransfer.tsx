import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, Truck, Plus, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ExportActions from "@/components/common/ExportActions";

interface Transfer {
    id: string;
    reference: string;
    container: string;
    dryPort: string;
    status: "In Transit" | "Arrived" | "Pending";
    eta: string;
}

const initialTransfers: Transfer[] = [
    { id: "1", reference: "DP-8801", container: "CNTR-1001", dryPort: "Lahore Dry Port", status: "In Transit", eta: "2023-12-15" },
    { id: "2", reference: "DP-8802", container: "CNTR-1002", dryPort: "Faisalabad Dry Port", status: "Pending", eta: "2023-12-18" },
    { id: "3", reference: "DP-8803", container: "CNTR-1003", dryPort: "Sialkot Dry Port", status: "Arrived", eta: "2023-12-10" },
];

const DryPortTransfer = () => {
    const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const handleCreateTransfer = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const newTransfer: Transfer = {
            id: Math.random().toString(36).substr(2, 9),
            reference: `DP-${Math.floor(Math.random() * 10000)}`,
            container: formData.get("container") as string,
            dryPort: formData.get("dryPort") as string,
            status: "Pending",
            eta: formData.get("eta") as string,
        };

        setTransfers([newTransfer, ...transfers]);
        setIsCreateOpen(false);
        toast({
            title: "Transfer Initiated",
            description: `Transfer for ${newTransfer.container} to ${newTransfer.dryPort} started.`,
        });
    };

    const handleMarkArrived = (id: string) => {
        setTransfers(transfers.map(t => t.id === id ? { ...t, status: "Arrived" } : t));
        toast({
            title: "Status Updated",
            description: "Shipment marked as Arrived at Dry Port.",
        });
    };

    const filteredTransfers = transfers.filter(t =>
        t.container.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.dryPort.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dry Port Transfer</h1>
                    <p className="text-muted-foreground">Manage container moves from sea ports to inland dry ports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportActions
                        data={filteredTransfers}
                        fileName="dry_port_transfers"
                        columnMapping={{
                            reference: "Ref #",
                            dryPort: "Destination"
                        }}
                    />
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> New Transfer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Initiate Dry Port Transfer</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateTransfer} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="container">Container Number</Label>
                                    <Input id="container" name="container" placeholder="e.g. ABCD-1234567" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dryPort">Destination Dry Port</Label>
                                    <Select name="dryPort" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Dry Port" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lahore Dry Port">Lahore Dry Port</SelectItem>
                                            <SelectItem value="Faisalabad Dry Port">Faisalabad Dry Port</SelectItem>
                                            <SelectItem value="Sialkot Dry Port">Sialkot Dry Port</SelectItem>
                                            <SelectItem value="Multan Dry Port">Multan Dry Port</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="eta">Estimated Arrival (ETA)</Label>
                                    <Input id="eta" name="eta" type="date" required />
                                </div>
                                <Button type="submit">Create Transfer</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transfers.filter(t => t.status === "In Transit").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Arrived</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transfers.filter(t => t.status === "Arrived").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Transfer List</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search container..."
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
                                <TableHead>Reference</TableHead>
                                <TableHead>Container</TableHead>
                                <TableHead>Dry Port</TableHead>
                                <TableHead>ETA</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransfers.map((transfer) => (
                                <TableRow key={transfer.id}>
                                    <TableCell className="font-medium">{transfer.reference}</TableCell>
                                    <TableCell>{transfer.container}</TableCell>
                                    <TableCell>{transfer.dryPort}</TableCell>
                                    <TableCell>{transfer.eta}</TableCell>
                                    <TableCell>
                                        <Badge variant={transfer.status === "In Transit" ? "secondary" : transfer.status === "Arrived" ? "outline" : "default"}
                                            className={transfer.status === "In Transit" ? "bg-blue-100 text-blue-800" : transfer.status === "Arrived" ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {transfer.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {transfer.status === "In Transit" && (
                                            <Button variant="ghost" size="sm" onClick={() => handleMarkArrived(transfer.id)} title="Mark as Arrived">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </Button>
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

export default DryPortTransfer;
