import { useState } from 'react';
import ExportActions from '@/components/common/ExportActions';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Download,
  Eye,
  Copy,
  CheckCircle,
  Truck,
  Package,
  FileCheck,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImports, ImportShipment } from '@/hooks/useImports';
import { ImportViewDialog } from '@/components/import/ImportViewDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ReleaseOrders() {
  const isMobile = useIsMobile();
  const {
    imports,
    searchQuery,
    setSearchQuery,
    terminalFilter,
    setTerminalFilter,
    updateStatus,
  } = useImports();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<ImportShipment | null>(null);

  // Filter to show only release-related shipments
  const releaseImports = imports.filter(imp =>
    ['duty_paid', 'examined', 'released', 'delivered'].includes(imp.status)
  );

  const handleView = (imp: ImportShipment) => {
    setSelectedImport(imp);
    setViewDialogOpen(true);
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success('Reference copied to clipboard');
  };

  const handleRelease = (imp: ImportShipment) => {
    updateStatus(imp.id, 'released');
  };

  const handleMarkDelivered = (imp: ImportShipment) => {
    updateStatus(imp.id, 'delivered');
  };



  const terminals = ['PICT', 'KICT', 'QICT', 'SAPT', 'KPT'];

  const pendingExamCount = releaseImports.filter(i => i.status === 'duty_paid').length;
  const examinedCount = releaseImports.filter(i => i.status === 'examined').length;
  const releasedCount = releaseImports.filter(i => i.status === 'released').length;
  const deliveredCount = releaseImports.filter(i => i.status === 'delivered').length;

  return (
    <MainLayout
      title="Release Orders"
      subtitle="Cargo release and delivery management"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search GD, BL, Importer..."
                className="pl-9 w-full sm:w-72"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={terminalFilter} onValueChange={setTerminalFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
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
          <ExportActions
            data={releaseImports}
            fileName="release_orders"
            columnMapping={{
              indexNumber: "Index No",
              gdNumber: "GD Number",
              blNumber: "BL No",
              importerName: "Importer",
              releaseDate: "Release Date",
              status: "Status"
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="stat-card border border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <p className="text-sm text-muted-foreground">Pending Exam</p>
            </div>
            <p className="text-3xl font-bold mt-2 text-warning">{pendingExamCount}</p>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Examined</p>
            </div>
            <p className="text-3xl font-bold mt-2 text-primary">{examinedCount}</p>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <p className="text-sm text-muted-foreground">Released</p>
            </div>
            <p className="text-3xl font-bold mt-2 text-success">{releasedCount}</p>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-success" />
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
            <p className="text-3xl font-bold mt-2 text-success">{deliveredCount}</p>
          </div>
        </div>

        {/* Table/Cards */}
        {isMobile ? (
          <div className="space-y-4">
            {releaseImports.map((imp) => (
              <div
                key={imp.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3"
                onClick={() => handleView(imp)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono font-medium">{imp.gdNumber}</p>
                    <p className="text-xs text-muted-foreground">{imp.terminal}</p>
                  </div>
                  <Badge className={cn(
                    imp.status === 'duty_paid' && 'bg-warning/10 text-warning',
                    imp.status === 'examined' && 'bg-primary/10 text-primary',
                    imp.status === 'released' && 'bg-success/10 text-success',
                    imp.status === 'delivered' && 'bg-success/10 text-success',
                  )}>
                    {imp.status === 'duty_paid' ? 'Awaiting Exam' :
                      imp.status === 'examined' ? 'Ready for Release' :
                        imp.status === 'released' ? 'Released' : 'Delivered'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium">{imp.importerName}</p>
                  <p className="text-xs text-muted-foreground">{imp.goodsDescription}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{imp.packages} {imp.packageType}</span>
                  <span className="font-mono">{imp.grossWeight.toLocaleString()} KG</span>
                </div>

                <div className="flex gap-2 pt-2">
                  {imp.status === 'examined' && (
                    <Button
                      variant="accent"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => { e.stopPropagation(); handleRelease(imp); }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Release
                    </Button>
                  )}
                  {imp.status === 'released' && (
                    <Button
                      variant="accent"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => { e.stopPropagation(); handleMarkDelivered(imp); }}
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Mark Delivered
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleView(imp); }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleCopyRef(imp.gdNumber || ''); }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>GD Number</th>
                    <th>BL Number</th>
                    <th>Importer</th>
                    <th>Cargo</th>
                    <th>Terminal</th>
                    <th>Duty Paid</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {releaseImports.map((imp) => (
                    <tr key={imp.id}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono font-medium">{imp.gdNumber}</span>
                          <span className="text-xs text-muted-foreground">{imp.indexNumber}</span>
                        </div>
                      </td>
                      <td className="font-mono text-sm">{imp.blNumber}</td>
                      <td className="text-sm">{imp.importerName}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm">{imp.packages} {imp.packageType}</span>
                          <span className="text-xs text-muted-foreground">{imp.grossWeight.toLocaleString()} KG</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant="outline">{imp.terminal}</Badge>
                      </td>
                      <td className="font-mono text-sm">{formatCurrency(imp.totalDutyTax)}</td>
                      <td>
                        <Badge className={cn(
                          imp.status === 'duty_paid' && 'bg-warning/10 text-warning',
                          imp.status === 'examined' && 'bg-primary/10 text-primary',
                          imp.status === 'released' && 'bg-success/10 text-success',
                          imp.status === 'delivered' && 'bg-success/10 text-success',
                        )}>
                          {imp.status === 'duty_paid' ? 'Pending Exam' :
                            imp.status === 'examined' ? 'Ready' :
                              imp.status === 'released' ? 'Released' : 'Delivered'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {imp.status === 'examined' && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleRelease(imp)}
                            >
                              Release
                            </Button>
                          )}
                          {imp.status === 'released' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkDelivered(imp)}
                            >
                              Delivered
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(imp)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyRef(imp.gdNumber || '')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {releaseImports.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No release orders found</h3>
            <p className="text-sm text-muted-foreground">
              No shipments are ready for release at this time
            </p>
          </div>
        )}
      </div>

      <ImportViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        importData={selectedImport}
        onUpdateStatus={updateStatus}
      />
    </MainLayout>
  );
}
