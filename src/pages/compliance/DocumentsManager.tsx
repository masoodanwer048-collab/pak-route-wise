import React, { useState } from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, File, Eye, Trash2, FolderOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
    id: string;
    name: string;
    type: string;
    category: "Customs" | "Shipping" | "Invoices" | "Certificates";
    uploadDate: string;
    size: string;
    status: "Verified" | "Pending" | "Rejected";
}

const initialDocs: Document[] = [
    { id: "1", name: "Commercial Invoice #4400", type: "PDF", category: "Invoices", uploadDate: "2023-11-20", size: "1.2 MB", status: "Verified" },
    { id: "2", name: "Packing List - Shipment A", type: "PDF", category: "Shipping", uploadDate: "2023-11-21", size: "0.8 MB", status: "Verified" },
    { id: "3", name: "Origin Certificate", type: "JPG", category: "Certificates", uploadDate: "2023-11-22", size: "2.4 MB", status: "Pending" },
];

const DocumentsManager = () => {
    const [docs, setDocs] = useState<Document[]>(initialDocs);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newDoc: Document = {
            id: Math.random().toString(),
            name: formData.get("name") as string,
            type: "PDF", // Mock file type
            category: formData.get("category") as any,
            uploadDate: new Date().toISOString().split('T')[0],
            size: "1.0 MB",
            status: "Pending"
        };

        setDocs([newDoc, ...docs]);
        setIsUploadOpen(false);
        toast({
            title: "File Uploaded",
            description: `${newDoc.name} added to repository.`
        });
    };

    const deleteDoc = (id: string) => {
        setDocs(docs.filter(d => d.id !== id));
        toast({ title: "Deleted", description: "Document removed successfully." });
    };

    const filteredDocs = docs.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Document Management</h1>
                    <p className="text-muted-foreground">Centralized repository for all logistics compliance files.</p>
                </div>
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
                                <Input id="file" type="file" required />
                            </div>
                            <Button type="submit">Upload</Button>
                        </form>
                    </DialogContent>
                </Dialog>
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
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteDoc(doc.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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

export default DocumentsManager;
