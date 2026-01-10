import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { generateManifestPDF } from "@/utils/pdfGenerator";
import * as XLSX from "xlsx";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, FileText, Printer, FileSpreadsheet, Trash2, Copy, Eye, Edit, Filter, X } from "lucide-react";
import { toast } from "sonner";

type Manifest = Database['public']['Tables']['carrier_manifests']['Row'];

const CarrierManifests = () => {
    const navigate = useNavigate();
    const [manifests, setManifests] = useState<Manifest[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [originFilter, setOriginFilter] = useState("");

    useEffect(() => {
        fetchManifests();
    }, []);

    const fetchManifests = async () => {
        try {
            const { data, error } = await supabase
                .from("carrier_manifests")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setManifests(data || []);
        } catch (error: any) {
            toast.error("Failed to load manifests");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteManifest = async (id: string) => {
        if (!confirm("Are you sure you want to delete this manifest?")) return;
        try {
            const { error } = await supabase.from("carrier_manifests").delete().eq("id", id);
            if (error) throw error;
            setManifests(prev => prev.filter(m => m.id !== id));
            toast.success("Manifest deleted successfully");
        } catch (error: any) {
            toast.error("Failed to delete manifest");
        }
    };

    const duplicateManifest = async (manifest: Manifest) => {
        try {
            const { id, created_at, updated_at, manifest_number, ...rest } = manifest;
            
            // Get current user ID safely
            let userId = (await supabase.auth.getUser()).data.user?.id;
            if (!userId) {
                const storedUser = localStorage.getItem('demo_user');
                if (storedUser) {
                    userId = JSON.parse(storedUser).id;
                }
            }

            const newManifest = {
                ...rest,
                manifest_number: `MAN-${format(new Date(), "yyyyMMdd")}-${Math.floor(Math.random() * 1000)}`,
                status: "DRAFT",
                created_by: userId,
                carrier_user_id: userId // Ensure this is also copied/reset
            };

            const { data, error } = await supabase.from("carrier_manifests").insert(newManifest as any).select().single();
            if (error) throw error;

            toast.success("Manifest Duplicated");
            fetchManifests();
        } catch (error) {
            toast.error("Failed to duplicate");
        }
    };

    const exportExcel = (manifest: Manifest) => {
        // Sheet 1: Summary
        const summaryData = [{
            "Manifest No": manifest.manifest_number,
            "Date": manifest.dispatch_date_time || manifest.created_at,
            "Status": manifest.status,
            "Origin": manifest.origin_hub,
            "Destination": manifest.destination_hub,
            "Driver": manifest.driver_name,
            "Driver CNIC": manifest.driver_cnic,
            "Vehicle": manifest.vehicle_reg_no,
            "GD No": manifest.gd_number,
            "Container": manifest.container_no,
        }];

        // Sheet 2: Items (If we had a joined table, we would map it here. For now using placeholder or shipments)
        const itemsData = [
            { "Item": "No items linked" }
        ];

        const wb = XLSX.utils.book_new();
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        const wsItems = XLSX.utils.json_to_sheet(itemsData);

        XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
        XLSX.utils.book_append_sheet(wb, wsItems, "Shipments");
        XLSX.writeFile(wb, `Manifest_${manifest.manifest_number}.xlsx`);
    };

    // Filter Logic
    const filteredManifests = manifests.filter(m => {
        const matchesSearch = 
            (m.manifest_number?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (m.driver_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (m.driver_cnic?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (m.vehicle_reg_no?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (m.gd_number?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (m.bl_number?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (m.container_no?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
        
        const matchesOrigin = !originFilter || (m.origin_hub?.toLowerCase() || "").includes(originFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesOrigin;
    });

    return (
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Carrier Manifests</h1>
                    <p className="text-muted-foreground">Manage and track your fleet manifests.</p>
                </div>
                <Button onClick={() => navigate("/carrier/create")} className="bg-slate-900">
                    <Plus className="mr-2 h-4 w-4" /> Create Manifest
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search manifest, driver, vehicle, GD, BL..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="SUBMITTED">Submitted</SelectItem>
                        <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Input 
                    placeholder="Filter by Origin" 
                    className="w-[180px]"
                    value={originFilter}
                    onChange={(e) => setOriginFilter(e.target.value)}
                />

                {(searchTerm || statusFilter !== "ALL" || originFilter) && (
                    <Button variant="ghost" onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("ALL");
                        setOriginFilter("");
                    }}>
                        <X className="h-4 w-4 mr-2" /> Clear
                    </Button>
                )}
            </div>

            <div className="border rounded-md shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Manifest No</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Origin / Dest</TableHead>
                            <TableHead>Driver / Vehicle</TableHead>
                            <TableHead>GD / BL</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell></TableRow>
                        ) : filteredManifests.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="h-24 text-center">No manifests found.</TableCell></TableRow>
                        ) : (
                            filteredManifests.map((m) => (
                                <TableRow key={m.id} className="hover:bg-slate-50">
                                    <TableCell className="font-medium">
                                        {m.manifest_number}
                                        <div className="text-xs text-muted-foreground">{m.manifest_type}</div>
                                    </TableCell>
                                    <TableCell>
                                        {m.dispatch_date_time ? format(new Date(m.dispatch_date_time), 'dd MMM yyyy') : '-'}
                                        <div className="text-xs text-muted-foreground">
                                            {m.dispatch_date_time ? format(new Date(m.dispatch_date_time), 'HH:mm') : ''}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{m.origin_hub || '-'}</span>
                                            <span className="text-xs text-muted-foreground">to {m.destination_hub || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{m.driver_name || 'No Driver'}</span>
                                            <span className="text-xs text-muted-foreground">{m.vehicle_reg_no || 'No Vehicle'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{m.gd_number || '-'}</span>
                                            <span className="text-xs text-muted-foreground">{m.bl_number || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={m.status === 'DRAFT' ? 'outline' : 'secondary'} 
                                            className={
                                                m.status === 'SUBMITTED' ? 'bg-green-100 text-green-800 border-green-200' : 
                                                m.status === 'DRAFT' ? 'bg-slate-100 text-slate-800' : ''
                                            }
                                        >
                                            {m.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigate(`/carrier/manifests/${m.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate(`/carrier/create?edit=${m.id}`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => duplicateManifest(m)}>
                                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => generateManifestPDF(m)}>
                                                    <FileText className="mr-2 h-4 w-4" /> PDF Export
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => exportExcel(m)}>
                                                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel Export
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => generateManifestPDF(m)}>
                                                    <Printer className="mr-2 h-4 w-4" /> Print
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteManifest(m.id)}>
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
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
                Showing {filteredManifests.length} manifests
            </div>
        </div>
    );
};

export default CarrierManifests;
