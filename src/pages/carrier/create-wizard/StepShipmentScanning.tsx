import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ManifestFormValues } from "./manifestSchema";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Package } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const StepShipmentScanning = ({ form }: { form: UseFormReturn<ManifestFormValues> }) => {
    const [scanInput, setScanInput] = useState("");
    const [loading, setLoading] = useState(false);
    // Store full shipment objects for display, but form only keeps IDs
    const [scannedShipments, setScannedShipments] = useState<any[]>([]);

    const originHub = form.watch("origin_hub"); // Watch for validation

    const handleScan = async () => {
        if (!scanInput) return;
        setLoading(true);

        try {
            // Fetch shipment
            const { data, error } = await supabase
                .from("shipments")
                .select("*")
                .or(`shipment_id.eq.${scanInput},container_number.eq.${scanInput}`)
                .single();

            const shipment = data as any; // Cast to any to avoid generic type issues

            if (error || !shipment) {
                toast.error("Shipment not found!");
                return;
            }

            // Validations
            // 1. Check if already added
            if (scannedShipments.find(s => s.id === shipment.id)) {
                toast.warning("Shipment already added!");
                setScanInput("");
                return;
            }

            // 2. Check Origin (Optional but recommended)
            // If data.origin is just a city name, we might need loose matching or assume user knows
            // For now, we warn if mismatches but allow (override)
            if (originHub && shipment.origin && !originHub.includes(shipment.origin)) {
                toast.warning(`Warning: Shipment Origin (${shipment.origin}) differs from Manifest Origin`);
            }

            // 3. Check Status
            // if (data.status !== 'BOOKED' && data.status !== 'ARRIVED_AT_ORIGIN') {
            //    toast.error(`Shipment status is ${data.status}. Cannot manifest.`);
            //    return;
            // }

            // Add to list
            const newList = [...scannedShipments, shipment];
            setScannedShipments(newList);

            // Update form state
            const currentIds = form.getValues("shipment_ids") || [];
            form.setValue("shipment_ids", [...currentIds, shipment.id]);

            toast.success("Shipment added");
            setScanInput("");

        } catch (err) {
            console.error(err);
            toast.error("Error scanning shipment");
        } finally {
            setLoading(false);
        }
    };

    const removeShipment = (id: string) => {
        const newList = scannedShipments.filter(s => s.id !== id);
        setScannedShipments(newList);
        const currentIds = form.getValues("shipment_ids") || [];
        form.setValue("shipment_ids", currentIds.filter(cid => cid !== id));
    };

    return (
        <div className="space-y-6">
            <div className="max-w-xl mx-auto space-y-4">
                <div className="text-center mb-6">
                    <h3 className="text-lg font-medium">Scan Manifest Items</h3>
                    <p className="text-sm text-muted-foreground">Origin: {originHub || "Not Selected"}</p>
                </div>

                <div className="flex space-x-2">
                    <Input
                        placeholder="Scan CN / Barcode..."
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                        className="flex-1"
                    />
                    <Button onClick={handleScan} disabled={loading}>
                        {loading ? "..." : <Search className="h-4 w-4" />}
                    </Button>
                </div>

                <div className="border rounded-md min-h-[200px] bg-muted/20">
                    {scannedShipments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                            <Package className="h-8 w-8 mb-2 opacity-50" />
                            <p>No shipments loaded</p>
                        </div>
                    ) : (
                        <div className="divide-y max-h-[400px] overflow-y-auto">
                            {scannedShipments.map((s) => (
                                <div key={s.id} className="p-3 flex justify-between items-center bg-background">
                                    <div>
                                        <p className="font-medium text-sm">{s.shipment_id}</p>
                                        <p className="text-xs text-muted-foreground">{s.origin} &rarr; {s.destination} ({s.weight || '0'}kg)</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => removeShipment(s.id)}>
                                        <X className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between text-sm px-2">
                    <span>Total Items: {scannedShipments.length}</span>
                    <span>Total Weight: {scannedShipments.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0)} kg</span>
                </div>
            </div>
        </div>
    );
};

export default StepShipmentScanning;
