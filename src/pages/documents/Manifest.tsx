import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Printer,
    Trash2,
} from 'lucide-react';
import { useDocuments, ShippingDocument, DocumentStatus } from '@/hooks/useDocuments';
import { ManifestDialog } from '@/components/documents/ManifestDialog';
import { ManifestPrintView } from '@/components/documents/ManifestPrintView';
import { toast } from 'sonner';

const statusColors: Record<DocumentStatus, string> = {
    draft: 'bg-muted text-muted-foreground',
    pending: 'bg-warning/10 text-warning border-warning/30',
    original: 'bg-info/10 text-info border-info/30',
    telex: 'bg-accent/10 text-accent border-accent/30',
    released: 'bg-success/10 text-success border-success/30',
    hold: 'bg-destructive/10 text-destructive border-destructive/30',
    cancelled: 'bg-muted text-muted-foreground',
};

export default function Manifest() {
    const {
        documents,
        filters,
        stats,
        addDocument,
        updateDocument,
        deleteDocument,
        updateFilters,
    } = useDocuments('manifest');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editDocument, setEditDocument] = useState<ShippingDocument | null>(null);
    const [printDocument, setPrintDocument] = useState<ShippingDocument | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleSave = (docData: Omit<ShippingDocument, 'id' | 'createdAt'>) => {
        if (editDocument) {
            updateDocument(editDocument.id, docData);
            toast.success('Manifest updated successfully');
            setEditDocument(null);
        } else {
            addDocument(docData);
            toast.success('Manifest created successfully');
        }
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteDocument(deleteId);
            toast.success('Manifest deleted');
            setDeleteId(null);
        }
    };

    return (
        <MainLayout title="Shipping Manifest" subtitle="Manage cargo manifests and shipping details">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search manifest..."
                                className="pl-9 w-full sm:w-80"
                                value={filters.search}
                                onChange={(e) => updateFilters({ search: e.target.value })}
                            />
                        </div>
                        <Select
                            value={filters.status}
                            onValueChange={(value) => updateFilters({ status: value as DocumentStatus | 'all' })}
                        >
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="released">Released</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="accent" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Manifest
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 border rounded-lg bg-card shadow-sm">
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total Manifests</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-card shadow-sm">
                        <div className="text-2xl font-bold text-warning">{stats.pending}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-card shadow-sm">
                        <div className="text-2xl font-bold text-success">{stats.released}</div>
                        <div className="text-sm text-muted-foreground">Released</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-card shadow-sm">
                        <div className="text-2xl font-bold text-muted-foreground">{stats.draft}</div>
                        <div className="text-sm text-muted-foreground">Drafts</div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="p-4 font-medium">Manifest #</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Shipper</th>
                                    <th className="p-4 font-medium">Recipient</th>
                                    <th className="p-4 font-medium">Items</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(doc => (
                                    <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/20">
                                        <td className="p-4 font-mono font-medium">{doc.documentNumber}</td>
                                        <td className="p-4 text-muted-foreground">{new Date(doc.issueDate).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium">{doc.shipper}</td>
                                        <td className="p-4">{doc.recipient || '-'}</td>
                                        <td className="p-4">{doc.manifestItems?.length || 0}</td>
                                        <td className="p-4">
                                            <Badge variant="outline" className={statusColors[doc.status]}>
                                                {doc.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => setEditDocument(doc)} className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setPrintDocument(doc)}>
                                                            <Printer className="h-4 w-4 mr-2" /> Print & Export
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(doc.id)}>
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {documents.length === 0 && (
                                    <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No manifests found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ManifestDialog
                open={isCreateOpen || !!editDocument}
                onOpenChange={(open) => {
                    if (!open) { setIsCreateOpen(false); setEditDocument(null); }
                }}
                document={editDocument}
                onSave={handleSave}
            />

            <ManifestPrintView
                open={!!printDocument}
                document={printDocument}
                onOpenChange={(open) => !open && setPrintDocument(null)}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Manifest</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </MainLayout>
    );
}
