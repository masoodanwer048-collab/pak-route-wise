import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Truck, Box, FileText, Shield, FileCheck, CircleDollarSign, Edit, Trash2, FileSpreadsheet } from "lucide-react";
import { generateManifestPDF } from "@/utils/pdfGenerator";
import { Database } from "@/integrations/supabase/types";
import * as XLSX from "xlsx";

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

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this manifest?")) return;
        try {
            const { error } = await supabase.from("carrier_manifests").delete().eq("id", id);
            if (error) throw error;
            toast.success("Manifest deleted successfully");
            navigate("/carrier/manifests");
        } catch (error: any) {
            toast.error("Failed to delete manifest");
        }
    };

    const exportExcel = () => {
        if (!manifest) return;
        
        // Sheet 1: Summary
        const summaryData = [
            { "Field": "Manifest Number", "Value": manifest.manifest_number },
            { "Field": "Type", "Value": manifest.manifest_type },
            { "Field": "Status", "Value": manifest.status },
            { "Field": "Date", "Value": manifest.dispatch_date_time },
            { "Field": "Origin", "Value": manifest.origin_hub },
            { "Field": "Destination", "Value": manifest.destination_hub },
            { "Field": "Driver Name", "Value": manifest.driver_name },
            { "Field": "Driver CNIC", "Value": manifest.driver_cnic },
            { "Field": "Vehicle No", "Value": manifest.vehicle_reg_no },
            { "Field": "GD Number", "Value": manifest.gd_number },
            { "Field": "BL Number", "Value": manifest.bl_number },
            { "Field": "Container No", "Value": manifest.container_no },
            { "Field": "Package Count", "Value": manifest.pkg_count },
            { "Field": "Weight", "Value": manifest.gross_weight },
            { "Field": "Remarks", "Value": manifest.remarks },
        ];

        // Sheet 2: Shipments (Placeholder or linked items)
        const itemsData = [
            { "Item No": "1", "Description": manifest.commodity_description, "Qty": manifest.pkg_count, "Weight": manifest.gross_weight }
        ];
        
        const wb = XLSX.utils.book_new();
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        const wsItems = XLSX.utils.json_to_sheet(itemsData);

        XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
        XLSX.utils.book_append_sheet(wb, wsItems, "Shipments");
        
        XLSX.writeFile(wb, `Manifest_${manifest.manifest_number}.xlsx`);
    };

    if (loading) return <div className="p-8 flex justify-center">Loading manifest details...</div>;
    if (!manifest) return <div className="p-8">Manifest not found</div>;

    const InfoRow = ({ label, value }: { label: string, value?: string | number | null }) => (
        <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-900 text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Branding Header */}
            <div className="flex flex-col items-center justify-center border-b pb-6 space-y-2">
                <img src="/kohesar_logo.png" alt="Kohsar Logistics" className="h-16 w-auto object-contain" />
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">KOHSAR LOGISTICS (PRIVATE) LIMITED</h1>
                    <p className="text-sm font-medium text-slate-500 italic">"KEEP THE LORD ON THE ROAD"</p>
                </div>
            </div>

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
                            {manifest.status === 'SUBMITTED' && manifest.updated_at && (
                                <>
                                    <span className="mx-2">•</span>
                                    Submitted: {new Date(manifest.updated_at).toLocaleString()}
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/carrier/create?edit=${manifest.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="outline" onClick={() => manifest && generateManifestPDF(manifest)}>
                        <Printer className="mr-2 h-4 w-4" /> Print / PDF
                    </Button>
                    <Button variant="outline" onClick={exportExcel}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
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
                                <InfoRow label="Type" value={manifest.vehicle_type} />
                                <InfoRow label="Make / Model" value={`${manifest.vehicle_make || ''} ${manifest.vehicle_model || ''}`} />
                                <InfoRow label="Year" value={manifest.vehicle_year} />
                                <InfoRow label="Engine No" value={manifest.engine_no} />
                                <InfoRow label="Chassis No" value={manifest.chassis_no} />
                                <InfoRow label="Insurance Exp" value={manifest.vehicle_insurance_expiry} />
                                <InfoRow label="Tracker ID" value={manifest.tracker_id} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center text-lg"><FileText className="mr-2 h-5 w-5 text-blue-600" /> Driver & Carrier</CardTitle></CardHeader>
                            <CardContent className="px-6">
                                <InfoRow label="Driver Name" value={manifest.driver_name} />
                                <InfoRow label="Driver CNIC" value={manifest.driver_cnic} />
                                <InfoRow label="Mobile" value={manifest.driver_mobile} />
                                <InfoRow label="License No" value={manifest.driver_license_no} />
                                <InfoRow label="License Expiry" value={manifest.driver_license_expiry} />
                                <InfoRow label="Address" value={manifest.driver_address} />
                                <InfoRow label="Emergency Contact" value={manifest.driver_emergency_contact} />
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
                                <InfoRow label="NGM Number" value={manifest.ngm_number} />
                                <InfoRow label="Index Number" value={manifest.index_number} />
                                <InfoRow label="BL Number" value={manifest.bl_number} />
                                <InfoRow label="Shipping Bill No" value={manifest.shipping_bill_number} />
                                <InfoRow label="Clearing Agent" value={manifest.clearing_agent_name} />
                                <InfoRow label="Agent Phone" value={manifest.clearing_agent_phone} />
                                <InfoRow label="Agent NTN" value={manifest.clearing_agent_ntn} />
                                <div className="my-2 border-t pt-2">
                                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Maritime</h4>
                                    <InfoRow label="Vessel Name" value={manifest.vessel_name} />
                                    <InfoRow label="Voyage No" value={manifest.voyage_number} />
                                    <InfoRow label="Port of Loading" value={manifest.port_of_loading} />
                                    <InfoRow label="Port of Discharge" value={manifest.port_of_discharge} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center text-lg"><Box className="mr-2 h-5 w-5 text-amber-600" /> Container & Cargo</CardTitle></CardHeader>
                            <CardContent className="px-6">
                                <InfoRow label="Container No" value={manifest.container_no} />
                                <InfoRow label="Size / Type" value={`${manifest.container_size || ''} ${manifest.container_type || ''}`} />
                                <InfoRow label="Seal Number" value={manifest.seal_no} />
                                <div className="my-2 border-t pt-2"></div>
                                <InfoRow label="Package Count" value={manifest.pkg_count} />
                                <InfoRow label="Package Type" value={manifest.pkg_type} />
                                <InfoRow label="Commodity" value={manifest.commodity_description} />
                                <InfoRow label="HS Code" value={manifest.hs_code} />
                                <InfoRow label="Gross Weight" value={manifest.gross_weight ? `${manifest.gross_weight} kg` : '-'} />
                                <InfoRow label="Net Weight" value={manifest.net_weight ? `${manifest.net_weight} kg` : '-'} />
                                <InfoRow label="Volume" value={manifest.volume_cbm ? `${manifest.volume_cbm} CBM` : '-'} />
                                <div className="my-2 border-t pt-2"></div>
                                <InfoRow label="Shipper" value={manifest.shipper_name} />
                                <InfoRow label="Shipper Phone" value={manifest.shipper_phone} />
                                <InfoRow label="Consignee" value={manifest.consignee_name} />
                                <InfoRow label="Consignee Phone" value={manifest.consignee_phone} />
                                <InfoRow label="Consignee Address" value={manifest.consignee_address} />
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
