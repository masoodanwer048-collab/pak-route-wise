import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Truck, Box, FileText, Shield, FileCheck, CircleDollarSign } from "lucide-react";
import { generateManifestPDF } from "@/utils/pdfGenerator";
import { Database } from "@/integrations/supabase/types";

type Manifest = Database['public']['Tables']['carrier_manifests']['Row'];

const ManifestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [manifest, setManifest] = useState<Manifest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchManifest(id);
    }, [id]);

    const fetchManifest = async (manifestId: string) => {
        try {
            const { data, error } = await supabase
                .from("carrier_manifests")
                .select("*")
                .eq("id", manifestId)
                .single();

            if (error) throw error;
            setManifest(data);
        } catch (error: any) {
            console.error("Error fetching manifest:", error);
            toast.error("Failed to load manifest details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center">Loading enterprise manifest details...</div>;
    if (!manifest) return <div className="p-8">Manifest not found</div>;

    const InfoRow = ({ label, value }: { label: string, value?: string | number | null }) => (
        <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-900 text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/carrier/manifests")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{manifest.manifest_number}</h1>
                            <Badge className={manifest.status === 'RECEIVED' ? 'bg-green-600' : 'bg-blue-600'}>
                                {manifest.status}
                            </Badge>
                            <Badge variant="outline">{manifest.manifest_type}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {manifest.origin_hub} <span className="text-slate-300 mx-2">➔</span> {manifest.destination_hub}
                            <span className="mx-2">•</span>
                            Dispatch: {manifest.dispatch_date_time ? new Date(manifest.dispatch_date_time).toLocaleDateString() : 'Pending'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => manifest && generateManifestPDF(manifest)}>
                        <Printer className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                    {/* Placeholder for status actions */}
                    <Button>Update Status</Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="logistics" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5 h-auto md:h-10">
                    <TabsTrigger value="logistics">Logistics & Driver</TabsTrigger>
                    <TabsTrigger value="customs">Customs & Cargo</TabsTrigger>
                    <TabsTrigger value="security">Security & Ops</TabsTrigger>
                    <TabsTrigger value="finance">Financials</TabsTrigger>
                    <TabsTrigger value="docs">Shipments</TabsTrigger>
                </TabsList>

                {/* LOGISTICS TAB */}
                <TabsContent value="logistics" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center text-lg"><Truck className="mr-2 h-5 w-5 text-blue-600" /> Vehicle Profile</CardTitle></CardHeader>
                            <CardContent className="px-6">
                                <InfoRow label="Registration No" value={manifest.vehicle_reg_no} />
                                <InfoRow label="Make / Model" value={`${manifest.vehicle_make || ''} ${manifest.vehicle_model || ''}`} />
                                <InfoRow label="Engine No" value={manifest.engine_no} />
                                <InfoRow label="Chassis No" value={manifest.chassis_no} />
                                <InfoRow label="Fitness Expiry" value={manifest.fitness_expiry} />
                                <InfoRow label="Insurance Exp" value={manifest.vehicle_insurance_expiry} />
                                <InfoRow label="Odometer Start" value={manifest.odometer_start} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center text-lg"><FileText className="mr-2 h-5 w-5 text-blue-600" /> Driver & Carrier</CardTitle></CardHeader>
                            <CardContent className="px-6">
                                <InfoRow label="Carrier Name" value={manifest.carrier_name} />
                                <InfoRow label="Driver Name" value={manifest.driver_name} />
                                <InfoRow label="Driver CNIC" value={manifest.driver_cnic} />
                                <InfoRow label="Mobile" value={manifest.driver_mobile} />
                                <InfoRow label="License No" value={manifest.driver_license_no} />
                                <InfoRow label="Helper Name" value={manifest.helper_name} />
                                <InfoRow label="Carrier Phone" value={manifest.carrier_phone} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* CUSTOMS TAB */}
                <TabsContent value="customs" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center text-lg"><FileCheck className="mr-2 h-5 w-5 text-amber-600" /> GD & Clearance</CardTitle></CardHeader>
                            <CardContent className="px-6">
                                <InfoRow label="GD Number" value={manifest.gd_number} />
                                <InfoRow label="GD Date" value={manifest.gd_date} />
                                <InfoRow label="IGM Number" value={manifest.igm_number} />
                                <InfoRow label="BL Number" value={manifest.bl_number} />
                                <InfoRow label="Clearing Agent" value={manifest.clearing_agent_name} />
                                <InfoRow label="Consignee" value={manifest.consignee_name} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center text-lg"><Box className="mr-2 h-5 w-5 text-amber-600" /> Container & Seal</CardTitle></CardHeader>
                            <CardContent className="px-6">
                                <InfoRow label="Container No" value={manifest.container_no} />
                                <InfoRow label="Size / Type" value={`${manifest.container_size || ''} ${manifest.container_type || ''}`} />
                                <InfoRow label="Seal Number" value={manifest.seal_no} />
                                <InfoRow label="Package Count" value={manifest.pkg_count} />
                                <InfoRow label="Gross Weight" value={manifest.gross_weight} />
                                <InfoRow label="Commodity" value={manifest.commodity_description} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center text-lg"><Shield className="mr-2 h-5 w-5 text-red-600" /> Security & Operations</CardTitle></CardHeader>
                        <CardContent className="px-6 grid grid-cols-1 md:grid-cols-2 gap-x-12">
                            <div className="space-y-1">
                                <InfoRow label="Security Status" value={manifest.security_check_status} />
                                <InfoRow label="Guard Name" value={manifest.security_guard_name} />
                                <InfoRow label="Police Escort" value={manifest.police_escort_required ? 'YES' : 'NO'} />
                            </div>
                            <div className="space-y-1">
                                <InfoRow label="Shift" value={manifest.dispatch_shift} />
                                <InfoRow label="Departure Gate" value={manifest.departure_gate} />
                                <InfoRow label="Trip ID" value={manifest.trip_id} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FINANCIALS TAB */}
                <TabsContent value="finance" className="mt-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center text-lg"><CircleDollarSign className="mr-2 h-5 w-5 text-green-600" /> Trip Financials</CardTitle></CardHeader>
                        <CardContent className="px-6 grid grid-cols-1 md:grid-cols-2 gap-x-12">
                            <InfoRow label="Carrier Cost" value={manifest.carrier_cost} />
                            <InfoRow label="Fuel Cost" value={manifest.fuel_cost} />
                            <InfoRow label="Toll Charges" value={manifest.toll_charges} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SHIPMENTS TAB */}
                <TabsContent value="docs" className="mt-6">
                    <Card>
                        <CardHeader><CardTitle>Manifested Shipments</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground border-dashed border-2 rounded-md bg-slate-50">
                                <Box className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <p>Load Shipments via Scanning or Bulk Import</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default ManifestDetails;
