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
  Download,
  FileText,
  Plane,
  MoreHorizontal,
  Edit,
  Printer,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  File as FileIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuments, ShippingDocument, DocumentStatus } from '@/hooks/useDocuments';
import { DocumentDialog } from '@/components/documents/DocumentDialog';
import { AWBPrintView } from '@/components/documents/AWBPrintView';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const statusColors: Record<DocumentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning border-warning/30',
  original: 'bg-info/10 text-info border-info/30',
  telex: 'bg-accent/10 text-accent border-accent/30',
  released: 'bg-success/10 text-success border-success/30',
  hold: 'bg-destructive/10 text-destructive border-destructive/30',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function AirWaybill() {
  const {
    documents,
    filters,
    stats,
    addDocument,
    updateDocument,
    deleteDocument,
    updateFilters,
  } = useDocuments('awb');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<ShippingDocument | null>(null);
  const [printDocument, setPrintDocument] = useState<ShippingDocument | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (docData: Omit<ShippingDocument, 'id' | 'createdAt'>) => {
    if (editDocument) {
      updateDocument(editDocument.id, docData);
      toast.success('Air Waybill updated successfully');
      setEditDocument(null);
    } else {
      addDocument(docData);
      toast.success('Air Waybill created successfully');
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteDocument(deleteId);
      toast.success('Air Waybill deleted');
      setDeleteId(null);
    }
  };

  const handleCopy = (docNumber: string) => {
    navigator.clipboard.writeText(docNumber);
    toast.success('AWB number copied to clipboard');
  };

  // --- Export List Functions ---

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Kohesar Logistics - Air Waybills', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = documents.map(d => [
      d.documentNumber,
      d.voyageFlightNo,
      `${d.origin} -> ${d.destination}`,
      d.shipper,
      d.consignee,
      d.weight,
      d.status
    ]);

    autoTable(doc, {
      head: [['AWB #', 'Flight', 'Route', 'Shipper', 'Consignee', 'Weight', 'Status']],
      body: tableData,
      startY: 35,
    });

    doc.save(`awb-list-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF Export downloaded');
  };

  const handleExportExcel = () => {
    const data = documents.map(d => ({
      'AWB Number': d.documentNumber,
      'Flight': d.voyageFlightNo,
      'Carrier': d.carrier,
      'Origin': d.origin,
      'Destination': d.destination,
      'Shipper': d.shipper,
      'Consignee': d.consignee,
      'Weight': d.weight,
      'Status': d.status,
      'Date': d.issueDate
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Air Waybills");
    XLSX.writeFile(wb, `awb-list-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel Export downloaded');
  };

  const handleExportWord = () => {
    // Create a simple HTML table for Word
    let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'><title>Air Waybills</title></head><body>`;
    html += `<h1>Kohesar Logistics - AWB List</h1>`;
    html += `<table border="1" style="border-collapse: collapse; width: 100%;"><thead><tr><th>AWB #</th><th>Flight</th><th>Route</th><th>Shipper</th><th>Consignee</th><th>Weight</th><th>Status</th></tr></thead><tbody>`;

    documents.forEach(d => {
      html += `<tr><td>${d.documentNumber}</td><td>${d.voyageFlightNo}</td><td>${d.origin} -> ${d.destination}</td><td>${d.shipper}</td><td>${d.consignee}</td><td>${d.weight}</td><td>${d.status}</td></tr>`;
    });

    html += `</tbody></table></body></html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `awb-list-${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Word Export downloaded');
  };

  return (
    <MainLayout title="Air Waybill (AWB)" subtitle="Manage air cargo shipping documents">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search AWB number, flight, consignee..."
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
                <SelectItem value="hold">Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileIcon className="h-4 w-4 mr-2 text-red-500" /> Export PDF List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportWord}>
                  <FileText className="h-4 w-4 mr-2 text-blue-500" /> Export Word List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" /> Export Excel List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="accent" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create AWB</span>
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
                <p className="text-sm text-muted-foreground">Total AWBs</p>
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
                <Plane className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.draft}</p>
                <p className="text-sm text-muted-foreground">Draft</p>
              </div>
            </div>
          </div>
        </div>

        {/* AWB Table - Desktop */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>AWB Number</th>
                  <th>Flight / Aircraft</th>
                  <th>Route</th>
                  <th>Shipper</th>
                  <th>Consignee</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono font-medium">{doc.documentNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{doc.voyageFlightNo}</span>
                        <span className="text-xs text-muted-foreground">{doc.vesselFlightTruck}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm">{doc.origin}</span>
                        <span className="text-xs text-muted-foreground">→ {doc.destination}</span>
                      </div>
                    </td>
                    <td className="truncate max-w-[150px]">{doc.shipper}</td>
                    <td className="truncate max-w-[150px]">{doc.consignee}</td>
                    <td className="font-mono text-sm">{doc.weight}</td>
                    <td>
                      <Badge variant="outline" className={cn('capitalize', statusColors[doc.status])}>
                        {doc.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditDocument(doc)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => setPrintDocument(doc)}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print & Export
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopy(doc.documentNumber)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy AWB Number
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-border">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-medium text-sm">{doc.documentNumber}</span>
                  </div>
                  <Badge variant="outline" className={cn('capitalize text-xs', statusColors[doc.status])}>
                    {doc.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-medium truncate">{doc.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-medium truncate">{doc.destination}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Consignee</p>
                    <p className="font-medium truncate">{doc.consignee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-mono">{doc.weight}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setPrintDocument(doc)}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditDocument(doc)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        type="awb"
        document={editDocument}
        onSave={handleSave}
      />

      {/* Print View Modal */}
      <AWBPrintView
        open={!!printDocument}
        document={printDocument}
        onOpenChange={(open) => !open && setPrintDocument(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Air Waybill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Air Waybill? This action cannot be undone.
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
    </MainLayout>
  );
}
