import React, { useState } from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, File, Eye, Trash2, FolderOpen, Plus, Download, FileText, FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentDialog } from "@/components/documents/DocumentDialog";
import { DocumentType, ShippingDocument } from "@/hooks/useDocuments";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useShipmentDocuments, ShipmentDocument } from "@/hooks/useShipmentDocuments";

const DocumentsManager = () => {
    // Integration with Supabase Hook
    const { documents: docs, isLoading, uploadDocument, deleteDocument } = useShipmentDocuments();

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false);
    const [createType, setCreateType] = useState<DocumentType>('bl');

    // Actions states
    const [viewDoc, setViewDoc] = useState<ShipmentDocument | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);

    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        // Map category/name to a type for DB
        const type = category === 'Customs' ? 'permit' : 'general';

        if (file) {
            uploadDocument({ file, type, category });
            setIsUploadOpen(false);
            // toast handled by hook
        }
    };

    const handleCreateDocument = (doc: Omit<ShippingDocument, 'id' | 'createdAt'>) => {
        // This is for generating docs (BL/Packing List) via form.
        // Ideally we should save this to DB as well.
        // For now, keeping the toast mock for generation, 
        // but typically this would call an API or save JSON to DB.
        toast({
            title: "Document Created",
            description: "Document generated locally. (Integration pending for saving generated docs to DB)",
        });
        setIsCreateOpen(false);
    }

    const deleteDoc = () => {
        if (deleteId) {
            deleteDocument(deleteId);
            setDeleteId(null);
        }
    };

    const handleView = (doc: ShipmentDocument) => {
        setViewDoc(doc);
    };

    const handleDownload = (doc: ShipmentDocument, format: "pdf" | "excel") => {
        if (doc.file_url) {
            // Ideally hook provides signed URL.
            // For now, just show toast or try open
            // Assuming bucket is public for simplicity in demo or need signed url func
            toast({ title: "Opening File", description: "Attempting to open file..." });
            // We'd ideally construct the URL differently if it were private
        } else {
            toast({
                title: "Download Unavailable",
                description: "File not found or access denied.",
                variant: "destructive"
            });
        }
    };

    const filteredDocs = docs.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isLoading) return <div className="p-8">Loading documents...</div>;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Document Management</h1>
                    <p className="text-muted-foreground">Centralized repository for all logistics compliance files.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isTypeSelectionOpen} onOpenChange={setIsTypeSelectionOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Create Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Document</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Document Type</Label>
                                    <Select
                                        value={createType}
                                        onValueChange={(v) => setCreateType(v as DocumentType)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bl">Bill of Lading</SelectItem>
                                            <SelectItem value="packing_list">Packing List</SelectItem>
                                            <SelectItem value="awb">Air Waybill</SelectItem>
                                            <SelectItem value="bilty">Bilty / Road Receipt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={() => {
                                    setIsTypeSelectionOpen(false);
                                    setIsCreateOpen(true);
                                }}>Proceed to Form</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Generic Editor for Creating */}
                    <DocumentDialog
                        open={isCreateOpen}
                        onOpenChange={setIsCreateOpen}
                        type={createType}
                        onSave={handleCreateDocument}
                    />

                    {/* Editor for Viewing/Editing Existing Generated Docs */}
                    <DocumentDialog
                        open={isDocumentDialogOpen}
                        onOpenChange={(open) => {
                            setIsDocumentDialogOpen(open);
                            if (!open) setViewDoc(null);
                        }}
                        type={'bl'} // default
                        document={null}
                        onSave={() => { }}
                    />

                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Upload className="h-4 w-4" /> Upload Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload New File</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpload} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Document Name</Label>
                                    <Input id="name" name="name" placeholder="e.g. Sales Contract" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Customs">Customs</SelectItem>
                                            <SelectItem value="Shipping">Shipping</SelectItem>
                                            <SelectItem value="Invoices">Invoices</SelectItem>
                                            <SelectItem value="Certificates">Certificates</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="file">File</Label>
                                    <Input id="file" name="file" type="file" required />
                                </div>
                                <Button type="submit">Upload</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {["Customs", "Shipping", "Invoices", "Certificates"].map((cat) => (
                    <Card key={cat} className="hover:bg-accent/5 cursor-pointer transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{cat}</CardTitle>
                            <FolderOpen className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{docs.filter(d => d.category === cat).length}</div>
                            <p className="text-xs text-muted-foreground">Files</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>File Repository</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search files..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <ExportActions
                                data={filteredDocs}
                                fileName="documents_repository"
                                columnMapping={{
                                    name: "File Name",
                                    category: "Category",
                                    type: "Type",
                                    size: "Size",
                                    status: "Status",
                                    uploadDate: "Upload Date"
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <File className="h-4 w-4 text-blue-500" />
                                        {doc.name}
                                    </TableCell>
                                    <TableCell>{doc.category}</TableCell>
                                    <TableCell>{doc.uploadDate}</TableCell>
                                    <TableCell>{doc.size}</TableCell>
                                    <TableCell>
                                        <Badge variant={doc.status === "Verified" ? "default" : "secondary"}>
                                            {doc.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleView(doc)}
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => setDeleteId(doc.id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Modal */}
            <Dialog open={!!viewDoc && !isDocumentDialogOpen} onOpenChange={(open) => !open && setViewDoc(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Document Details</DialogTitle>
                        <DialogDescription>Review document information</DialogDescription>
                    </DialogHeader>
                    {viewDoc && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Name</Label>
                                <div className="col-span-3">{viewDoc.name}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Category</Label>
                                <div className="col-span-3">{viewDoc.category}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Date</Label>
                                <div className="col-span-3">{viewDoc.uploadDate}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Status</Label>
                                <div className="col-span-3"><Badge>{viewDoc.status}</Badge></div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => viewDoc && handleDownload(viewDoc, 'pdf')}>
                            <Download className="mr-2 h-4 w-4" /> Open File
                        </Button>
                        <Button onClick={() => setViewDoc(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the document from the repository.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteDoc} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DocumentsManager;
