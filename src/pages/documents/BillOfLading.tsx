import { useState, useMemo } from 'react';
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
  Download,
  FileText,
  Ship,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuments, ShippingDocument, DocumentStatus } from '@/hooks/useDocuments';
import { DocumentDialog } from '@/components/documents/DocumentDialog';
import { toast } from 'sonner';
import { BLPrintView } from '@/components/documents/BLPrintView';

const statusColors: Record<DocumentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning border-warning/30',
  original: 'bg-info/10 text-info border-info/30',
  telex: 'bg-accent/10 text-accent border-accent/30',
  released: 'bg-success/10 text-success border-success/30',
  hold: 'bg-destructive/10 text-destructive border-destructive/30',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function BillOfLading() {
  const {
    documents,
    filters,
    stats,
    addDocument,
    updateDocument,
    deleteDocument,
    updateFilters,
  } = useDocuments('bl');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<ShippingDocument | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewDocument, setViewDocument] = useState<ShippingDocument | null>(null);
  const [printDocument, setPrintDocument] = useState<ShippingDocument | null>(null);

  const handleSave = (docData: Omit<ShippingDocument, 'id' | 'createdAt'>) => {
    if (editDocument) {
      updateDocument(editDocument.id, docData);
      toast.success('Bill of Lading updated successfully');
      setEditDocument(null);
    } else {
      addDocument(docData);
      toast.success('Bill of Lading created successfully');
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteDocument(deleteId);
      toast.success('Bill of Lading deleted');
      setDeleteId(null);
    }
  };

  const handleCopy = (docNumber: string) => {
    navigator.clipboard.writeText(docNumber);
    toast.success('BL number copied to clipboard');
  };

  const handleExport = () => {
    const csv = [
      ['BL Number', 'Vessel', 'Voyage', 'POL', 'POD', 'Shipper', 'Consignee', 'Weight', 'Status', 'Date'].join(','),
      ...documents.map((d) =>
        [d.documentNumber, d.vesselFlightTruck, d.voyageFlightNo, d.pol, d.pod, d.shipper, d.consignee, d.weight, d.status, d.issueDate].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill-of-lading-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Export completed');
  };

  return (
    <MainLayout title="Bill of Lading" subtitle="Manage and track ocean shipping documents">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search BL number, vessel, consignee..."
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
                <SelectItem value="original">Original</SelectItem>
                <SelectItem value="telex">Telex</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="hold">Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="accent" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create BL</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total BLs</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.released}</p>
                <p className="text-sm text-muted-foreground">Released</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.telex}</p>
                <p className="text-sm text-muted-foreground">Telex Release</p>
              </div>
            </div>
          </div>
        </div>

        {/* BL Cards - Responsive Grid */}
        {documents.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Bills of Lading found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filters.search || filters.status !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first Bill of Lading to get started'}
            </p>
            <Button variant="accent" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create BL
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono font-semibold text-lg">{doc.documentNumber}</p>
                    <p className="text-sm text-muted-foreground">{doc.issueDate}</p>
                  </div>
                  <Badge variant="outline" className={cn('capitalize', statusColors[doc.status])}>
                    {doc.status}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{doc.vesselFlightTruck}</span>
                    <span className="text-muted-foreground">({doc.voyageFlightNo})</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="truncate">{doc.pol || doc.origin}</span>
                    <span>→</span>
                    <span className="truncate">{doc.pod || doc.destination}</span>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Consignee</p>
                    <p className="font-medium truncate">{doc.consignee}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Containers</p>
                      <p className="font-mono font-medium">{doc.containers.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-mono text-sm truncate">{doc.weight}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CBM</p>
                      <p className="font-mono text-sm truncate">{doc.volume}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => setViewDocument(doc)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => setEditDocument(doc)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="bl-menu-trigger">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => handleCopy(doc.documentNumber)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy BL Number
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPrintDocument(doc)} data-testid="bl-print-btn">
                        <Printer className="h-4 w-4 mr-2" />
                        Print BL
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <DocumentDialog
        open={isCreateOpen || !!editDocument}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditDocument(null);
          }
        }}
        type="bl"
        document={editDocument}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bill of Lading</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Bill of Lading? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Print View */}
      <BLPrintView
        open={!!printDocument}
        onOpenChange={(open) => !open && setPrintDocument(null)}
        document={printDocument}
      />
    </MainLayout>
  );
}
