import { useState } from 'react';
import ExportActions from '@/components/common/ExportActions';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Download,
  Ship,
  Eye,
  Copy,
  FileText,
  Clock,
  CheckCircle,
  Container
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

export default function IGMManagement() {
  const isMobile = useIsMobile();
  const {
    imports,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateStatus,
  } = useImports();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<ImportShipment | null>(null);

  // Filter to show only IGM-related shipments
  const igmImports = imports.filter(imp =>
    ['pending', 'igm_filed', 'gd_filed'].includes(imp.status)
  );

  const handleView = (imp: ImportShipment) => {
    setSelectedImport(imp);
    setViewDialogOpen(true);
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success('Reference copied to clipboard');
  };

  const handleFileIGM = (imp: ImportShipment) => {
    updateStatus(imp.id, 'igm_filed');
  };



  const pendingCount = igmImports.filter(i => i.status === 'pending').length;
  const filedCount = igmImports.filter(i => i.status === 'igm_filed').length;
  const gdFiledCount = igmImports.filter(i => i.status === 'gd_filed').length;

  return (
    <MainLayout
      title="IGM Management"
      subtitle="Import General Manifest filing and tracking"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search IGM, BL, Vessel..."
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
                <SelectItem value="pending">Pending IGM</SelectItem>
                <SelectItem value="igm_filed">IGM Filed</SelectItem>
                <SelectItem value="gd_filed">GD Filed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ExportActions
            data={igmImports}
            fileName="igm_filing_status"
            columnMapping={{
              igmNumber: "IGM No",
              blNumber: "BL No",
              vesselName: "Vessel",
              voyageNumber: "Voyage",
              importerName: "Importer",
              status: "Status"
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-3">
          <div className="stat-card border border-border">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Pending IGM</p>
            </div>
            <p className="text-3xl font-bold mt-2">{pendingCount}</p>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-info" />
              <p className="text-sm text-muted-foreground">IGM Filed</p>
            </div>
            <p className="text-3xl font-bold mt-2 text-info">{filedCount}</p>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <p className="text-sm text-muted-foreground">GD Filed</p>
            </div>
            <p className="text-3xl font-bold mt-2 text-success">{gdFiledCount}</p>
          </div>
        </div>

        {/* Table/Cards */}
        {isMobile ? (
          <div className="space-y-4">
            {igmImports.map((imp) => (
              <div
                key={imp.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3"
                onClick={() => handleView(imp)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono font-medium">{imp.igmNumber || 'Pending'}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(imp.igmDate), 'dd MMM yyyy')}</p>
                  </div>
                  <Badge className={cn(
                    imp.status === 'pending' && 'bg-muted text-muted-foreground',
                    imp.status === 'igm_filed' && 'bg-info/10 text-info',
                    imp.status === 'gd_filed' && 'bg-success/10 text-success',
                  )}>
                    {imp.status === 'pending' ? 'Pending IGM' : imp.status === 'igm_filed' ? 'IGM Filed' : 'GD Filed'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{imp.vesselName}</span>
                  <span className="text-xs text-muted-foreground">• {imp.voyageNumber}</span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">BL Number</p>
                  <p className="font-mono text-sm">{imp.blNumber}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Container className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{imp.containerNumbers.length} Container(s)</span>
                </div>

                <div className="flex gap-2 pt-2">
                  {imp.status === 'pending' && (
                    <Button
                      variant="accent"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => { e.stopPropagation(); handleFileIGM(imp); }}
                    >
                      File IGM
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className={imp.status !== 'pending' ? 'flex-1' : ''}
                    onClick={(e) => { e.stopPropagation(); handleView(imp); }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleCopyRef(imp.blNumber); }}>
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
                    <th>IGM Number</th>
                    <th>BL Number</th>
                    <th>Vessel / Voyage</th>
                    <th>Port of Loading</th>
                    <th>Importer</th>
                    <th>Containers</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {igmImports.map((imp) => (
                    <tr key={imp.id}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono font-medium">{imp.igmNumber || '-'}</span>
                          <span className="text-xs text-muted-foreground">
                            {imp.igmNumber ? format(new Date(imp.igmDate), 'dd MMM yyyy') : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="font-mono text-sm">{imp.blNumber}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm">{imp.vesselName}</span>
                          <span className="text-xs text-muted-foreground">{imp.voyageNumber}</span>
                        </div>
                      </td>
                      <td className="text-sm">{imp.portOfLoading}</td>
                      <td className="text-sm">{imp.importerName}</td>
                      <td>
                        <Badge variant="outline" className="font-mono">
                          {imp.containerNumbers.length} x 40'
                        </Badge>
                      </td>
                      <td>
                        <Badge className={cn(
                          imp.status === 'pending' && 'bg-muted text-muted-foreground',
                          imp.status === 'igm_filed' && 'bg-info/10 text-info',
                          imp.status === 'gd_filed' && 'bg-success/10 text-success',
                        )}>
                          {imp.status === 'pending' ? 'Pending' : imp.status === 'igm_filed' ? 'Filed' : 'GD Filed'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {imp.status === 'pending' && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleFileIGM(imp)}
                            >
                              File IGM
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(imp)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyRef(imp.blNumber)}>
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

        {igmImports.length === 0 && (
          <div className="text-center py-12">
            <Ship className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No IGM records found</h3>
            <p className="text-sm text-muted-foreground">
              All imports have progressed past the IGM stage
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
