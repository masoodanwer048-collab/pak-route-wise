import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Truck, MoreVertical, Edit, Trash2, Wrench } from "lucide-react";
import { useVehicles, Vehicle } from "@/hooks/useVehicles";
import { VehicleDialog } from "@/components/fleet/VehicleDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Vehicles = () => {
    const { vehicles, isLoading, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredVehicles = vehicles.filter((v) =>
        v.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsDialogOpen(true);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteVehicle(deleteId);
            setDeleteId(null);
        }
    };

    const handleSave = (vehicleData: Omit<Vehicle, 'id'>) => {
        if (editingVehicle) {
            updateVehicle(editingVehicle.id, vehicleData);
        } else {
            addVehicle(vehicleData);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
            case 'Maintenance': return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
            default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Vehicle Management</h1>
                    <p className="text-muted-foreground">Manage fleet assets, maintenance status, and assignments.</p>
                </div>
                <Button onClick={() => { setEditingVehicle(undefined); setIsDialogOpen(true); }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Vehicle
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vehicles.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vehicles.filter(v => v.status === 'Active').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
                        <Wrench className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vehicles.filter(v => v.status === 'Maintenance').length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Fleet List</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search reg, make, model..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading fleet data...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Registration</TableHead>
                                    <TableHead>Make / Model</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVehicles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No vehicles found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell className="font-mono font-medium">{vehicle.registration_number}</TableCell>
                                            <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                                            <TableCell>{vehicle.year}</TableCell>
                                            <TableCell>{vehicle.capacity}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${getStatusColor(vehicle.status)} border-0`}>
                                                    {vehicle.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => setDeleteId(vehicle.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <VehicleDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                vehicle={editingVehicle}
                onSave={handleSave}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this vehicle from the fleet? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Vehicles;
