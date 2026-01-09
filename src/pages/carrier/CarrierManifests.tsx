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
import { Plus, Search, MoreHorizontal, FileText, Printer, FileSpreadsheet, Trash2, Copy, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

type Manifest = Database['public']['Tables']['carrier_manifests']['Row'];

const CarrierManifests = () => {
    const navigate = useNavigate();
    const [manifests, setManifests] = useState<Manifest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
            toast.error("Manifest deleted");
        } catch (error: any) {
            toast.error("Failed to delete manifest");
        }
    };

    const duplicateManifest = async (manifest: Manifest) => {
        try {
            const { id, created_at, updated_at, manifest_number, ...rest } = manifest;
            const newManifest = {
                ...rest,
                manifest_number: `MAN-${Math.floor(Math.random() * 100000)}`,
                status: "DRAFT",
                created_by: (await supabase.auth.getUser()).data.user?.id
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
        const worksheet = XLSX.utils.json_to_sheet([manifest]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Manifest");
        XLSX.writeFile(workbook, `Manifest_${manifest.manifest_number}.xlsx`);
    };

    const filteredManifests = manifests.filter(m =>
        m.manifest_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.carrier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.origin_hub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Carrier Manifests</h1>
                    <p className="text-muted-foreground">Manage and track your fleet manifests.</p>
                </div>
                <Button onClick={() => navigate("/carrier/create")} className="bg-slate-900">
                    <Plus className="mr-2 h-4 w-4" /> Create Manifest
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search manifest no, carrier, origin..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md shadow-sm bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Manifest No</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Origin</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Carrier / Driver</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assets</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={9} className="h-24 text-center">Loading...</TableCell></TableRow>
                        ) : filteredManifests.length === 0 ? (
                            <TableRow><TableCell colSpan={9} className="h-24 text-center">No manifests found.</TableCell></TableRow>
                        ) : (
                            filteredManifests.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">{m.manifest_number}</TableCell>
                                    <TableCell>{m.created_at ? format(new Date(m.created_at), 'dd MMM yyyy') : '-'}</TableCell>
                                    <TableCell>{m.origin_hub || '-'}</TableCell>
                                    <TableCell>{m.destination_hub || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{m.carrier_name || '-'}</span>
                                            <span className="text-xs text-muted-foreground">{m.driver_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{m.vehicle_reg_no || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={m.status === 'DRAFT' ? 'outline' : 'secondary'} className={m.status === 'SUBMITTED' ? 'bg-green-100 text-green-800' : ''}>
                                            {m.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {m.pkg_count ? `${m.pkg_count} pkgs` : '-'} <br />
                                        {m.gross_weight ? `${m.gross_weight} kg` : ''}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigate(`/carrier/manifests/${m.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate(`/carrier/create?edit=${m.id}`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Manifest
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => duplicateManifest(m)}>
                                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => generateManifestPDF(m)}>
                                                    <FileText className="mr-2 h-4 w-4" /> Download PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => exportExcel(m)}>
                                                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Download Excel
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
        </div>
    );
};

export default CarrierManifests;
