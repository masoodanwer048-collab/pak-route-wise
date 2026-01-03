import { useState } from 'react';
import ExportActions from '@/components/common/ExportActions';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Copy,
  Ship,
  Shield,
  Truck,
  FileCheck,
  Container
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImports, ImportShipment, ImportStatus, ImportFormData } from '@/hooks/useImports';
import { ImportDialog } from '@/components/import/ImportDialog';
import { ImportViewDialog } from '@/components/import/ImportViewDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const statusConfig: Record<ImportStatus, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: 'bg-muted text-muted-foreground', icon: FileText, label: 'Pending' },
  igm_filed: { color: 'bg-info/10 text-info', icon: Ship, label: 'IGM Filed' },
  gd_filed: { color: 'bg-primary/10 text-primary', icon: FileCheck, label: 'GD Filed' },
  assessed: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Assessed' },
  duty_paid: { color: 'bg-accent/10 text-accent', icon: DollarSign, label: 'Duty Paid' },
  examined: { color: 'bg-primary/10 text-primary', icon: Shield, label: 'Examined' },
  released: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Released' },
  delivered: { color: 'bg-success/10 text-success', icon: Truck, label: 'Delivered' },
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ImportIndex() {
  const isMobile = useIsMobile();
  const {
    imports,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    terminalFilter,
    setTerminalFilter,
    addImport,
    updateImport,
    updateStatus,
    deleteImport,
  } = useImports();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<ImportShipment | null>(null);

  const handleCreate = (data: ImportFormData) => {
    addImport(data);
  };

  const handleEdit = (imp: ImportShipment) => {
    setSelectedImport(imp);
    setDialogOpen(true);
  };

  const handleView = (imp: ImportShipment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImport(imp);
    setViewDialogOpen(true);
  };

  const handleDelete = (imp: ImportShipment) => {
    deleteImport(imp.id);
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success('Reference copied to clipboard');
  };



  const terminals = ['PICT', 'KICT', 'QICT', 'SAPT', 'KPT'];

  return (
    <MainLayout
      title="Import Management"
      subtitle="Track and manage all import shipments"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search BL, IGM, Importer..."
                className="pl-9 w-full sm:w-72"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="igm_filed">IGM Filed</SelectItem>
                <SelectItem value="gd_filed">GD Filed</SelectItem>
                <SelectItem value="assessed">Assessed</SelectItem>
                <SelectItem value="duty_paid">Duty Paid</SelectItem>
                <SelectItem value="examined">Examined</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={terminalFilter} onValueChange={setTerminalFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <Container className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Terminal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terminals</SelectItem>
                {terminals.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <ExportActions
              data={imports}
              fileName="import_shipments"
              columnMapping={{
                indexNumber: "Index No",
                igmNumber: "IGM No",
                blNumber: "BL No",
                importerName: "Importer",
                hsCode: "HS Code",
                invoiceValue: "Value (USD)",
                status: "Status"
              }}
            />
            <Button variant="accent" onClick={() => { setSelectedImport(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              New Import
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-xl font-bold mt-1">{stats.pending}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">IGM Filed</p>
            <p className="text-xl font-bold mt-1 text-info">{stats.igmFiled}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">GD Filed</p>
            <p className="text-xl font-bold mt-1 text-primary">{stats.gdFiled}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">Assessed</p>
            <p className="text-xl font-bold mt-1 text-warning">{stats.assessed}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">Duty Paid</p>
            <p className="text-xl font-bold mt-1 text-accent">{stats.dutyPaid}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">Examined</p>
            <p className="text-xl font-bold mt-1 text-primary">{stats.examined}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">Released</p>
            <p className="text-xl font-bold mt-1 text-success">{stats.released}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-xs text-muted-foreground">Delivered</p>
            <p className="text-xl font-bold mt-1 text-success">{stats.delivered}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{imports.length}</span> of{' '}
            <span className="font-medium text-foreground">{stats.total}</span> imports
          </p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Total Value: </span>
              <span className="font-mono font-medium">{formatCurrency(stats.totalValue * 278.5)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Duty: </span>
              <span className="font-mono font-medium text-accent">{formatCurrency(stats.totalDuty)}</span>
            </div>
          </div>
        </div>

        {/* Mobile Cards / Desktop Table */}
        {isMobile ? (
          <div className="space-y-4">
            {imports.map((imp) => {
              const status = statusConfig[imp.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={imp.id}
                  className="rounded-xl border border-border bg-card p-4 space-y-3"
                  onClick={() => handleView(imp)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono font-medium">{imp.indexNumber}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(imp.createdAt), 'dd MMM yyyy')}</p>
                    </div>
                    <Badge className={cn('capitalize', status.color)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{imp.blNumber}</span>
                    {imp.igmNumber && (
                      <Badge variant="outline" className="text-xs font-mono">{imp.igmNumber}</Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{imp.importerName}</p>
                    <p className="text-xs text-muted-foreground">{imp.vesselName} • {imp.terminal}</p>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p className="font-mono text-sm">${imp.invoiceValue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Duty</p>
                      <p className="font-mono text-sm font-medium text-accent">{formatCurrency(imp.totalDutyTax)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleEdit(imp); }}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleCopyRef(imp.blNumber); }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(imp); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Index No.</th>
                    <th>IGM / BL</th>
                    <th>Vessel</th>
                    <th>Importer</th>
                    <th>Cargo</th>
                    <th>Value</th>
                    <th>Duty</th>
                    <th>Terminal</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {imports.map((imp) => {
                    const status = statusConfig[imp.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr key={imp.id}>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-mono font-medium">{imp.indexNumber}</span>
                            <span className="text-xs text-muted-foreground">{format(new Date(imp.createdAt), 'dd MMM yyyy')}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-mono text-sm">{imp.igmNumber || '-'}</span>
                            <span className="font-mono text-xs text-muted-foreground">{imp.blNumber}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="text-sm">{imp.vesselName}</span>
                            <span className="text-xs text-muted-foreground">{imp.voyageNumber}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="text-sm">{imp.importerName}</span>
                            <span className="text-xs text-muted-foreground">{imp.countryOfOrigin}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-mono text-sm">{imp.hsCode}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{imp.goodsDescription}</span>
                          </div>
                        </td>
                        <td className="font-mono text-sm">${imp.invoiceValue.toLocaleString()}</td>
                        <td className="font-mono text-sm font-medium">{formatCurrency(imp.totalDutyTax)}</td>
                        <td>
                          <Badge variant="outline">{imp.terminal}</Badge>
                        </td>
                        <td>
                          <span className={cn('status-badge', status.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleView(imp, e)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(imp)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => handleCopyRef(imp.blNumber)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy BL Number
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleView(imp); }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={(e) => { e.preventDefault(); handleDelete(imp); }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {imports.length === 0 && (
          <div className="text-center py-12">
            <Ship className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No imports found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || terminalFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating a new import shipment'}
            </p>
            <Button variant="accent" onClick={() => { setSelectedImport(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              New Import
            </Button>
          </div>
        )}
      </div>

      <ImportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        importData={selectedImport}
        onSubmit={selectedImport ? (data) => updateImport(selectedImport.id, data) : handleCreate}
      />

      <ImportViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        importData={selectedImport}
        onUpdateStatus={updateStatus}
      />
    </MainLayout>
  );
}
