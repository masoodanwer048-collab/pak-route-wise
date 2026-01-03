import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { toast } from "sonner";

interface CarrierManifest {
    id: string;
    manifest_number: string;
    vehicle_number: string;
    driver_name: string;
    status: "DRAFT" | "SUBMITTED" | "APPROVED";
    updated_at: string;
}

const CarrierManifests = () => {
    const [manifests, setManifests] = useState<CarrierManifest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchManifests();
    }, []);

    const fetchManifests = async () => {
        try {
            const { data, error } = await supabase
                .from("carrier_manifests")
                .select("id, manifest_number, vehicle_number, driver_name, status, updated_at")
                .order("updated_at", { ascending: false });

            if (error) throw error;
            setManifests(data || []);
        } catch (error) {
            console.error("Error fetching manifests:", error);
            toast.error("Failed to load manifests");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge variant="default" className="bg-green-500">Approved</Badge>; // Assuming default is acceptable or using hardcoded classes
            case "SUBMITTED":
                return <Badge variant="secondary" className="bg-blue-500 text-white">Submitted</Badge>;
            case "DRAFT":
                return <Badge variant="outline">Draft</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Carrier Manifests</h1>
                    <p className="text-muted-foreground">
                        Manage your shipment manifests and track their status.
                    </p>
                </div>
                <Link to="/carrier/manifests/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Manifest
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manifest List</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : manifests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No manifests found. Create your first one!
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Manifest #</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {manifests.map((manifest) => (
                                    <TableRow key={manifest.id}>
                                        <TableCell className="font-medium">
                                            {manifest.manifest_number}
                                        </TableCell>
                                        <TableCell>{manifest.vehicle_number}</TableCell>
                                        <TableCell>{manifest.driver_name}</TableCell>
                                        <TableCell>{getStatusBadge(manifest.status)}</TableCell>
                                        <TableCell>
                                            {new Date(manifest.updated_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CarrierManifests;
