import { useState } from 'react';
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
  AlertCircle,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Send,
  MoreHorizontal,
  Copy,
  Shield,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGoodsDeclaration, GDFormData } from '@/hooks/useGoodsDeclaration';
import { GDDialog } from '@/components/customs/GDDialog';
import { GDViewDialog } from '@/components/customs/GDViewDialog';
import { GoodsDeclaration } from '@/types/logistics';
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

const statusConfig = {
  draft: { color: 'bg-muted text-muted-foreground', icon: FileText, label: 'Draft' },
  submitted: { color: 'bg-info/10 text-info', icon: Send, label: 'Submitted' },
  assessed: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Assessed' },
  paid: { color: 'bg-accent/10 text-accent', icon: DollarSign, label: 'Paid' },
  examined: { color: 'bg-primary/10 text-primary', icon: Shield, label: 'Examined' },
  released: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Released' },
  hold: { color: 'bg-destructive/10 text-destructive', icon: AlertCircle, label: 'On Hold' },
};

const typeConfig = {
  import: 'bg-info/10 text-info',
  export: 'bg-success/10 text-success',
  transit: 'bg-warning/10 text-warning',
  transshipment: 'bg-primary/10 text-primary',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function GDFiling() {
  const isMobile = useIsMobile();
  const {
    gds,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    addGD,
    updateGD,
    updateStatus,
    deleteGD,
  } = useGoodsDeclaration();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedGD, setSelectedGD] = useState<GoodsDeclaration | null>(null);

  const handleCreate = (data: GDFormData) => {
    addGD(data);
  };

  const handleEdit = (gd: GoodsDeclaration) => {
    setSelectedGD(gd);
    setDialogOpen(true);
  };

  const handleView = (gd: GoodsDeclaration) => {
    setSelectedGD(gd);
    setViewDialogOpen(true);
  };

  const handleDelete = (gd: GoodsDeclaration) => {
    deleteGD(gd.id);
  };

  const handleCopyRef = (gdNumber: string) => {
    navigator.clipboard.writeText(gdNumber);
    toast.success('GD number copied to clipboard');
  };

  const handleExport = () => {
    const csv = gds.map(gd => 
      `${gd.gdNumber},${gd.gdType},${gd.blNumber},${gd.importer.name},${gd.hsCode},${gd.invoiceValue},${gd.totalDutyTax},${gd.status}`
    ).join('\n');
    const header = 'GD Number,Type,BL Number,Importer,HS Code,Value,Duty,Status\n';
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gd-filing-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Exported to CSV');
  };

  const toggleSort = (field: 'filingDate' | 'gdNumber' | 'invoiceValue') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <MainLayout 
      title="GD Filing" 
      subtitle="Goods Declaration filing for import, export & transit"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search GD, BL, Importer..."
                className="pl-9 w-full sm:w-80"
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="assessed">Assessed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="examined">Examined</SelectItem>
                <SelectItem value="released">Released</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="accent" onClick={() => { setSelectedGD(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              New GD
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Draft</p>
            <p className="text-2xl font-bold mt-1">{stats.draft}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-2xl font-bold mt-1 text-info">{stats.submitted}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Assessed</p>
            <p className="text-2xl font-bold mt-1 text-warning">{stats.assessed}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold mt-1 text-accent">{stats.paid}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Examined</p>
            <p className="text-2xl font-bold mt-1 text-primary">{stats.examined}</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Released</p>
            <p className="text-2xl font-bold mt-1 text-success">{stats.released}</p>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {gds.length} of {stats.total} declarations
          </p>
          <div className="text-sm text-muted-foreground">
            Total Duty: <span className="font-mono font-medium text-foreground">{formatCurrency(stats.totalDuty)}</span>
          </div>
        </div>

        {/* Mobile Cards / Desktop Table */}
        {isMobile ? (
          <div className="space-y-4">
            {gds.map((gd) => {
              const status = statusConfig[gd.status as keyof typeof statusConfig] || statusConfig.draft;
              const StatusIcon = status.icon;
              
              return (
                <div 
                  key={gd.id} 
                  className="rounded-xl border border-border bg-card p-4 space-y-3"
                  onClick={() => handleView(gd)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono font-medium">{gd.gdNumber}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(gd.filingDate), 'dd MMM yyyy')}</p>
                    </div>
                    <Badge className={cn('capitalize', status.color)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn('capitalize', typeConfig[gd.gdType])}>
                      {gd.gdType}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">{gd.blNumber}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">{gd.importer.name}</p>
                    <p className="text-xs text-muted-foreground">{gd.hsCode} - {gd.goodsDescription}</p>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p className="font-mono text-sm">{formatCurrency(gd.invoiceValue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Duty</p>
                      <p className="font-mono text-sm font-medium text-accent">{formatCurrency(gd.totalDutyTax)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleEdit(gd); }}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleCopyRef(gd.gdNumber); }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(gd); }}>
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
                    <th>
                      <button 
                        className="flex items-center gap-1 hover:text-foreground"
                        onClick={() => toggleSort('gdNumber')}
                      >
                        GD Number
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th>Type</th>
                    <th>BL Number</th>
                    <th>Importer/Exporter</th>
                    <th>HS Code</th>
                    <th>
                      <button 
                        className="flex items-center gap-1 hover:text-foreground"
                        onClick={() => toggleSort('invoiceValue')}
                      >
                        Value
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th>Duty/Taxes</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gds.map((gd) => {
                    const status = statusConfig[gd.status as keyof typeof statusConfig] || statusConfig.draft;
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={gd.id}>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-mono font-medium">{gd.gdNumber}</span>
                            <span className="text-xs text-muted-foreground">{format(new Date(gd.filingDate), 'dd MMM yyyy')}</span>
                          </div>
                        </td>
                        <td>
                          <span className={cn('status-badge capitalize', typeConfig[gd.gdType])}>
                            {gd.gdType}
                          </span>
                        </td>
                        <td className="font-mono text-sm">{gd.blNumber}</td>
                        <td>{gd.importer.name}</td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-mono text-sm">{gd.hsCode}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{gd.goodsDescription}</span>
                          </div>
                        </td>
                        <td className="font-mono text-sm">{formatCurrency(gd.invoiceValue)}</td>
                        <td className="font-mono text-sm font-medium">{formatCurrency(gd.totalDutyTax)}</td>
                        <td>
                          <span className={cn('status-badge', status.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(gd)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(gd)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleCopyRef(gd.gdNumber)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy GD Number
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleView(gd)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(gd)}
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

        {gds.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No declarations found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by filing a new Goods Declaration'}
            </p>
            <Button variant="accent" onClick={() => { setSelectedGD(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              New GD
            </Button>
          </div>
        )}
      </div>

      <GDDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        gd={selectedGD}
        onSubmit={selectedGD ? (data) => updateGD(selectedGD.id, data) : handleCreate}
      />

      <GDViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        gd={selectedGD}
        onUpdateStatus={updateStatus}
      />
    </MainLayout>
  );
}
