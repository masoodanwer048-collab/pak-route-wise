import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from "@/hooks/useVehicles";

interface VehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle?: Vehicle; // If present, edit mode
    onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
}

export function VehicleDialog({ open, onOpenChange, vehicle, onSave }: VehicleDialogProps) {
    const isEdit = !!vehicle;

    // Simple form handling. For production, Zod + React Hook Form is better, keeping it simple here.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newVehicle: Omit<Vehicle, 'id'> = {
            registration_number: formData.get("registration_number") as string,
            make: formData.get("make") as string,
            model: formData.get("model") as string,
            year: parseInt(formData.get("year") as string) || new Date().getFullYear(),
            capacity: formData.get("capacity") as string,
            status: formData.get("status") as 'Active' | 'Inactive' | 'Maintenance',
            driver_id: null, // Placeholder for now
        };

        onSave(newVehicle);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="registration_number">Registration No.</Label>
                            <Input
                                id="registration_number"
                                name="registration_number"
                                defaultValue={vehicle?.registration_number}
                                placeholder="ABC-123"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                name="year"
                                type="number"
                                defaultValue={vehicle?.year}
                                placeholder="2023"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="make">Make</Label>
                            <Input
                                id="make"
                                name="make"
                                defaultValue={vehicle?.make}
                                placeholder="Hino, Volvo..."
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                name="model"
                                defaultValue={vehicle?.model}
                                placeholder="Prime Mover..."
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="capacity">Capacity / Type</Label>
                        <Input
                            id="capacity"
                            name="capacity"
                            defaultValue={vehicle?.capacity}
                            placeholder="40ft Flatbed, 20 tons..."
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={vehicle?.status || "Active"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Vehicle</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
