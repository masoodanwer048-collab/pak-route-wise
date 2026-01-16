import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImportShipment, ImportStatus } from '@/hooks/useImports';
import { format } from 'date-fns';
import { Ship, FileCheck, DollarSign, Shield, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImportViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData: ImportShipment | null;
  onUpdateStatus: (id: string, status: ImportStatus) => void;
}

const statusConfig: Record<ImportStatus, { color: string; icon: React.ElementType; label: string; next?: ImportStatus }> = {
  pending: { color: 'bg-muted text-muted-foreground', icon: Ship, label: 'Pending', next: 'igm_filed' },
  igm_filed: { color: 'bg-info/10 text-info', icon: Ship, label: 'IGM Filed', next: 'gd_filed' },
  gd_filed: { color: 'bg-primary/10 text-primary', icon: FileCheck, label: 'GD Filed', next: 'assessed' },
  assessed: { color: 'bg-warning/10 text-warning', icon: DollarSign, label: 'Assessed', next: 'duty_paid' },
  duty_paid: { color: 'bg-accent/10 text-accent', icon: DollarSign, label: 'Duty Paid', next: 'examined' },
  examined: { color: 'bg-primary/10 text-primary', icon: Shield, label: 'Examined', next: 'released' },
  released: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Released', next: 'delivered' },
  delivered: { color: 'bg-success/10 text-success', icon: Truck, label: 'Delivered' },
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value);

export function ImportViewDialog({ open, onOpenChange, importData, onUpdateStatus }: ImportViewDialogProps) {
  if (!importData) return null;
  
  const status = statusConfig[importData.status];
  const StatusIcon = status.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Import: {importData.indexNumber}</span>
            <Badge className={cn(status.color)}><StatusIcon className="h-3 w-3 mr-1" />{status.label}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">BL Number</p>
              <p className="font-mono font-medium">{importData.blNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vessel</p>
              <p>{importData.vesselName} - {importData.voyageNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Importer</p>
              <p className="font-medium">{importData.importerName}</p>
              <p className="text-xs text-muted-foreground">NTN: {importData.importerNtn}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">HS Code</p>
              <p className="font-mono">{importData.hsCode}</p>
              <p className="text-sm text-muted-foreground">{importData.goodsDescription}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Invoice Value</p>
              <p className="text-lg font-mono font-bold">${importData.invoiceValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Duty & Taxes</p>
              <p className="text-lg font-mono font-bold text-accent">{formatCurrency(importData.totalDutyTax)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Containers</p>
              <div className="flex flex-wrap gap-1">
                {importData.containerNumbers.map(c => (
                  <Badge key={c} variant="outline" className="font-mono text-xs">{c}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Terminal</p>
              <Badge variant="outline">{importData.terminal}</Badge>
            </div>
          </div>
        </div>

        {status.next && (
          <div className="flex justify-end pt-4 border-t">
            <Button variant="accent" onClick={() => onUpdateStatus(importData.id, status.next!)}>
              Move to {statusConfig[status.next].label}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
